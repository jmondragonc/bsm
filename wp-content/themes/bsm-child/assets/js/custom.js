/**
 * BSM Custom JavaScript
 * Detectar fondo morado para aplicar estilo específico
 */

(function() {
    'use strict';

    const nav = document.querySelector('.bsm-nav');
    if (!nav) return;

    function checkBackground() {
        // Detectar color de fondo en la parte superior
        const element = document.elementFromPoint(window.innerWidth / 2, 50);
        if (!element) return;

        let bgColor = null;
        let currentElement = element;

        // Buscar el color de fondo
        while (currentElement && currentElement !== document.body) {
            const computedStyle = window.getComputedStyle(currentElement);
            const bg = computedStyle.backgroundColor;

            if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
                bgColor = bg;
                break;
            }
            currentElement = currentElement.parentElement;
        }

        // Verificar si es morado (#6A23CD = rgb(106, 35, 205))
        if (bgColor) {
            const rgb = bgColor.match(/\d+/g);
            if (rgb && rgb.length >= 3) {
                const r = parseInt(rgb[0]);
                const g = parseInt(rgb[1]);
                const b = parseInt(rgb[2]);

                // Si es morado
                if (r > 90 && r < 120 && g > 25 && g < 45 && b > 195 && b < 215) {
                    nav.classList.add('on-purple');
                } else {
                    nav.classList.remove('on-purple');
                }
            }
        }
    }

    // Ejecutar al cargar y al hacer scroll
    checkBackground();

    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                checkBackground();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
})();
