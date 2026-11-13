const { Router } = require('express');
const Avistamiento = require('../models/Avistamiento');
const { CATEGORIAS, ESTADOS } = require('../models/Avistamiento');

const router = Router();

// 1. GET /  -> listado + formulario de registro
router.get('/', async (req, res) => {
  try {
    const filtro = {};
    if (req.query.categoria) filtro.categoria = req.query.categoria;

    // .lean() devuelve objetos planos que Handlebars puede leer
    const avistamientos = await Avistamiento.find(filtro).sort({ fechaRegistro: -1 }).lean();

    res.render('home', {
      titulo: 'Avistamientos',
      avistamientos,
      categorias: CATEGORIAS,
      estados: ESTADOS,
      categoriaActual: req.query.categoria || '',
      error: req.query.error,
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('home', { titulo: 'Avistamientos', avistamientos: [], categorias: CATEGORIAS, estados: ESTADOS, error:'No se pudieron cargar los avistamientos' });
  }
});

// 2. GET /editar/:id  -> formulario precargado
router.get('/editar/:id', async (req, res) => {
  try {
    const avistamiento = await Avistamiento.findById(req.params.id).lean();
    if (!avistamiento) {
      return res.redirect(`/?error=${encodeURIComponent('Avistamiento no encontrado')}`);
    }
    res.render('editar', { titulo: 'Editar avistamiento', avistamiento, estados: ESTADOS });
  } catch (error) {
    res.redirect(`/?error=${encodeURIComponent('ID no válido')}`);
  }
});

module.exports = router;
