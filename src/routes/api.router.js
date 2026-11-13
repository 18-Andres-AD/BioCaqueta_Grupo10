const { Router } = require('express');
const { isValidObjectId } = require('mongoose');
const Avistamiento = require('../models/Avistamiento');

const router = Router();

// ¿La petición viene de un formulario HTML (Handlebars)?
const esFormulario = (req) =>
  req.headers['content-type']?.includes('application/x-www-form-urlencoded');

// Traduce errores de Mongoose a códigos HTTP adecuados
const manejarError = (req, res, error) => {
  let status = 500;
  let mensaje = 'Error interno del servidor';

  if (error.name === 'ValidationError') {
    status = 400;
    mensaje = Object.values(error.errors).map((e) => e.message).join('. ');
  } else if (error.name === 'CastError') {
    status = 400;
    mensaje = `ID no válido: ${error.value}`;
  } else {
    console.error(error);
  }

  if (esFormulario(req)) {
    return res.redirect(`/?error=${encodeURIComponent(mensaje)}`);
  }
  return res.status(status).json({ error: mensaje });
};

// Solo se permiten actualizar estos campos (RF-02.3)
const camposActualizables = ({ estadoConservacion, zona }) => {
  const datos = {};
  if (estadoConservacion !== undefined && estadoConservacion !== '') datos.estadoConservacion = estadoConservacion;
  if (zona !== undefined && zona !== '') datos.zona = zona;
  return datos;
};

// Valida que :id sea un ObjectId de MongoDB antes de consultar
router.param('id', (req, res, next, id) => {
  if (isValidObjectId(id)) return next();
  const mensaje = `ID no válido: ${id}`;
  if (esFormulario(req)) return res.redirect(`/?error=${encodeURIComponent(mensaje)}`);
  return res.status(400).json({ error: mensaje });
});

// 1. GET /api/avistamientos  (filtro opcional ?categoria=Ave)
router.get('/', async (req, res) => {
  try {
    const filtro = {};
    if (req.query.categoria) filtro.categoria = req.query.categoria;

    const avistamientos = await Avistamiento.find(filtro).sort({ fechaRegistro: -1 });
    res.status(200).json(avistamientos);
  } catch (error) {
    manejarError(req, res, error);
  }
});

// GET /api/avistamientos/:id  (extra: consultar uno)
router.get('/:id', async (req, res) => {
  try {
    const avistamiento = await Avistamiento.findById(req.params.id);
    if (!avistamiento) return res.status(404).json({ error: 'Avistamiento no encontrado' });
    res.status(200).json(avistamiento);
  } catch (error) {
    manejarError(req, res, error);
  }
});

// 2. POST /api/avistamientos  (JSON desde Postman o form-urlencoded desde Handlebars)
router.post('/', async (req, res) => {
  try {
    const { nombreComun, nombreCientifico, categoria, zona, estadoConservacion, investigador } = req.body ?? {};
    const datos = { nombreComun, nombreCientifico, categoria, zona, investigador };
    if (estadoConservacion) datos.estadoConservacion = estadoConservacion;

    const nuevo = await Avistamiento.create(datos);

    if (esFormulario(req)) return res.redirect('/');
    res.status(201).json(nuevo);
  } catch (error) {
    manejarError(req, res, error);
  }
});

// Lógica compartida de actualización
const actualizar = async (req, res) => {
  try {
    const datos = camposActualizables(req.body ?? {});
    if (Object.keys(datos).length === 0) {
      const mensaje = 'Debe enviar estadoConservacion y/o zona para actualizar';
      if (esFormulario(req)) return res.redirect(`/?error=${encodeURIComponent(mensaje)}`);
      return res.status(400).json({ error: mensaje });
    }

    const actualizado = await Avistamiento.findByIdAndUpdate(req.params.id, datos, {
      returnDocument: 'after', // devuelve el documento ya actualizado
      runValidators: true,
    });

    if (!actualizado) {
      if (esFormulario(req)) return res.redirect(`/?error=${encodeURIComponent('Avistamiento no encontrado')}`);
      return res.status(404).json({ error: 'Avistamiento no encontrado' });
    }

    if (esFormulario(req)) return res.redirect('/');
    res.status(200).json(actualizado);
  } catch (error) {
    manejarError(req, res, error);
  }
};

// Lógica compartida de eliminación
const eliminar = async (req, res) => {
  try {
    const eliminado = await Avistamiento.findByIdAndDelete(req.params.id);

    if (!eliminado) {
      if (esFormulario(req)) return res.redirect(`/?error=${encodeURIComponent('Avistamiento no encontrado')}`);
      return res.status(404).json({ error: 'Avistamiento no encontrado' });
    }

    if (esFormulario(req)) return res.redirect('/');
    res.status(200).json({ mensaje: 'Avistamiento eliminado', avistamiento: eliminado });
  } catch (error) {
    manejarError(req, res, error);
  }
};

// 3. PUT /api/avistamientos/:id  +  POST /api/avistamientos/update/:id (formularios)
router.put('/:id', actualizar);
router.post('/update/:id', actualizar);

// 4. DELETE /api/avistamientos/:id  +  POST /api/avistamientos/delete/:id (botones)
router.delete('/:id', eliminar);
router.post('/delete/:id', eliminar);

module.exports = router;
