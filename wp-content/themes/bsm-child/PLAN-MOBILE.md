# Plan de Implementación Mobile - BSM

## Análisis del Diseño Mobile

### 1. Header/Navegación
**Diseño actual**: Nav horizontal con links visibles
**Diseño mobile**:
- Logo BSM pequeño (esquina izquierda)
- Menú hamburguesa (≡) en esquina derecha
- Menú desplegable/overlay al hacer click

### 2. Hero Section
**Cambios necesarios**:
- Logo "BSM" centrado y más pequeño (adaptado al ancho mobile)
- Las letras B, S, M mantienen las imágenes dentro
- Texto "SOMOS LA AGENCIA PARA CUANDO NECESITAS UN CAMBIO" debajo, centrado
- Fondo morado se mantiene
- Reducir tamaño de las letras proporcionalmente

### 3. What We Do (¿QUÉ HACEMOS?)
**Cambios necesarios**:
- Layout de una columna (en vez de grid de 2 columnas)
- Título y subtítulo arriba, centrados o alineados a la izquierda
- Acordeón de servicios debajo, full width
- Botones (+) más pequeños
- Tipografía reducida proporcionalmente

### 4. Full Experience Section
**Cambios necesarios**:
- Texto "CREAMOS UNA EXPERIENCIA DE MARCA COMPLETA" en múltiples líneas
- Tipografía mucho más pequeña (adaptada al ancho)
- Tags reposicionados para mobile (más pequeños, distribución diferente)
- Mantener animación de scroll pero simplificada

### 5. Work Section (Proyectos)
**Cambios necesarios**:
- Título "TRABAJAMOS CON CLIENTES CON VISIÓN"
- Cards de proyectos en stack vertical (una columna)
- Scroll horizontal eliminado, scroll vertical normal
- Cards más anchas (casi full width)
- Imágenes cuadradas se mantienen

### 6. Testimonials Section
**Cambios necesarios**:
- Reducir número de elementos visibles
- Elementos más pequeños y reposicionados
- Simplificar la animación de collage
- Posiblemente mostrar elementos en secuencia vertical
- El elemento grande verde de Organa al final

### 7. Footer
**Cambios necesarios**:
- Logo BSM grande centrado
- Información de contacto en stack vertical
- Links sociales en fila

---

## Breakpoint Principal
- **Mobile**: max-width: 768px
- **Tablet** (opcional): max-width: 1024px

---

## Orden de Implementación

### Fase 1: Navegación Mobile
1. Crear botón hamburguesa
2. Crear menú overlay/desplegable
3. Ocultar nav horizontal en mobile
4. Implementar toggle del menú

### Fase 2: Hero Section
1. Ajustar tamaño del logo BSM
2. Ajustar grid de letras B, S, M
3. Mostrar texto "SOMOS LA AGENCIA..." visible en mobile
4. Ajustar padding y márgenes

### Fase 3: What We Do
1. Cambiar grid a una columna
2. Ajustar tamaños de tipografía
3. Ajustar acordeón para mobile

### Fase 4: Full Experience
1. Reducir tamaño de tipografía
2. Reposicionar tags para mobile
3. Ajustar animación de scroll

### Fase 5: Work Section
1. Cambiar de scroll horizontal a vertical
2. Cards en una columna
3. Ajustar tamaños

### Fase 6: Testimonials
1. Simplificar collage para mobile
2. Reducir elementos y tamaños
3. Ajustar animaciones

### Fase 7: Footer
1. Stack vertical para información
2. Logo centrado
3. Ajustar espaciado

---

## Archivos a Modificar
- `style.scss` - Media queries para mobile
- `front-page.php` - Posiblemente agregar botón hamburguesa
- `custom.js` - Ajustar animaciones para mobile
