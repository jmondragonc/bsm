# Plan de Desarrollo — Feedback Cliente BSM

> Fecha: 2026-03-20
> Rama base: `main`
> Una rama por bloque, mergear en orden.

---

## Bloque A — Sección "Experiencia de Marca": Texto y Patillas
**Rama:** `feat/experiencia-texto-patillas`

### Punto 4 — Texto flota desde abajo al hacer scroll
- **Qué cambiar:** El título "CREAMOS UNA EXPERIENCIA DE MARCA COMPLETA" debe entrar translateY desde abajo (ej. `+100px → 0`)
- **Sin transparencia:** Eliminar cualquier animación de `opacity` en este elemento; solo movimiento vertical
- **Trigger:** Cuando el scroll alcanza 1 bloque (≈ `100vh`) de margen superior desde el top del sticky wrapper

### Punto 5 — Patillas (tags) vienen desde abajo
- **Qué cambiar:** Los 8 tags (BRANDING, NAMING, PACKAGING, etc.) deben entrar con `translateY` desde abajo
- **Sin transparencia:** Eliminar `opacity` de la animación de entrada de las patillas; solo movimiento vertical con stagger
- **Stagger:** Mantener el efecto escalonado entre tags, pero sin fade

### Punto 6 — Patillas colapsan arriba + texto sube al continuar scroll
- **Qué cambiar:** Al continuar el scroll (pasada la fase de entrada), las patillas deben moverse hacia arriba (colapsar/salir por arriba) y el texto principal también debe subir para dar paso a la siguiente sección
- **Implementación:** Fase 2 del scroll del sticky: animar `translateY` negativo en tags y título, sincronizado con el scroll

---

## Bloque B — Sección Testimonios: Aparición más rápida + zoom
**Rama:** `feat/testimonios-velocidad-zoom`

### Punto 7 — Elementos aparecen más rápido
- **Qué cambiar:** El trigger de aparición de los ítems del collage de testimonios debe activarse cuando el scroll calcula 1 barra de margen superior (aprox. `nav height` ≈ 60-80px desde el top del viewport)
- **Efecto:** Ver los elementos revelándose/apareciendo desde el momento en que la sección entra al viewport, no al llegar al final

### Punto 8 — Efecto zoom cuando todos los elementos están fijos
- **Qué cambiar:** Una vez que todos los 10 ítems del collage están en su posición (phase 1 completa), al continuar el scroll se debe aplicar un efecto de **zoom progresivo** (`scale` creciente) al contenedor o a los ítems focalizados
- **Resultado visual:** El usuario "se acerca" al collage y puede leer claramente 2–3 comentarios/tweets
- **Implementación:** Agregar fase 2 al sticky de testimonios: `scale(1) → scale(1.5~2)` interpolado con el scroll

---

## Bloque C — Footer: Logo grande + textos desde abajo
**Rama:** `feat/footer-logo-textos`

### Punto 9 — Logo más grande en el footer
- **Qué cambiar:** Aumentar el tamaño del logo BSM en el footer, tomando como referencia proporcional la barra de navegación superior
- **Tamaño objetivo:** El logo debe ocupar casi todo el ancho del footer (similar a la referencia auge-design.com)
- **Trigger de animación:** La animación del logo debe comenzar casi en el momento en que el usuario ve el footer (viewport entry), no al terminar de hacer scroll

### Punto 9b — Textos del footer aparecen desde abajo
- **Qué cambiar:** Los textos del footer (LIMA, PERÚ / Síguenos / Instagram / LinkedIn / ©BSM 2025) deben aparecer con `translateY` desde abajo, sin `opacity`, similar al efecto de auge-design.com
- **Stagger:** Entrada escalonada por grupo de texto
- **Referencia visual:** https://auge-design.com/

---

## Orden de ejecución

```
main
  └── feat/experiencia-texto-patillas   (Bloque A)
        └── feat/testimonios-velocidad-zoom  (Bloque B)
              └── feat/footer-logo-textos    (Bloque C)
```

Cada bloque se mergea a `main` antes de abrir la siguiente rama.

---

## Archivos clave a modificar

| Archivo | Bloques |
|---------|---------|
| `wp-content/themes/bsm-child/assets/js/custom.js` | A, B, C |
| `wp-content/themes/bsm-child/style.css` | A, B, C |
| `wp-content/themes/bsm-child/front-page.php` | C (markup si hace falta) |
