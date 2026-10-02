# Diccionario de estilos

---

## 0. Identidad visual

### Logo
![LOGO](/assets/logo.png)

### Ícono de la app
![ICON](/assets/ICON_JEEP.png)

### Paleta de colores
![PALETA](/assets/COLORIMETRIA.jpeg)
### Tipografia Usada
![FUENTE](/assets/fuente.jpeg)

## 1. Paleta de colores

### 1.1 Colores de marca

| Token propuesto | Hex | Uso actual | Dónde se usa |
|---|---|---|---|
| `brand.blueDark` | `#1E3A8A` | Azul principal "oficial" (títulos, avatar, toggle de registro) | `Button` textSecondary NO, `ScreenHeader` variantes, `Register` toggle activo, `Perfil` avatar bg, cards (`cardTitle`) |
| `brand.blue` | `#0147B9` | Azul "secundario" usado como si fuera el principal en inputs y botones | `Field` label, `PickerField` label/opción activa, `Button` primary bg, `Toggle` activo/texto, `ScreenHeader` título, secciones (`MisResenasSection`, `ResenasSection`) |
| `brand.yellow` | `#F5B700` | Amarillo "oficial" | `Button` textPrimary, `Perfil` avatarText, `Register` toggle texto activo |
| `brand.gold` | `#FEBA03` | Dorado "secundario" usado como acento de foco/selección | `Field` borde en foco, `Button` borde secondary, `StarRating` estrella llena, `Toggle` texto activo |


### 1.2 Fondos

| Token propuesto | Hex | Uso |
|---|---|---|
| `bg.screen` | `#FDFBF6` | Fondo de pantalla (crema, casi blanco). Todas las screens (`usuario/*`, `negocio/*`) |
| `bg.surface` | `#FAF4E4` | Fondo de inputs, cards de reseñas/resultados, modales (sheet), toggle inactivo |
| `bg.overlayModal` | `rgba(0,0,0,0.4)` | Backdrop de `ServicioFormModal` / `ServicioEditModal` |
| `bg.overlayPicker` | `rgba(0,0,0,0.35)` | Backdrop de `PickerField` (más claro que el de los otros modales, sin razón aparente) |

### 1.3 Bordes y neutros

| Token propuesto | Hex | Uso |
|---|---|---|
| `border.soft` | `#E8D9B8` | Borde beige — inputs, cards de reseñas, divisores dentro de modales, Toggle |
| `border.neutral` | `#e5e5e5` | Borde gris — cards de servicios, contenedor de Login/Register, tab bar |
| `text.muted` | `#a3a3a3` | Placeholders, subtítulos, texto inactivo de tabs |
| `text.body` | `#171717` | Texto principal de inputs/cards |

### 1.4 Estados / feedback

| Token propuesto | Hex | Uso |
|---|---|---|
| `state.errorBorder` | `#ef4444` | Borde de input/caja de error |
| `state.errorText` | `#dc2626` | Texto de error |



## 2. Radios de borde (border-radius)

| Token propuesto | px | Dónde |
|---|---|---|
| `radius.sm` | `12` | Inputs (`Field`, `PickerField`), cards de reseñas/resultados, `Toggle` |
| `radius.md` | `16` | `Button`, card de "servicio publicado" (`app/negocio/servicios.tsx`) |
| `radius.lg` | `24` | Esquinas superiores de todos los modales tipo *bottom sheet*, card de Login/Register |
| `radius.full` | `50%` (mitad de w/h) | Avatar circular (72×72 → `borderRadius: 36`) |




## 3. Bordes (grosor)

| Token propuesto | px | Dónde |
|---|---|---|
| `borderWidth.divider` | `1` | `ScreenHeader` (borde inferior), encabezado de `ServicioFormModal`/`ServicioEditModal`, separador entre opciones del `PickerField` |
| `borderWidth.default` | `2` | Prácticamente todo lo demás: inputs, cards, `Button` secondary, caja de confirmación de borrado |


## 4. Sombras (elevation)

### 4.1 Sombra de botón primario (`Button.tsx`)
```
shadowColor: '#000'
shadowOffset: { width: 0, height: 2 }
shadowOpacity: 0.15
shadowRadius: 4
elevation: 2   // Android
```

### 4.2 Sombra de card grande (Login / Register)
```
shadowColor: '#000'
shadowOffset: { width: 0, height: 4 }
shadowOpacity: 0.08
shadowRadius: 12
elevation: 3   // Android
```


## 5. Transiciones y animaciones

| Elemento | Comportamiento actual |
|---|---|
| `Button` presionado | `opacity: 0.85` aplicado directo por `Pressable` (sin `Animated`, sin duración — es un salto, no una transición) |
| `Button` deshabilitado | `opacity: 0.5`, igual sin transición |
| `Field` en foco | Cambia el color de borde de `#E8D9B8` a `#FEBA03` instantáneamente |
| Modales (`ServicioFormModal`, `ServicioEditModal`, `ServicioReviewModal`) | `animationType="slide"` (nativo de `<Modal>`, sube desde abajo) |
| `PickerField` (selector de categoría/municipio) | `animationType="fade"` (aparece con fundido, **inconsistente** con el resto que usa slide) |


## 6. Botones

**Base (ambas variantes):**
- `borderRadius: 16`
- `padding: 16`
- `alignItems: center`

**Primary:**
- Fondo `#0147B9`
- Texto `#FEBA03`, `fontSize 16`, `fontWeight 600`
- Sombra (ver 4.1)

**Secondary:**
- Fondo `#FAF4E4`
- Borde `2px` color `#FEBA03`
- Texto `#0147B9`
- Sin sombra

**Estados:** `disabled` → opacity 0.5 · `pressed` → opacity 0.85


## 7. Campos de formulario (Fields)

### 7.1 `Field.tsx` (texto libre)
- Label: `#0147B9`, `14px`, `weight 600`
- Input: `radius 12`, `border 2px`, fondo `#FAF4E4`, `padding 14`, texto `#171717`, `16px`
- Border según estado:
  - Idle → `#E8D9B8`
  - Focus → `#FEBA03`
  - Error → `#ef4444`
- Mensaje de error debajo: `#dc2626`, `12px`, `weight 500`

### 7.2 `PickerField.tsx` (selector con modal)
- Mismo look que `Field` en reposo (radius 12, border 2px, fondo `#FAF4E4`)
- Al tocar, abre un modal tipo *bottom sheet* con `fade` (ver sección 5)
- Dentro del sheet: fondo `#FAF4E4`, esquinas superiores `24px`, opciones separadas por línea de `1px` color `#E8D9B8`, opción seleccionada en `#0147B9` bold

---

## 8. Cards

| Card | Radius | Borde | Fondo | Sombra |
|---|---|---|---|---|
| Servicio publicado (negocio) | 16 | 2px `#e5e5e5` | `#FDFBF6` | No |
| Reseña propia / de servicio | 12 | 2px `#E8D9B8` | `#FAF4E4` (propia) / transparente (de servicio) | No |
| Resultado de búsqueda (reseñas) | 12 | 2px `#E8D9B8` | `#FAF4E4` | No |
| Contenedor Login/Register | 24 | Sin borde | `#FDFBF6` | Sí (ver 4.2) |


## 9. Modales

Los 3 modales de formulario/edición/reseña (`ServicioFormModal`, `ServicioEditModal`, `ServicioReviewModal`) comparten exactamente el mismo esqueleto:

```
Modal:
  animationType: "slide"
  transparent: true

Backdrop:
  flex: 1
  backgroundColor: rgba(0,0,0,0.4)
  justifyContent: flex-end

Sheet:
  backgroundColor: #FAF4E4
  borderTopLeftRadius / borderTopRightRadius: 24
  maxHeight: 92%
  paddingTop: 16

Header:
  flexDirection: row
  justifyContent: space-between
  paddingHorizontal: 24
  paddingBottom: 12
  borderBottomWidth: 1        (solo en Form/Edit, no en Review)
  borderBottomColor: #E8D9B8

Título del header: 18px, weight 700, #0147B9
Botón cerrar (✕): 18px, #a3a3a3

Contenido: padding 24, gap 16

Caja de error: radius 12, border 2px #ef4444, fondo #FAF4E4, texto #dc2626 centrado
```
**Caja de confirmación de borrado** (dentro de `ServicioEditModal`): radius 12, borde 2px `#ef4444`, padding 16, texto `13px` `#171717`.    