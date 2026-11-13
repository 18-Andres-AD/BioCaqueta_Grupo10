require('dotenv').config({ quiet: true });
const path = require('path');
const express = require('express');
const { engine } = require('express-handlebars');

const connectDB = require('./config/db');
const apiRouter = require('./routes/api.router');
const viewsRouter = require('./routes/views.router');

const app = express();
const PORT = process.env.PORT || 8080;


const CATEGORIAS_UI = {
  Mamífero: { clase: 'mamifero', icono: 'mdi mdi-paw' },
  Ave: { clase: 'ave', icono: 'mdi mdi-bird' },
  Reptil: { clase: 'reptil', icono: 'mdi mdi-snake' },
  Anfibio: { clase: 'anfibio', icono: 'fa-solid fa-frog' },
  Flora: { clase: 'flora', icono: 'mdi mdi-leaf' },
};

const ESTADOS_UI = {
  'Preocupación menor': { clase: 'success', icono: 'bi-shield-check' },
  Vulnerable: { clase: 'warning', icono: 'bi-exclamation-triangle' },
  'En peligro': { clase: 'danger', icono: 'bi-exclamation-octagon' },
};

const helpers = {
  eq: (a, b) => a === b,
  formatoFecha: (fecha) =>
    new Date(fecha).toLocaleString('es-CO', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'America/Bogota',
    }),
  claseEstado: (estado) => ESTADOS_UI[estado]?.clase || 'secondary',
  iconoEstado: (estado) => ESTADOS_UI[estado]?.icono || 'bi-question-circle',
  claseCategoria: (categoria) => `cat-${CATEGORIAS_UI[categoria]?.clase || 'otro'}`,
  iconoCategoria: (categoria) => CATEGORIAS_UI[categoria]?.icono || 'mdi mdi-magnify',
};


app.engine(
  'handlebars',
  engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    helpers,
  })
);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/avistamientos', apiRouter);
app.use('/', viewsRouter);


app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));


app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ error: status >= 500 ? 'Error interno del servidor' : err.message });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Error al conectar con MongoDB Atlas:', err.message);
    process.exit(1);
  });
