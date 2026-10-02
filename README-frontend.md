# Parche Viajero — App móvil

App móvil (iOS / Android / Web) de **Parche Viajero**, construida con **Expo Router** y **React Native**. Permite a viajeros descubrir, reseñar y guardar lugares (restaurantes, hoteles, atractivos, cafeterías, bares) en Caldas, y a negocios publicar y administrar sus propios lugares.

---

## Tabla de contenido

- [Stack tecnológico](#stack-tecnológico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Variables de entorno](#variables-de-entorno)
- [Scripts disponibles](#scripts-disponibles)
- [Navegación y roles de usuario](#navegación-y-roles-de-usuario)
- [Autenticación](#autenticación)
- [Capa de API](#capa-de-api)
- [Selector de mapa (MapPicker)](#selector-de-mapa-mappicker)
- [Convenciones de estilo](#convenciones-de-estilo)
- [Roadmap / pendientes conocidos](#roadmap--pendientes-conocidos)

---

## Stack tecnológico

- **Framework:** Expo 57 + Expo Router 57 (navegación basada en archivos)
- **UI:** React Native 0.86, React 19.2
- **Estilos:** NativeWind 4 (Tailwind para React Native) + `StyleSheet` inline
- **Formularios:** `react-hook-form`
- **Mapas:** Google Maps JS API embebido vía `react-native-webview` (nativo) / DOM directo (web)
- **Íconos:** `@expo/vector-icons` (Ionicons)
- **Lenguaje:** TypeScript (`strict: true`)

---

## Estructura del proyecto

```
app/                          # Rutas (Expo Router: cada archivo = una pantalla)
├── _layout.tsx                # Layout raíz: AuthProvider + Stack condicional por rol
├── index.tsx                  # Redirección inicial según sesión y tipo de usuario
├── login.tsx
├── register.tsx
├── usuario/                   # Tabs del rol "registrado" (viajero)
│   ├── _layout.tsx             # Tabs: Inicio, Mapa, Perfil
│   ├── inicio.tsx
│   ├── mapa.tsx
│   └── perfil.tsx
└── negocio/                   # Tabs del rol "negocio"
    ├── _layout.tsx             # Tabs: Mapa, Servicios, Perfil
    ├── mapa.tsx
    ├── servicios.tsx           # CRUD de los lugares del negocio
    └── perfil.tsx

src/
├── api/                       # Funciones que llaman al backend (fetch tipado)
│   ├── client.ts                # Wrapper de fetch: base URL, token, manejo de errores
│   ├── usuario.ts
│   ├── servicio.ts
│   ├── resena.ts
│   ├── categoria.ts
│   └── municipio.ts
├── context/
│   └── AuthContext.tsx         # Estado global de sesión (user, login, logout, register)
├── components/
│   ├── Button.tsx, Field.tsx, PickerField.tsx, Toggle.tsx, StarRating.tsx
│   ├── ScreenHeader.tsx
│   ├── ServicioFormModal.tsx    # Modal de creación de servicio (negocio)
│   ├── ServicioEditModal.tsx    # Modal de edición/borrado de servicio (negocio)
│   ├── ServicioReviewModal.tsx  # Modal de detalle + reseñas de un servicio (viajero)
│   ├── ResenasSection.tsx       # Buscador de lugares para reseñar
│   ├── MisResenasSection.tsx    # Reseñas propias del usuario
│   ├── FavoritosSection.tsx     # Placeholder estático, sin lógica real aún
│   └── MapPicker.native.tsx / MapPicker.web.tsx   # Selector de ubicación multiplataforma
├── types.ts                   # (vacío por ahora)
└── global.css                 # Directivas Tailwind
```

---

## Requisitos previos

- Node.js ≥ 18.20
- npm
- [Expo Go](https://expo.dev/go) en tu celular, o un emulador Android / simulador iOS configurado
- Una API Key de **Google Maps JavaScript API** habilitada (para el selector de ubicación)
- El backend corriendo (ver README del backend) y accesible desde tu dispositivo/emulador

---

## Instalación

```bash
git clone <url-del-repositorio>
cd <carpeta-del-frontend>
npm install
```

Crea el archivo de variables de entorno (siguiente sección) y luego:

```bash
npm start
```

Esto abre el Metro Bundler; desde ahí puedes escanear el QR con Expo Go, o presionar `a` / `i` / `w` para abrir en Android / iOS / Web respectivamente.

---

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto (Expo expone automáticamente las variables prefijadas con `EXPO_PUBLIC_`):

```env
# URL base de la API backend
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# API Key de Google Maps (JavaScript API)
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=tu-api-key-aqui
```

> Si vas a probar en un dispositivo físico o emulador, `localhost` no apunta a tu máquina de desarrollo. Usa la IP de tu red local (ej. `http://192.168.1.10:3000/api`) o un túnel (ngrok, etc.).

> Estas variables son `EXPO_PUBLIC_`, es decir, **se incluyen en el bundle del cliente y son visibles públicamente**. No pongas ahí secretos sensibles — solo la API key de Maps (restringida por dominio/paquete en Google Cloud Console) y la URL pública de la API.

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm start` | Levanta Metro Bundler (elige plataforma desde la terminal) |
| `npm run android` | Abre directamente en emulador/dispositivo Android |
| `npm run ios` | Abre directamente en simulador/dispositivo iOS |
| `npm run web` | Abre la versión web en el navegador |

---

## Navegación y roles de usuario

El `RootLayout` (`app/_layout.tsx`) envuelve todo en `AuthProvider` y decide qué grupo de rutas mostrar usando `Stack.Protected` según el estado de sesión:

- **Sin sesión** → `login` / `register`
- **Sesión + `tipo_usuario === 'registrado'`** → grupo `usuario/` (tabs: Inicio, Mapa, Perfil)
- **Sesión + `tipo_usuario === 'negocio'`** → grupo `negocio/` (tabs: Mapa, Servicios, Perfil)

`app/index.tsx` hace la redirección inicial (`/login`, `/negocio/mapa` o `/usuario/inicio`) según el usuario cargado en el contexto.

---

## Autenticación

`AuthContext` (`src/context/AuthContext.tsx`) centraliza:

- `login(email, contrasena)` — llama al backend, guarda el token en el cliente HTTP y carga el usuario actual.
- `register(...)` — crea el usuario y encadena automáticamente un `login` (el backend no retorna token al registrar).
- `logout()` — invalida la sesión en el backend y limpia el estado local.
- `refreshUser()` — vuelve a pedir `/usuarios/me`.

> **El token se guarda solo en memoria** (`src/api/client.ts`, variable `token` en el módulo). Esto significa que **la sesión se pierde al cerrar la app**. Para persistencia entre aperturas, hay que integrar `expo-secure-store` o `AsyncStorage` y restaurar el token al iniciar la app.

---

## Capa de API

Todas las llamadas HTTP pasan por `src/api/client.ts`, que:

- Arma la URL con `EXPO_PUBLIC_API_URL`.
- Agrega automáticamente el header `Authorization: Bearer <token>` si hay sesión.
- Normaliza errores del backend (`message`, `error` string o array de strings de Zod) en un `Error` de JS legible.

Cada recurso tiene su propio archivo en `src/api/` con funciones tipadas (`getServicios`, `createServicio`, `login`, `createResena`, etc.), que reflejan uno a uno los endpoints del backend.

---

## Selector de mapa (MapPicker)

`MapPicker` tiene dos implementaciones que Expo/Metro resuelve automáticamente según la plataforma (gracias a `moduleSuffixes` en `tsconfig.json`):

- **`MapPicker.native.tsx`** — renderiza un mapa de Google Maps dentro de un `WebView`, comunicándose con React Native vía `postMessage`.
- **`MapPicker.web.tsx`** — carga el script de Google Maps JS directamente en el DOM del navegador.

Ambas versiones permiten tocar/arrastrar un pin o escribir coordenadas manualmente, y se usan en `ServicioFormModal` y `ServicioEditModal` para que un negocio ubique su lugar en el mapa.

---

## Convenciones de estilo

- Paleta principal: azul `#1E3A8A` / `#0147B9` (marca), dorado `#F5B700` / `#FEBA03` (acentos), fondo crema `#FDFBF6` / `#FAF4E4`.
- Los estilos se definen con `StyleSheet.create` al final de cada componente (NativeWind está instalado pero convive con estilos inline en la mayoría de pantallas actuales).
- Los formularios usan `react-hook-form` + el componente `Field` genérico, con validaciones inline (`rules`) y mensajes en español.

---

## Roadmap / pendientes conocidos

- [ ] Persistir el token de sesión (actualmente solo vive en memoria).
- [ ] Implementar `FavoritosSection` con lógica real (falta también el backend de favoritos).
- [ ] Implementar las pantallas de mapa (`usuario/mapa.tsx`, `negocio/mapa.tsx`), hoy son placeholders de texto, reutilizando la lógica de `MapPicker` para pintar los servicios como pines.
- [ ] Subida de fotos de servicio (no hay UI ni endpoint todavía).
- [ ] Mejorar el buscador de `ResenasSection` (hoy trae todos los servicios y filtra en cliente) con filtros por categoría/municipio y, si aplica, paginación.
