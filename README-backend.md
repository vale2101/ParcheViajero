# Parche Viajero — Backend

API REST para **Parche Viajero**, una app de turismo enfocada en Caldas (Manizales, Villamaría, Neira, Chinchiná) que conecta viajeros con negocios locales (restaurantes, hoteles, atractivos turísticos, cafeterías, bares).

Construida con **Express + TypeScript** y **MongoDB** (driver nativo, sin ODM), usando **Zod** para validación de esquemas y **JWT** para autenticación.

---

## Tabla de contenido

- [Arquitectura y modelo de datos](#arquitectura-y-modelo-de-datos)
- [Stack tecnológico](#stack-tecnológico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Variables de entorno](#variables-de-entorno)
- [Inicializar la base de datos](#inicializar-la-base-de-datos)
- [Scripts disponibles](#scripts-disponibles)
- [Documentación de la API](#documentación-de-la-api)
- [Autenticación](#autenticación)
- [Notas de seguridad para producción](#notas-de-seguridad-para-producción)
- [Roadmap / pendientes conocidos](#roadmap--pendientes-conocidos)

---

## Arquitectura y modelo de datos

El modelo sigue un cambio de diseño clave respecto a versiones anteriores: **ya no existe una colección `negocios` separada**. Un negocio es simplemente un `usuario` con `tipo_usuario_id` apuntando al tipo `"negocio"`. Cada usuario tipo negocio puede publicar varios `servicios` (lugares/establecimientos), y tanto las reseñas como los favoritos apuntan al `servicio` (el lugar), no a la cuenta del dueño.

### Colecciones

| Colección | Descripción | Relaciones |
|---|---|---|
| `tipos_usuario` | `"negocio"` o `"registrado"` | — |
| `usuarios` | Registro básico: nombre, correo, contraseña (hash) | `tipo_usuario_id` → `tipos_usuario` |
| `municipios` | Manizales, Villamaría, Neira, Chinchiná | — |
| `categorias` | Restaurante, Hotel, Atractivo turístico, Cafetería, Bar | — |
| `servicios` | Cada lugar/establecimiento publicado por un usuario tipo negocio | `usuario_id` → `usuarios`, `categoria_id` → `categorias`, `municipio_id` → `municipios` |
| `imagenes_servicio` | Fotos de cada lugar ( definida en el esquema, sin endpoints implementados aún) | `servicio_id` → `servicios` |
| `resenas` | Calificación (1-5) + comentario de un usuario sobre un servicio | `usuario_id` → `usuarios`, `servicio_id` → `servicios` |
| `favoritos` | Lugares guardados por un usuario (definida en el esquema, sin endpoints implementados aún) | `usuario_id` → `usuarios`, `servicio_id` → `servicios` |

### Índices relevantes

- `usuarios.email` — único
- `resenas.{usuario_id, servicio_id}` — único (un usuario solo puede reseñar un servicio una vez)
- `favoritos.{usuario_id, servicio_id}` — único
- `servicios.ubicacion` — `2dsphere` (geoespacial, pensado para futuras búsquedas por cercanía/mapa)

---

## Stack tecnológico

- **Runtime:** Node.js (ESM, `"type": "module"`)
- **Framework:** Express 4
- **Lenguaje:** TypeScript 5 (modo `strict`, `nodenext`)
- **Base de datos:** MongoDB 6 (driver nativo `mongodb`, sin Mongoose)
- **Validación:** Zod
- **Auth:** `jsonwebtoken` + `bcryptjs`, token vía cookie `httpOnly` **y** header `Authorization: Bearer`
- **Otros:** `cors`, `cookie-parser`, `dotenv`
- **Dev tooling:** `tsx` (ejecución directa de TS), `nodemon`

---

## Estructura del proyecto

```
src/
├── controller/          # Lógica de request/response por recurso
│   ├── usuario.controller.ts
│   ├── servicio.controller.ts
│   ├── resena.controller.ts
│   ├── categoria.controller.ts
│   └── municipio.controller.ts
├── models/               # Acceso a datos (queries a MongoDB)
│   ├── usuario.model.ts
│   ├── servicio.model.ts
│   ├── resena.model.ts
│   ├── categoria.model.ts
│   └── municipio.model.ts
├── routes/               # Definición de endpoints por recurso
├── schemas/              # Esquemas Zod para validar request body
├── interfaces/           # Tipos TypeScript de los documentos Mongo
├── middleware/
│   ├── auth.middleware.ts          # requireAuth: valida JWT
│   └── validateSchemas.middleware.ts
├── db/
│   └── connection.ts     # Singleton de conexión a MongoDB
├── utils/
│   └── httpStatus.ts     # Enum de códigos HTTP
├── server.ts             # Configuración de Express (middlewares + rutas)
└── index.ts              # Punto de entrada: conecta a Mongo y levanta el server
```

---

## Requisitos previos

- Node.js ≥ 18.20 (o la versión LTS activa recomendada)
- Una instancia de MongoDB accesible (local, Docker o Atlas)
- npm (o el gestor de paquetes de tu preferencia)

---

## Instalación

```bash
git clone <url-del-repositorio>
cd <carpeta-del-backend>
npm install
```

Crea el archivo de variables de entorno (ver siguiente sección) y luego:

```bash
npm run dev
```

El servidor arranca por defecto en `http://localhost:3000`.

---

## Variables de entorno

Crea un archivo `.env` en la raíz del backend:

```env
# Puerto en el que escucha el servidor
PORT=3000

# Conexión a MongoDB
DB_URI=mongodb://localhost:27017
DBNAME=parche_viajero

# Secreto para firmar los JWT (usa un valor largo y aleatorio en producción)
JWT_SECRET=cambia-esto-por-un-secreto-fuerte

# Entorno de ejecución (afecta flags de cookies: secure / sameSite)
NODE_ENV=development
```

> **Importante:** si `JWT_SECRET` no está definido, el código cae a un valor por defecto (`"clave-secreta"`) hardcodeado en `auth.middleware.ts` y `usuario.controller.ts`. **Nunca despliegues a producción sin definir esta variable explícitamente.**

---

## Inicializar la base de datos

El repositorio incluye un script (`parche_viajero_mongo_v2.js`) que crea las colecciones con sus validadores `$jsonSchema`, los índices, y siembra los datos base (`tipos_usuario`, `municipios`, `categorias`).

Ejecútalo con `mongosh` apuntando a tu instancia:

```bash
mongosh "mongodb://localhost:27017" < parche_viajero_mongo_v2.js
```

Esto:
1. Crea las 8 colecciones con sus validadores.
2. Crea los índices (incluido el `2dsphere` de `servicios.ubicacion`).
3. Inserta los tipos de usuario, municipios y categorías semilla.

> Nota: el script asume que ya existe (o se creará) la base `parche_viajero` mediante `use("parche_viajero")`. Si usas un `DBNAME` distinto en tu `.env`, ajusta esa línea del script o el nombre de la base al ejecutarlo.

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Levanta el servidor en modo desarrollo con recarga automática (`nodemon` + `tsx`) |
| `npm run build` | Compila TypeScript a `dist/` según `tsconfig.json` |
| `npm start` | Ejecuta el build compilado (`node ./dist/index.js`) — usar en producción |

---

## Documentación de la API

Base URL: `http://localhost:3000/api`

### Usuarios — `/usuarios`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/createUsuario` | No | Registra un usuario (`negocio` o `registrado`) |
| POST | `/login` | No | Login, retorna JWT (cookie + body) |
| POST | `/logout` | No | Limpia la cookie de sesión |
| GET | `/me` | Cookie/Bearer | Retorna el usuario autenticado actual (con `tipo_usuario`) |
| GET | `/getUsuarios` | No | Lista todos los usuarios |
| GET | `/findUsuarioById/:id` | No | Usuario por ID |
| PUT | `/updateUsuario/:id` | No* | Actualiza nombre/email/teléfono/contraseña |
| DELETE | `/delete/:id` | No* | Elimina un usuario |

*Estos endpoints no tienen `requireAuth` aplicado actualmente — ver [Roadmap](#roadmap--pendientes-conocidos).

### Servicios (lugares) — `/servicios`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/getServicios` | No | Lista todos los servicios |
| GET | `/findServicioById/:id` | No | Servicio por ID |
| POST | `/createServicio` | **Sí** | Crea un servicio; el dueño es siempre `req.userId` (no lo que venga en el body) |
| PUT | `/updateServicio/:id` | **Sí** | Solo el dueño puede editar |
| DELETE | `/delete/:id` | **Sí** | Solo el dueño puede eliminar |

Body de creación (`createServicioSchema`): `categoria_id`, `municipio_id`, `nombre`, `latitud`, `longitud` (obligatorios); `descripcion`, `direccion`, `telefono`, `horario_atencion`, `precio` (opcionales).

### Reseñas — `/resenas`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/getResenas` | Lista todas las reseñas |
| GET | `/findResenaById/:id` | Reseña por ID |
| GET | `/findResenasByServicio/:servicioId` | Reseñas de un servicio específico |
| POST | `/createResena` | Crea reseña (1-5 estrellas + comentario opcional). Un usuario solo puede reseñar un servicio una vez |
| PUT | `/updateResena/:id` | Actualiza calificación/comentario |
| DELETE | `/delete/:id` | Elimina una reseña |

### Categorías — `/categorias` (solo lectura)

`GET /getCategorias`, `GET /findCategoriaById/:id`

### Municipios — `/municipios` (solo lectura)

`GET /getMunicipios`, `GET /findMunicipioById/:id`

### Formato de respuesta

Éxito: `{ "data": [...] }` o `{ "message": "..." }`
Error: `{ "message": "..." }` o `{ "error": [...] }` (errores de validación Zod)

---

## Autenticación

1. El usuario hace `POST /usuarios/login` con `email` y `contrasena`.
2. El backend valida la contraseña con `bcrypt`, genera un JWT (`{ userId, tipo_usuario }`, expira en 1h) y lo envía de dos formas:
   - Cookie `httpOnly` llamada `token`.
   - En el body de la respuesta (`token`), para clientes que no manejan cookies (apps móviles).
3. Las rutas protegidas usan `requireAuth`, que busca el token primero en la cookie y si no está, en el header `Authorization: Bearer <token>`.
4. `req.userId` y `req.tipoUsuario` quedan disponibles en los controladores tras pasar el middleware.

---

## Notas de seguridad para producción

- Define `JWT_SECRET` con un valor fuerte y único; no dependas del fallback del código.
- CORS está configurado con `origin: true` (refleja cualquier origen que llame) + `credentials: true`. Restringe esto a los dominios reales del frontend antes de desplegar.
- Las cookies usan `secure: true` y `sameSite: "none"` solo cuando `NODE_ENV=production`; confirma que tu despliegue sirva sobre HTTPS para que esto funcione correctamente.
- Los endpoints de `updateUsuario` y `deleteUsuario` no están protegidos con `requireAuth` — cualquiera con el ID puede llamarlos.

---

## Roadmap / pendientes conocidos

- [ ] Implementar `favoritos` (interface, model, controller, routes) — la colección y su índice único ya existen en Mongo.
- [ ] Implementar `imagenes_servicio` (subida/asociación de fotos a un servicio).
- [ ] Proteger `updateUsuario` / `deleteUsuario` con `requireAuth` y verificación de que el usuario solo pueda modificar su propia cuenta.
- [ ] Endpoint de búsqueda geoespacial usando el índice `2dsphere` de `servicios.ubicacion` (para el mapa).
- [ ] Filtros server-side para `getServicios` (por categoría, municipio, texto) en lugar de traer todo y filtrar en el cliente.
