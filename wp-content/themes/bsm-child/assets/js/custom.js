/**
 * BSM Custom JavaScript
 * Detectar fondo morado para aplicar estilo específico
 */

(function () {
  "use strict";

  const nav = document.querySelector(".bsm-nav");
  const heroTitle = document.querySelector(".hero-title");
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

  function showNavAndTitle() {
    // Mostrar nav y hero-title cuando se hace scroll
    if (window.scrollY > 0) {
      if (nav) {
        nav.classList.add("show");
      }
      if (heroTitle) {
        heroTitle.classList.add("show");
      }
    }
  }

  // Parallax del hero cuando se hace scroll
  function handleHeroParallax() {
    const heroSection = document.querySelector("#primary .bsm-hero");
    if (!heroSection) return;

    const heroImage = heroSection.querySelector(".hero-image");
    const heroTitle = heroSection.querySelector(".hero-title");
    const heroBackground = heroSection.querySelector(".hero-background");

    if (!heroImage) return;

    // Obtener la posición del scroll y la altura de la sección
    const scrollY = window.scrollY;
    const heroHeight = heroSection.offsetHeight;
    const scrollProgress = Math.min(scrollY / heroHeight, 1);

    // Solo aplicar parallax cuando estamos saliendo del viewport
    if (scrollProgress > 0) {
      // Cada elemento se mueve a diferente velocidad para crear profundidad
      const imageOffset = scrollProgress * 200; // Más rápido
      const titleOffset = scrollProgress * 120; // Velocidad media
      const backgroundOffset = scrollProgress * 40; // Más lento

      const imageOpacity = Math.max(1 - scrollProgress * 1.8, 0);
      const titleOpacity = Math.max(1 - scrollProgress * 1.5, 0);

      if (heroImage) {
        heroImage.style.transform = `translateY(-${imageOffset}px)`;
        heroImage.style.opacity = imageOpacity;
      }

      if (heroTitle) {
        heroTitle.style.transform = `translateY(-${titleOffset}px)`;
        heroTitle.style.opacity = titleOpacity;
      }

      if (heroBackground) {
        heroBackground.style.transform = `translateY(-${backgroundOffset}px)`;
      }
    } else {
      // Reset cuando estamos en la parte superior
      if (heroImage) {
        heroImage.style.transform = "translateY(0)";
        heroImage.style.opacity = "1";
      }
      if (heroTitle) {
        heroTitle.style.transform = "translateY(0)";
        heroTitle.style.opacity = "1";
      }
      if (heroBackground) {
        heroBackground.style.transform = "translateY(0)";
      }
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
          showNavAndTitle();
          handleHeroParallax();
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
        const r = document.querySelector(".registered");

        // Timeline para las líneas
        const linesTimeline = anime.timeline({
          easing: "easeOutQuad",
        });

        // Animar cada línea hacia la derecha para alinearse con line-1
        linesTimeline
          .add(
            {
              targets: line1,
              translateX: "calc(100% + 24px)",
              duration: 600,
              easing: "easeOutQuad",
            },
            0
          )
          .add(
            {
              targets: line2,
              translateX: "calc(100% + 24px)",
              duration: 600,
              easing: "easeOutQuad",
            },
            100
          )
          .add(
            {
              targets: line3,
              translateX: "calc(100% + 24px)",
              duration: 600,
              easing: "easeOutQuad",
            },
            200
          )
          .add(
            {
              targets: r,
              translateX: "calc(100% + 24px)",
              duration: 600,
              easing: "easeOutQuad",
            },
            200
          );

        // No mostrar hero-title automáticamente
        // Se mostrará solo cuando el usuario haga scroll
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

/**
 * Acordeón de servicios
 */
(function () {
  "use strict";

  function initAccordion() {
    const serviceItems = document.querySelectorAll(".service-item");

    serviceItems.forEach(function (item) {
      const header = item.querySelector(".service-header");
      const btn = item.querySelector(".expand-btn");

      header.addEventListener("click", function () {
        // Si el item ya está activo, lo cerramos
        if (item.classList.contains("active")) {
          item.classList.remove("active");
          btn.textContent = "+";
        } else {
          // Cerrar todos los demás items
          serviceItems.forEach(function (otherItem) {
            otherItem.classList.remove("active");
            otherItem.querySelector(".expand-btn").textContent = "+";
          });

          // Abrir el item actual
          item.classList.add("active");
          btn.textContent = "-";
        }
      });
    });
  }

  // Iniciar cuando el DOM esté listo
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAccordion);
  } else {
    initAccordion();
  }
})();

/**
 * Scroll Animations (Scroll-Linked)
 * Animates elements based on their position in the viewport
 */
(function () {
  "use strict";

  const animatedElements = document.querySelectorAll(
    ".animate-fade-up, .animate-slide-left"
  );

  if (animatedElements.length === 0) return;

  function handleScrollAnimations() {
    const viewportHeight = window.innerHeight;

    animatedElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const elementHeight = rect.height;

      // Calcular cuánto ha entrado el elemento en el viewport
      // Inicio (0): cuando el borde superior del elemento toca el borde inferior del viewport
      // Fin (1): cuando el elemento ha entrado una cantidad significativa (e.g., 200px o 30% del viewport)

      const entryPoint = viewportHeight; // El punto donde empieza a ser visible (bottom of viewport)
      const visibleThreshold = 150; // Píxeles que debe entrar para completar la animación

      // Distancia desde el top del elemento hasta el bottom del viewport
      const distanceFromBottom = viewportHeight - rect.top;

      let progress = 0;

      if (distanceFromBottom > 0) {
        progress = Math.min(distanceFromBottom / visibleThreshold, 1);
      }

      // Aplicar estilos basados en el progreso
      // Opacidad: 0 a 1
      el.style.opacity = progress;

      // Transform:
      // fade-up: translateY(30px) -> 0
      // slide-left: translateX(50px) -> 0

      if (el.classList.contains("animate-fade-up")) {
        const translateY = 30 * (1 - progress);
        el.style.transform = `translateY(${translateY}px)`;
      } else if (el.classList.contains("animate-slide-left")) {
        const translateX = 50 * (1 - progress);
        el.style.transform = `translateX(${translateX}px)`;
      }
    });
  }

  let ticking = false;
  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          handleScrollAnimations();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  // Ejecutar inicial
  handleScrollAnimations();

  // Ejecutar inicial
  handleScrollAnimations();

  // Actualizar en resize
  window.addEventListener("resize", handleScrollAnimations);
})();

/**
 * Full Experience Tags - VERSIÓN ULTRA SIMPLE QUE SÍ FUNCIONA
 */
(function () {
  "use strict";

  function initTagsScrollAnimation() {
    const wrapper = document.querySelector(".bsm-experience-wrapper");
    const section = document.querySelector(".bsm-full-experience");
    // Ensure we select all tags properly
    const tags = Array.from(document.querySelectorAll(".services-tags .tag"));

    if (!wrapper || !section || tags.length === 0) {
      return;
    }

    // Map of final rotations matching CSS requirements
    const rotations = [15, -15, 8, -4, -28, 15, 18, -25];

    // Stagger delays to create wave effect
    const staggerOffsets = [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35];

    // Spread vectors for Phase 2 (Growth)
    // As they grow, move them outwards to avoid overlapping
    // {x, y, r} (r = additional rotation)
    const spreadOffsets = [
      { x: -100, y: -50, r: -5 }, // Tag 1 Branding
      { x: 100, y: -50, r: 5 }, // Tag 2 Naming
      { x: -80, y: -20, r: -3 }, // Tag 3 Packaging
      { x: 150, y: 20, r: 8 }, // Tag 4 Social
      { x: -150, y: 80, r: -10 }, // Tag 5 Campañas
      { x: 120, y: 120, r: 5 }, // Tag 6 Posicionamiento
      { x: -60, y: 150, r: 4 }, // Tag 7 Manual
      { x: 60, y: 150, r: -4 }, // Tag 8 Y Mas
    ];

    function render() {
      if (!isSectionVisible) {
        requestAnimationFrame(render);
        return;
      }

      const rect = wrapper.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const entryStart = windowHeight;
      const entryEnd = 0;

      // Calculate Entry Progress (0 to 1)
      let entryProgress = (entryStart - rect.top) / (entryStart - entryEnd);

      const pinnedDist = -rect.top;
      const growthDist = windowHeight;
      let growthProgress = pinnedDist / growthDist;

      entryProgress = Math.max(0, Math.min(1, entryProgress));

      const isShakePhase = growthProgress > 1;

      // Time for shake (constant)
      const time = Date.now() * 0.002; // Slower speed factor

      tags.forEach((tag, index) => {
        const rotation = rotations[index] !== undefined ? rotations[index] : 0;
        const stagger =
          staggerOffsets[index] !== undefined ? staggerOffsets[index] : 0;
        const spread = spreadOffsets[index] || { x: 0, y: 0, r: 0 };

        let scale = 0.5;
        let transX = 0;
        let transY = 150;
        let opacity = 0;
        let currentRot = rotation;

        if (entryProgress > 0) {
          // PHASE 1: Entry
          let p1 = (entryProgress - stagger) / 0.5;
          p1 = Math.max(0, Math.min(1, p1));
          const ease1 = p1 * (2 - p1);

          scale = 0.5 + 0.5 * ease1;
          transY = 150 * (1 - ease1);
          opacity = ease1;
        }

        if (growthProgress > 0) {
          // PHASE 2
          scale = 1.0;
          transX = 0;
          transY = 0;
          opacity = 1;

          let p2 = Math.min(1, growthProgress);
          const ease2 = p2;
          const growthFactor = 0.5 * ease2;

          scale = 1.0 + growthFactor;
          transX = spread.x * ease2;
          transY = spread.y * ease2;

          // Add extra rotation during growth
          currentRot += (spread.r || 0) * ease2;
        }

        if (isShakePhase) {
          // PHASE 3: CONSTANT SHAKE
          const i = index + 1;

          // Use TIME instead of scroll
          const shakeX = Math.sin(time * 2.5 + i) * 6;
          const shakeY = Math.cos(time * 3.1 + i) * 6;
          const shakeR = Math.sin(time * 4.2 + i) * 3;

          transX += shakeX;
          transY += shakeY;
          currentRot += shakeR;
        }

        tag.style.opacity = opacity;
        tag.style.transform = `translate(${transX}px, ${transY}px) rotate(${currentRot}deg) scale(${scale})`;
      });

      requestAnimationFrame(render);
    }

    // Visibility Check Optimization
    // To save resources, only render when near viewport
    let isSectionVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isSectionVisible = entry.isIntersecting;
        });
      },
      { rootMargin: "200px 0px 200px 0px" }
    );

    observer.observe(wrapper);

    // Start Loop
    render();
  }

  function initWorkStickyScroll() {
    const wrapper = document.querySelector(".bsm-work-sticky-wrapper");
    const container = document.querySelector(".bsm-work-container");
    const track = document.querySelector(".bsm-work-track");

    if (!wrapper || !container || !track) return;

    function updateDimensions() {
      const trackWidth = track.scrollWidth;
      const viewportWidth = window.innerWidth;

      // Calculate how much we need to scroll horizontally
      const scrollDist = trackWidth - viewportWidth;

      // If content fits in viewport, no need for sticky scroll
      if (scrollDist <= 0) {
        wrapper.style.height = "auto";
        track.style.transform = "translateX(0)";
        return;
      }

      // Set the height of the wrapper to accommodate the horizontal scroll duration
      // Added vertical scroll buffer (e.g. 100vh) to make it feel natural
      // 300vh creates a moderate speed scroll
      wrapper.style.height = `${scrollDist + window.innerHeight}px`;
    }

    function onScroll() {
      const rect = wrapper.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Distance from top of viewport to top of wrapper
      // When rect.top is 0, we are at the start of pinning
      // When rect.top is -(wrapperHeight - viewportHeight), we are at the end

      const start = 0; // Stick immediately when hitting top
      const end = -(wrapper.offsetHeight - viewportHeight);

      // Calculate progress
      let progress = 0;

      if (rect.top <= start && rect.top >= end) {
        // We are in the sticky zone
        progress = -rect.top / (wrapper.offsetHeight - viewportHeight);
      } else if (rect.top < end) {
        // We passed the section
        progress = 1;
      } else {
        // We haven't reached it yet
        progress = 0;
      }

      // Clamp progress
      progress = Math.max(0, Math.min(1, progress));

      // Calculate horizontal move
      const trackWidth = track.scrollWidth;
      const viewportWidth = window.innerWidth;
      const maxTranslate = trackWidth - viewportWidth;

      if (maxTranslate > 0) {
        const translateX = -progress * maxTranslate;
        track.style.transform = `translateX(${translateX}px)`;
      }
    }

    // Initialize
    updateDimensions();
    onScroll();

    // Event Listeners
    window.addEventListener("resize", updateDimensions);

    // Add scroll listener (using requestAnimationFrame for performance)
    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            onScroll();
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  // Ensure DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initTagsScrollAnimation();
      initWorkStickyScroll();
    });
  } else {
    initTagsScrollAnimation();
    initWorkStickyScroll();
  }
})();
