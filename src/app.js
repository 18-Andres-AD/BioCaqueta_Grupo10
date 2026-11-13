require('dotenv').config({ quiet: true });
const path = require('path');
const express = require('express');
const { engine } = require('express-handlebars');

const connectDB = require('./config/db');
const helpers = require('./helpers/handlebars');
const apiRouter = require('./routes/api.router');
const viewsRouter = require('./routes/views.router');

const app = express();
const PORT = process.env.PORT || 8080;

// Motor de plantillas
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

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // CSS, JS e imágenes

// Rutas
app.use('/api/avistamientos', apiRouter);
app.use('/', viewsRouter);

// 404
app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

// Manejador de errores no controlados (p. ej. JSON mal formado)
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
