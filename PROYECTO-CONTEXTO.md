# BSM Child Theme — Contexto completo del proyecto

## Stack
- WordPress child theme: `bsm-child` (parent: `bsm`)
- SCSS compilado manualmente
- ACF Pro para campos personalizados
- CPT: `proyecto` (slug: `proyecto`)
- Animaciones: anime.js (local), Swiper (CDN), JS custom

---

## Servidor y credenciales

| | |
|---|---|
| Servidor | `root@bsm.pe` |
| SSH key | `~/.ssh/id_ed25519` |
| QA URL | `https://qa.bsm.pe` |
| QA path | `/var/www/qa.bsm.pe/html/wp-content/themes/bsm-child/` |

---

## Comandos frecuentes

### Compilar SCSS
```bash
cd /Users/joseph/Work/bsm/wp-content/themes/bsm-child
sass style.scss style.css --no-source-map && cp style.css style.min.css
```
> **IMPORTANTE**: WordPress carga `style.min.css`, no `style.css`. Siempre copiar.

### Deploy a QA (rsync)
```bash
cd /Users/joseph/Work/bsm/wp-content/themes/bsm-child
rsync -az -e "ssh -i ~/.ssh/id_ed25519" \
  style.css style.min.css functions.php front-page.php single-proyecto.php acf-fields.php assets/js/custom.js \
  root@bsm.pe:/var/www/qa.bsm.pe/html/wp-content/themes/bsm-child/
```

### Deploy completo (todo el directorio)
```bash
cd /Users/joseph/Work/bsm/wp-content/themes/bsm-child
sass style.scss style.css --no-source-map && cp style.css style.min.css && \
rsync -az -e "ssh -i ~/.ssh/id_ed25519" . root@bsm.pe:/var/www/qa.bsm.pe/html/wp-content/themes/bsm-child/
```

---

## Estructura de archivos clave

```
wp-content/themes/bsm-child/
├── style.scss               # SCSS principal
├── style.css                # Compilado
├── style.min.css            # Copia de style.css — WordPress carga ESTE
├── _variables.scss
├── _header-interna.scss
├── _proyecto-interna.scss   # Estilos de single-proyecto
├── front-page.php           # Homepage
├── single-proyecto.php      # Detalle de proyecto
├── functions.php            # Enqueue, CPT, filtros
├── acf-fields.php           # Definición de ACF field groups
├── header.php
├── header-interna.php
├── favicon.png
└── assets/
    ├── js/
    │   ├── custom.js        # JS principal
    │   └── anime.min.js
    ├── css/
    │   └── clash-grotesk.css
    └── fonts/
        └── stylesheet.css   # @font-face
```

---

## Fuentes

- **Títulos**: `"Right Grotesk Compact"` — archivo: `RightGrotesk-CompactBold.woff2`
- **Cuerpo/UI**: `"Clash Grotesk"` — múltiples pesos en `/assets/fonts/`
- NO existe `Right Grotesk` sin "Compact" en los archivos locales

---

## Funciones JS en custom.js

| Función | Qué hace |
|---|---|
| `initHeroAnimation()` | Animación entrada hero del home |
| `initTagsScrollAnimation()` | Sección Experience — parallax sticky + fadeIn título |
| `initWorkStickyScroll()` | Scroll horizontal sección Work |
| `initGaleriaAnimation()` | FadeIn filas de galería en single-proyecto |
| `initProyectoAcordeon()` | Acordeón en single-proyecto |
| `initFooterAnimation()` | Parallax logo en footer |
| `initContactDrawer()` | Drawer de contacto |

---

## Footer parallax (implementación actual)

El footer tiene un wrapper de 200vh para crear scroll extra:

```html
<div class="bsm-footer-sticky-wrapper">
  <footer class="bsm-footer">...</footer>
</div>
```

```scss
.bsm-footer-sticky-wrapper { height: 200vh; position: relative; }
.bsm-footer { position: sticky; top: 0; height: 100vh; overflow: hidden; }
.footer-logo { position: absolute; bottom: 0; left: 10vw; width: 80vw; }
.footer-logo img { transform: translateY(80%); } /* JS lo anima a 0% */
```

---

## ACF Fields — Single Proyecto

| Campo | Tipo | Descripción |
|---|---|---|
| `proyecto_titulo_pagina` | text | Título h1 de la página |
| `proyecto_hero_imagen` | image | Banner principal |
| `proyecto_cliente` | text | Nombre del cliente |
| `proyecto_cat_anio` | text | Categoría / año |
| `proyecto_descripcion` | textarea | Descripción principal |
| `proyecto_acordeon` | textarea | Texto del acordeón expandible |
| `proyecto_tags_interna` | repeater (`texto`) | Pills de tags en interna |
| `proyecto_imagen_card` | image | Imagen para tarjeta en listado |
| `proyecto_categoria` | text | Categoría para tarjeta |
| `proyecto_tags` | repeater (`texto`) | Pills para tarjeta |
| `proyecto_filas` | repeater | **Galería por filas** (ver abajo) |

### Galería por filas (`proyecto_filas`)

```
proyecto_filas (repeater)
├── fila_layout: "full" | "half"
└── fila_bloques (sub-repeater)
    ├── bloque_tipo: "imagen" | "video_mp4" | "video_vimeo" | "video_youtube"
    ├── bloque_imagen (image) — visible si tipo = imagen
    ├── bloque_video_mp4 (file) — visible si tipo = video_mp4
    └── bloque_video_url (text) — visible si tipo = vimeo o youtube
```

Videos: autoplay, muted, loop, sin controles.
- Vimeo URL params: `?autoplay=1&muted=1&loop=1&background=1&controls=0`
- YouTube URL params: `?autoplay=1&mute=1&loop=1&playlist=ID&controls=0`

---

## Notas y gotchas importantes

1. **`animate-fade-up` en Experience** — NO usarlo en el título de la sección Experience. Conflicta con el JS parallax sticky que ya controla opacity/transform. El fadeIn del título está dentro de `initTagsScrollAnimation()`.

2. **Work sticky navbar** — `.bsm-work-container { top: 80px }` (no `top: 0` — se superpone al navbar).

3. **Acordeón del proyecto** — debe ser visualmente idéntico al del home. Botón `.proyecto-seguir-btn` de 74x51px, border-radius 50px, font-size 45px con `+` centrado.

4. **Fonts 404 en QA** — si las fuentes dan 404, verificar permisos: `chmod 644 /var/www/qa.bsm.pe/html/wp-content/themes/bsm-child/assets/fonts/stylesheet.css`

5. **Repositorio Git** — branch principal: `main`, working dir: `/Users/joseph/Work/bsm`
