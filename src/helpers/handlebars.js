const iconos = require('./iconos');

// Estilo visual de cada estado de conservación (clase Bootstrap + ícono)
const ESTADOS_UI = {
  'Preocupación menor': { clase: 'success', icono: 'bi-shield-check' },
  Vulnerable: { clase: 'warning', icono: 'bi-exclamation-triangle' },
  'En peligro': { clase: 'danger', icono: 'bi-exclamation-octagon' },
};

const eq = (a, b) => a === b;

const formatoFecha = (fecha) =>
  new Date(fecha).toLocaleString('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'America/Bogota',
  });

const claseEstado = (estado) => ESTADOS_UI[estado]?.clase || 'secondary';

const iconoEstado = (estado) => ESTADOS_UI[estado]?.icono || 'bi-question-circle';

module.exports = { eq, formatoFecha, claseEstado, iconoEstado, ...iconos };
