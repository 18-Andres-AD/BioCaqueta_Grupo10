# BioCaqueta_Grupo10

Sistema de Monitoreo de Biodiversidad y Avistamientos del Piedemonte Amazónico — Universidad de la Amazonia.

**Stack:** Node.js · Express (express.Router) · Mongoose · MongoDB Atlas · Express-Handlebars · Postman

## Instalación

```bash
npm install
cp .env.example .env   # y colocar la URI de MongoDB Atlas
npm run dev            # o npm start
```

Abrir http://localhost:8080

## Variables de entorno (.env)

| Variable      | Descripción                                   |
|---------------|-----------------------------------------------|
| `MONGODB_URI` | Cadena de conexión `mongodb+srv://...` de Atlas |
| `PORT`        | Puerto del servidor (por defecto 8080)        |

La aplicación usa siempre la base de datos `biocaqueta_db`, colección `avistamientos`.

## API REST — `/api/avistamientos`

| Método | Ruta                               | Descripción                                   |
|--------|------------------------------------|-----------------------------------------------|
| GET    | `/api/avistamientos`               | Lista (más reciente primero). `?categoria=Ave` |
| GET    | `/api/avistamientos/:id`           | Obtiene un avistamiento                        |
| POST   | `/api/avistamientos`               | Crea (JSON → 201, formulario → redirect `/`)   |
| PUT    | `/api/avistamientos/:id`           | Actualiza `estadoConservacion` y/o `zona`      |
| POST   | `/api/avistamientos/update/:id`    | Igual que PUT, para formularios HTML           |
| DELETE | `/api/avistamientos/:id`           | Elimina                                        |
| POST   | `/api/avistamientos/delete/:id`    | Igual que DELETE, para botones HTML            |

Códigos: `200` OK · `201` creado · `400` validación / ID inválido · `404` no encontrado · `500` error interno.

## Estructura

```
src/
├── app.js                  # Configuración de Express, Handlebars y middlewares
├── config/db.js            # Conexión a MongoDB Atlas (Mongoose)
├── models/Avistamiento.js  # Esquema y validaciones
├── routes/
│   ├── api.router.js       # API REST (JSON + formularios)
│   └── views.router.js     # Rutas que renderizan vistas
├── public/                 # Archivos estáticos servidos por express.static
│   ├── css/styles.css
│   └── js/main.js
└── views/
    ├── layouts/main.handlebars
    ├── home.handlebars
    └── editar.handlebars
```

Las plantillas no contienen CSS ni JavaScript en línea: los estilos están en `public/css/styles.css`
y el comportamiento (confirmar eliminación, filtro automático, spinner) en `public/js/main.js`
mediante atributos `data-*`.

## Vistas

- `GET /` — formulario de registro + tabla de avistamientos (con filtro por categoría, Editar y Eliminar).
- `GET /editar/:id` — formulario precargado para cambiar zona y estado de conservación.

## Postman

Importar `postman/BioCaqueta.postman_collection.json`. La petición POST guarda el `_id` creado en la variable `id`, que usan PUT y DELETE.
