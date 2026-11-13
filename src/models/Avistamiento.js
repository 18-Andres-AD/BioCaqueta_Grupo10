const { Schema, model } = require('mongoose');

const CATEGORIAS = ['Mamífero', 'Ave', 'Reptil', 'Anfibio', 'Flora'];
const ESTADOS = ['Preocupación menor', 'Vulnerable', 'En peligro'];

const avistamientoSchema = new Schema(
  {
    nombreComun: {
      type: String,
      required: [true, 'El nombre común es obligatorio'],
      trim: true,
    },
    nombreCientifico: {
      type: String,
      required: [true, 'El nombre científico es obligatorio'],
      trim: true,
    },
    categoria: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
      enum: { values: CATEGORIAS, message: 'Categoría no válida: {VALUE}' },
    },
    zona: {
      type: String,
      required: [true, 'La zona es obligatoria'],
      trim: true,
    },
    estadoConservacion: {
      type: String,
      enum: { values: ESTADOS, message: 'Estado de conservación no válido: {VALUE}' },
      default: 'Preocupación menor',
    },
    investigador: {
      type: String,
      required: [true, 'El investigador es obligatorio'],
      trim: true,
    },
    fechaRegistro: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

const Avistamiento = model('Avistamiento', avistamientoSchema, 'avistamientos');

module.exports = Avistamiento;
module.exports.CATEGORIAS = CATEGORIAS;
module.exports.ESTADOS = ESTADOS;
