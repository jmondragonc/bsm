/**
 * BSM Custom JavaScript
 * Detectar fondo morado para aplicar estilo específico
 */

(function () {
  "use strict";

  const nav = document.querySelector(".bsm-nav");
  if (!nav) return;

  function checkBackground() {
    // Detectar solo las secciones con fondo morado
    const purpleSections = document.querySelectorAll(
      '[data-bg="purple"], .bsm-hero, .bsm-footer'
    );
    let isOnPurple = false;

    // Obtener la posición del nav
    const navRect = nav.getBoundingClientRect();
    const navCenter = navRect.top + navRect.height / 2;

    // Verificar si el nav está sobre alguna sección morada
    purpleSections.forEach(function (section) {
      const rect = section.getBoundingClientRect();
      if (navCenter >= rect.top && navCenter <= rect.bottom) {
        isOnPurple = true;
      }
    });

    // Aplicar o remover la clase on-purple
    if (isOnPurple) {
      nav.classList.add("on-purple");
    } else {
      nav.classList.remove("on-purple");
    }
  }

  // Ejecutar al cargar
  window.addEventListener("load", checkBackground);

  // Ejecutar inmediatamente
  checkBackground();

  // Ejecutar al hacer scroll
  let ticking = false;
  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          checkBackground();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  // Ejecutar al cambiar el tamaño de la ventana
  window.addEventListener("resize", function () {
    checkBackground();
  });
})();

/**
 * Animación de las letras BSM
 * Anima las letras B y M alternando entre 3 variantes cada 250ms (cambio instantáneo)
 */
(function () {
  "use strict";

  function initBSMAnimation() {
    const bFrames = [".b1_1", ".b1_2", ".b1_3"];
    const mFrames = [".m1_1", ".m1_2", ".m1_3"];
    const framesContainer = document.querySelector(".frames");

    if (!framesContainer) return;

    // Configurar estado inicial
    bFrames.forEach(function (selector, index) {
      const el = document.querySelector(selector);
      if (el) {
        if (index === 0) {
          el.style.display = "block";
          el.style.position = "relative";
        } else {
          el.style.display = "none";
          el.style.position = "absolute";
        }
      }
    });

    mFrames.forEach(function (selector, index) {
      const el = document.querySelector(selector);
      if (el) {
        if (index === 0) {
          el.style.display = "block";
          el.style.position = "relative";
        } else {
          el.style.display = "none";
          el.style.position = "absolute";
        }
      }
    });

    // Agregar transición al contenedor
    framesContainer.style.transition = "transform 0.25s ease";
    framesContainer.style.position = "relative";

    // Obtener contenedores individuales de cada letra
    const bContainer = document.querySelector(".b");
    const sContainer = document.querySelector(".s");
    const mContainer = document.querySelector(".m");

    // Agregar transiciones individuales a cada letra
    if (bContainer) bContainer.style.transition = "transform 0.5s ease-out";
    if (sContainer) sContainer.style.transition = "transform 0.5s ease-out";
    if (mContainer) mContainer.style.transition = "transform 0.5s ease-out";

    let bIndex = 0;
    let mIndex = 0;

    // Función para cambiar frame de B
    function animateB() {
      // Ocultar frame actual y cambiar a absolute
      const currentB = document.querySelector(bFrames[bIndex]);
      if (currentB) {
        currentB.style.display = "none";
        currentB.style.position = "absolute";
      }

      // Siguiente frame
      bIndex = (bIndex + 1) % 3;

      // Mostrar nuevo frame y cambiar a relative
      const nextB = document.querySelector(bFrames[bIndex]);
      if (nextB) {
        nextB.style.position = "relative";
        nextB.style.display = "block";
      }
    }

    // Función para cambiar frame de M
    function animateM() {
      // Ocultar frame actual y cambiar a absolute
      const currentM = document.querySelector(mFrames[mIndex]);
      if (currentM) {
        currentM.style.display = "none";
        currentM.style.position = "absolute";
      }

      // Siguiente frame
      mIndex = (mIndex + 1) % 3;

      // Mostrar nuevo frame y cambiar a relative
      const nextM = document.querySelector(mFrames[mIndex]);
      if (nextM) {
        nextM.style.position = "relative";
        nextM.style.display = "block";
      }
    }

    // Iniciar animación de frames inmediatamente cada 250ms
    setInterval(animateB, 250);
    setInterval(animateM, 250);

    // Al segundo 1: reducir a 75% (mientras las letras se siguen cambiando)
    setTimeout(function () {
      framesContainer.style.transform = "scale(0.75)";
    }, 1000);

    // A los 1.25s: desplazar cada letra de forma escalonada
    setTimeout(function () {
      // La B llega primero
      if (bContainer) {
        bContainer.style.transform = "translateX(-25%)";
      }

      // La S llega 100ms después
      setTimeout(function () {
        if (sContainer) {
          sContainer.style.transform = "translateX(-25%)";
        }
      }, 100);

      // La M llega 100ms después de la S
      setTimeout(function () {
        if (mContainer) {
          mContainer.style.transform = "translateX(-25%)";
        }
      }, 200);
    }, 1250);
  }

  // Iniciar cuando el DOM esté listo
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBSMAnimation);
  } else {
    initBSMAnimation();
  }
})();
