const { Router } = require('express');
const { isValidObjectId } = require('mongoose');
const Avistamiento = require('../models/Avistamiento');

const router = Router();

const esFormulario = (req) =>
  req.headers['content-type']?.includes('application/x-www-form-urlencoded');

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

const camposActualizables = ({ estadoConservacion, zona }) => {
  const datos = {};
  if (estadoConservacion !== undefined && estadoConservacion !== '') datos.estadoConservacion = estadoConservacion;
  if (zona !== undefined && zona !== '') datos.zona = zona;
  return datos;
};

router.param('id', (req, res, next, id) => {
  if (isValidObjectId(id)) return next();
  const mensaje = `ID no válido: ${id}`;
  if (esFormulario(req)) return res.redirect(`/?error=${encodeURIComponent(mensaje)}`);
  return res.status(400).json({ error: mensaje });
});

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


router.get('/:id', async (req, res) => {
  try {
    const avistamiento = await Avistamiento.findById(req.params.id);
    if (!avistamiento) return res.status(404).json({ error: 'Avistamiento no encontrado' });
    res.status(200).json(avistamiento);
  } catch (error) {
    manejarError(req, res, error);
  }
});


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

const actualizar = async (req, res) => {
  try {
    const datos = camposActualizables(req.body ?? {});
    if (Object.keys(datos).length === 0) {
      const mensaje = 'Debe enviar estadoConservacion y/o zona para actualizar';
      if (esFormulario(req)) return res.redirect(`/?error=${encodeURIComponent(mensaje)}`);
      return res.status(400).json({ error: mensaje });
    }

    const actualizado = await Avistamiento.findByIdAndUpdate(req.params.id, datos, {
      returnDocument: 'after',
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


router.put('/:id', actualizar);
router.post('/update/:id', actualizar);


router.delete('/:id', eliminar);
router.post('/delete/:id', eliminar);

module.exports = router;
