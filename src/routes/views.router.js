const { Router } = require('express');
const Avistamiento = require('../models/Avistamiento');

const { CATEGORIAS, ESTADOS } = Avistamiento;
const ZONAS_SUGERIDAS = ['Río Hacha', 'El Caraño', 'Serranía de Chiribiquete', 'Cordillera Oriental'];

const router = Router();

// Datos comunes a todas las vistas
router.use((req, res, next) => {
  res.locals.categorias = CATEGORIAS;
  res.locals.estados = ESTADOS;
  res.locals.zonas = ZONAS_SUGERIDAS;
  res.locals.error = req.query.error;
  next();
});

// GET /  -> listado + formulario de registro
router.get('/', async (req, res) => {
  const categoriaActual = req.query.categoria || '';
  const vista = { titulo: 'Avistamientos', categoriaActual, estadoPorDefecto: ESTADOS[0] };

  try {
    const filtro = categoriaActual ? { categoria: categoriaActual } : {};
    // .lean() devuelve objetos planos que Handlebars puede leer
    const avistamientos = await Avistamiento.find(filtro).sort({ fechaRegistro: -1 }).lean();
    res.render('home', { ...vista, avistamientos });
  } catch (error) {
    console.error(error);
    res.status(500).render('home', { ...vista, avistamientos: [], error: 'No se pudieron cargar los avistamientos' });
  }
});

// GET /editar/:id  -> formulario precargado
router.get('/editar/:id', async (req, res) => {
  try {
    const avistamiento = await Avistamiento.findById(req.params.id).lean();
    if (!avistamiento) {
      return res.redirect(`/?error=${encodeURIComponent('Avistamiento no encontrado')}`);
    }
    res.render('editar', { titulo: 'Editar avistamiento', avistamiento });
  } catch (error) {
    res.redirect(`/?error=${encodeURIComponent('ID no válido')}`);
  }
});

module.exports = router;
