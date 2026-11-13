require('dotenv').config({ quiet: true });
const path = require('path');
const express = require('express');
const { engine } = require('express-handlebars');

const connectDB = require('./config/db');
const iconos = require('./helpers/iconos');
const apiRouter = require('./routes/api.router');
const viewsRouter = require('./routes/views.router');

const app = express();
const PORT = process.env.PORT || 8080;

app.engine(
  'handlebars',
  engine({
    defaultLayout: 'main',
    helpers: {
      eq: (a, b) => a === b,
      formatoFecha: (fecha) =>
        new Date(fecha).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Bogota' }),
      claseEstado: (estado) =>
        ({ 'Preocupación menor': 'success', Vulnerable: 'warning', 'En peligro': 'danger' })[estado] || 'secondary',
      ...iconos,
    },
  })
);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/avistamientos', apiRouter);
app.use('/', viewsRouter);

app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Error al conectar con MongoDB Atlas:', err.message);
    process.exit(1);
  });
