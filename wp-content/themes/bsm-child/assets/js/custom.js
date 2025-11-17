/**
 * BSM Custom JavaScript
 * Detectar fondo morado para aplicar estilo específico
 */

(function() {
    'use strict';

    const nav = document.querySelector('.bsm-nav');
    if (!nav) return;

    function checkBackground() {
        // Detectar todas las secciones con fondo morado
        const purpleSections = document.querySelectorAll('[data-bg="purple"], .bsm-hero, .bsm-footer');
        let isOnPurple = false;

        // Obtener la posición del nav
        const navRect = nav.getBoundingClientRect();
        const navCenter = navRect.top + (navRect.height / 2);

        // Verificar si el nav está sobre alguna sección morada
        purpleSections.forEach(function(section) {
            const rect = section.getBoundingClientRect();

            // Si el centro del nav está dentro de una sección morada
            if (navCenter >= rect.top && navCenter <= rect.bottom) {
                isOnPurple = true;
            }
        });

        // Aplicar o remover la clase según corresponda
        if (isOnPurple) {
            nav.classList.add('on-purple');
        } else {
            nav.classList.remove('on-purple');
        }
    }

    // Ejecutar al cargar
    window.addEventListener('load', checkBackground);

    // Ejecutar inmediatamente
    checkBackground();

    // Ejecutar al hacer scroll
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

    // Ejecutar al cambiar el tamaño de la ventana
    window.addEventListener('resize', function() {
        checkBackground();
    });
})();
