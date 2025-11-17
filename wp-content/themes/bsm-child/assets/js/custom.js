/**
 * BSM Custom JavaScript
 * Detectar fondo morado para aplicar estilo específico
 */

(function() {
    'use strict';

    const nav = document.querySelector('.bsm-nav');
    if (!nav) return;

    function checkBackground() {
        // Detectar todas las secciones
        const purpleSections = document.querySelectorAll('[data-bg="purple"], .bsm-hero, .bsm-footer');
        const darkSections = document.querySelectorAll('[data-bg="dark"], .bsm-full-experience, .bsm-testimonials');
        const lightSections = document.querySelectorAll('[data-bg="light"], .bsm-what-we-do, .bsm-work');

        let isOnPurple = false;
        let isOnDark = false;

        // Obtener la posición del nav
        const navRect = nav.getBoundingClientRect();
        const navCenter = navRect.top + (navRect.height / 2);

        // Verificar si el nav está sobre alguna sección morada
        purpleSections.forEach(function(section) {
            const rect = section.getBoundingClientRect();
            if (navCenter >= rect.top && navCenter <= rect.bottom) {
                isOnPurple = true;
            }
        });

        // Verificar si está sobre fondo oscuro
        if (!isOnPurple) {
            darkSections.forEach(function(section) {
                const rect = section.getBoundingClientRect();
                if (navCenter >= rect.top && navCenter <= rect.bottom) {
                    isOnDark = true;
                }
            });
        }

        // Aplicar clases según corresponda
        if (isOnPurple) {
            nav.classList.add('on-purple');
            nav.classList.remove('on-dark');
            nav.classList.remove('on-light');
        } else if (isOnDark) {
            nav.classList.remove('on-purple');
            nav.classList.add('on-dark');
            nav.classList.remove('on-light');
        } else {
            nav.classList.remove('on-purple');
            nav.classList.remove('on-dark');
            nav.classList.add('on-light');
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
