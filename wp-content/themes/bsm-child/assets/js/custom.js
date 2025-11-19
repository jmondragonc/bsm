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

    // Configurar contenedor
    framesContainer.style.position = "relative";

    // Obtener contenedores individuales de cada letra
    const bContainer = document.querySelector(".b");
    const sContainer = document.querySelector(".s");
    const mContainer = document.querySelector(".m");

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
    const bInterval = setInterval(animateB, 250);
    const mInterval = setInterval(animateM, 250);

    // Esperar a que anime.js esté disponible
    function startAnimations() {
      if (typeof anime === "undefined") {
        setTimeout(startAnimations, 50);
        return;
      }

      // Al segundo 1: reducir a 75% con anime.js
      anime({
        targets: framesContainer,
        scale: 0.75,
        duration: 250,
        easing: "easeInOutQuad",
        delay: 1000,
      });

      // A los 1.25s: mover cada letra POR SEPARADO
      // Calculamos el ancho total del frames container
      const framesWidth = framesContainer.offsetWidth;
      const gap = 24; // gap del grid

      // Proporciones del grid: 33.2fr 28.5fr 38.3fr = 100fr total
      const totalFr = 33.2 + 28.5 + 38.3;
      const bWidth = (framesWidth - gap * 2) * (33.2 / totalFr);
      const sWidth = (framesWidth - gap * 2) * (28.5 / totalFr);

      // Calcular desplazamiento para centrar todo hacia la izquierda
      const targetOffset = framesWidth * 0.25; // Mover todo 25% a la izquierda

      const moveTimeline = anime.timeline({
        easing: "easeOutQuad",
        delay: 1250,
      });

      // Cada letra se mueve su cantidad específica
      moveTimeline.add(
        {
          targets: bContainer,
          translateX: -targetOffset,
          duration: 500,
          easing: "easeOutQuad",
        },
        0
      );

      moveTimeline.add(
        {
          targets: sContainer,
          translateX: -targetOffset,
          duration: 1000,
          easing: "easeOutQuad",
        },
        100
      );

      moveTimeline.add(
        {
          targets: mContainer,
          translateX: -targetOffset,
          duration: 1000,
          easing: "easeOutQuad",
        },
        200
      );

      // Detener intervalos cuando termine el desplazamiento
      // La M es la última en llegar (delay 200ms + duration 1000ms = 1200ms)
      moveTimeline.finished.then(function () {
        clearInterval(bInterval);
        clearInterval(mInterval);

        // Animar las 3 líneas hacia la derecha
        const line1 = document.querySelector(".line-1");
        const line2 = document.querySelector(".line-2");
        const line3 = document.querySelector(".line-3");

        // Timeline para las líneas
        const linesTimeline = anime.timeline({
          easing: "easeOutQuad",
        });

        // Animar cada línea hacia la derecha para alinearse con line-1
        // line-1: 110.667% → 100%
        // line-2: 70.667% → 100% + (110.667% - 70.667%) = 140%
        // line-3: 53.87% → 100% + (110.667% - 53.87%) = 156.797%
        linesTimeline
          .add(
            {
              targets: line1,
              translateX: "100%",
              duration: 600,
              easing: "easeOutQuad",
            },
            0
          )
          .add(
            {
              targets: line2,
              translateX: "155%",
              duration: 600,
              easing: "easeOutQuad",
            },
            100
          )
          .add(
            {
              targets: line3,
              translateX: "205%",
              duration: 600,
              easing: "easeOutQuad",
            },
            200
          );
      });
    }

    startAnimations();
  }

  // Iniciar cuando el DOM esté listo
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBSMAnimation);
  } else {
    initBSMAnimation();
  }
})();
