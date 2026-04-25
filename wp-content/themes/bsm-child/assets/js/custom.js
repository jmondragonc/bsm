/**
 * BSM Custom JavaScript
 * Detectar fondo morado para aplicar estilo específico
 */

// Mobile detection helper
const isMobileDevice = () => window.innerWidth <= 768;

/**
 * Smooth scroll para links de ancla (#work, #about, etc.)
 */
(function () {
  "use strict";

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;

      link.addEventListener("click", function (e) {
        const target = document.querySelector(hash);
        if (!target) return;

        e.preventDefault();

        // Cerrar menú mobile si está abierto
        const mobileOverlay = document.querySelector(".mobile-menu-overlay");
        const mobileBtn = document.querySelector(".mobile-menu-btn");
        if (mobileOverlay && mobileOverlay.classList.contains("is-active")) {
          mobileOverlay.classList.remove("is-active");
          if (mobileBtn) mobileBtn.classList.remove("is-active");
          document.body.style.overflow = "";
        }

        const targetY = target.getBoundingClientRect().top + window.scrollY;

        window.scrollTo({
          top: targetY,
          behavior: "smooth",
        });
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSmoothScroll);
  } else {
    initSmoothScroll();
  }
})();

/**
 * Mobile Menu Toggle
 */
(function () {
  "use strict";

  function initMobileMenu() {
    const menuBtn = document.querySelector(".mobile-menu-btn");
    const menuOverlay = document.querySelector(".mobile-menu-overlay");
    const closeBtn = document.querySelector(".mobile-menu-close");
    const menuLinks = document.querySelectorAll(".mobile-menu-list a");

    if (!menuBtn || !menuOverlay) return;

    function closeMenu() {
      menuBtn.classList.remove("is-active");
      menuOverlay.classList.remove("is-active");
      document.body.style.overflow = "";
    }

    menuBtn.addEventListener("click", function () {
      menuBtn.classList.toggle("is-active");
      menuOverlay.classList.toggle("is-active");
      document.body.style.overflow = menuOverlay.classList.contains("is-active") ? "hidden" : "";
    });

    if (closeBtn) closeBtn.addEventListener("click", closeMenu);

    menuLinks.forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menuOverlay.classList.contains("is-active")) closeMenu();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMobileMenu);
  } else {
    initMobileMenu();
  }
})();

/**
 * Nav and Background Detection
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

  function showNavOnScroll() {
    if (window.scrollY > 50) {
      if (nav) nav.classList.add("show");
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

    const scrollY = window.scrollY;
    const heroHeight = heroSection.offsetHeight;
    const isMobileHero = window.innerWidth <= 768;

    if (isMobileHero) {
      // MOBILE: 4 fases
      // Fase 0 (0%→25%): logo sube desde el centro a su posición final
      // Fase 1 (25%→55%): texto sube desde abajo (logo ya anclado)
      // Fase 2 (55%→80%): ambos anclados
      // Fase 3 (80%→100%): ambos salen hacia arriba
      const phase0End = heroHeight * 0.25;
      const phase1End = heroHeight * 0.55;
      const phase2End = heroHeight * 0.80;

      if (scrollY <= phase0End) {
        // Logo sube desde el centro hacia su posición final (arriba)
        const p = scrollY / phase0End;
        const ease = p * (2 - p);
        heroImage.style.transform = `translateY(-${mobileLiftAmount * ease}px)`;
        if (heroTitle) {
          heroTitle.style.transform = `translateY(${window.innerHeight}px)`;
          heroTitle.style.opacity = "1";
        }
      } else if (scrollY <= phase1End) {
        // Logo anclado arriba, texto sube desde abajo
        heroImage.style.transform = `translateY(-${mobileLiftAmount}px)`;
        if (heroTitle) {
          const p = (scrollY - phase0End) / (phase1End - phase0End);
          const ease = p * (2 - p);
          heroTitle.style.transform = `translateY(${window.innerHeight * (1 - ease)}px)`;
          heroTitle.style.opacity = "1";
        }
      } else if (scrollY <= phase2End) {
        // Ambos anclados
        heroImage.style.transform = `translateY(-${mobileLiftAmount}px)`;
        if (heroTitle) {
          heroTitle.style.transform = "translateY(0px)";
          heroTitle.style.opacity = "1";
        }
      } else {
        // Ambos salen hacia arriba
        const p = (scrollY - phase2End) / (heroHeight - phase2End);
        const clamped = Math.min(p, 1);
        heroImage.style.transform = `translateY(-${mobileLiftAmount + clamped * 150}px)`;
        if (heroTitle) {
          heroTitle.style.transform = `translateY(-${clamped * 300}px)`;
          heroTitle.style.opacity = "1";
        }
      }
      heroImage.style.opacity = "1";

      if (heroBackground) {
        const bgP = Math.min(scrollY / heroHeight, 1);
        heroBackground.style.transform = `translateY(-${bgP * 40}px)`;
      }
    } else {
      // DESKTOP: comportamiento original
      const titleThreshold = heroHeight * 0.35;
      if (heroTitle) {
        const titleProgress = Math.min(scrollY / titleThreshold, 1);
        const titleOffset = window.innerHeight * (1 - titleProgress);
        heroTitle.style.transform = `translateY(${titleOffset}px)`;
        heroTitle.style.opacity = "1";
      }

      const exitStart = titleThreshold;
      const exitRange = heroHeight - exitStart;
      const exitProgress = Math.max(scrollY - exitStart, 0) / exitRange;
      const exitClamped = Math.min(exitProgress, 1);

      if (exitClamped > 0) {
        const imageOffset = exitClamped * 200;
        const backgroundOffset = exitClamped * 40;
        if (heroImage) {
          heroImage.style.transform = `translateY(-${imageOffset}px)`;
          heroImage.style.opacity = "1";
        }
        if (heroTitle) {
          heroTitle.style.transform = `translateY(-${imageOffset}px)`;
        }
        if (heroBackground) {
          heroBackground.style.transform = `translateY(-${backgroundOffset}px)`;
        }
      } else {
        if (heroImage) {
          heroImage.style.transform = "translateY(0)";
          heroImage.style.opacity = "1";
        }
        if (heroBackground) {
          heroBackground.style.transform = "translateY(0)";
        }
      }
    }
  }

  // Estado inicial mobile: logo en su posición natural (centro), título fuera de pantalla
  // mobileLiftAmount = cuánto sube el logo desde el centro hasta su posición final (arriba)
  let mobileLiftAmount = 0;

  function initMobileHeroState() {
    if (window.innerWidth > 768) return;
    const heroSection = document.querySelector("#primary .bsm-hero");
    if (!heroSection) return;
    const heroImage = heroSection.querySelector(".hero-image");
    const heroTitle = heroSection.querySelector(".hero-title");
    if (!heroImage || !heroTitle) return;

    heroImage.style.transition = "none";
    heroImage.style.transform = "";
    const rect = heroImage.getBoundingClientRect();
    const targetTop = 185;
    mobileLiftAmount = Math.max(rect.top - targetTop, 0);

    heroTitle.style.transition = "none";
    heroTitle.style.transform = `translateY(${window.innerHeight}px)`;
    heroTitle.style.opacity = "1";

    // Nav visible inmediatamente en mobile sin slide-in animation
    const nav = document.querySelector(".bsm-nav");
    if (nav) {
      nav.style.transition = "none";
      nav.classList.add("show", "on-purple");
      requestAnimationFrame(function () {
        nav.style.transition = "";
      });
    }

    // Sincronizar posición del logo con el scroll actual
    handleHeroParallax();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMobileHeroState);
  } else {
    initMobileHeroState();
  }
  window.addEventListener("load", initMobileHeroState);
  window.addEventListener("resize", initMobileHeroState);

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
          showNavOnScroll();
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
 * Fases: rápida → media → lenta → pausa final
 * B y M animan de forma ligeramente desincronizada para efecto orgánico
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
      var el = document.querySelector(selector);
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
      var el = document.querySelector(selector);
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

    framesContainer.style.position = "relative";

    // Secuencia de frames: duración ~1500ms, 13 frames. B: termina en 0
    var bSequence = [
      // Fase 1: ráfaga rápida (50ms × 4 = 200ms)
      [1, 50], [2, 50], [0, 50], [1, 50],
      // Fase 2: velocidad media (100ms × 4 = 400ms)
      [2, 100], [0, 100], [1, 100], [2, 100],
      // Fase 3: desacelerando (150ms × 3 = 450ms)
      [0, 150], [1, 150], [2, 150],
      // Fase 4: pausa dramática (225ms × 2 = 450ms)
      [0, 225], [1, 225],
      // Frame final
      [0, 0]
    ];

    // M: arranca 120ms después, secuencia propia. Frame final: m3.svg (índice 2)
    var mSequence = [
      // Fase 1: ráfaga rápida (50ms × 4 = 200ms)
      [2, 50], [1, 50], [0, 50], [2, 50],
      // Fase 2: velocidad media (100ms × 4 = 400ms)
      [1, 100], [0, 100], [2, 100], [1, 100],
      // Fase 3: desacelerando (150ms × 3 = 450ms)
      [0, 150], [2, 150], [1, 150],
      // Fase 4: pausa dramática (225ms × 2 = 450ms)
      [0, 225], [2, 225],
      // Frame final: m3.svg (índice 2)
      [2, 0]
    ];

    function showFrame(frames, index) {
      frames.forEach(function (selector, i) {
        var el = document.querySelector(selector);
        if (!el) return;
        if (i === index) {
          el.style.position = "relative";
          el.style.display = "block";
        } else {
          el.style.display = "none";
          el.style.position = "absolute";
        }
      });
    }

    function playSequence(frames, sequence, step) {
      if (step >= sequence.length) return;
      var entry = sequence[step];
      var frameIndex = entry[0];
      var delay = entry[1];

      showFrame(frames, frameIndex);

      if (delay > 0) {
        setTimeout(function () {
          playSequence(frames, sequence, step + 1);
        }, delay);
      }
    }

    // 1) Logo grande: scale 1.2 → 1.0 en 0.2s
    // Scale 1 → 0.8 en paralelo con la animación de letras (solo desktop)
    if (window.innerWidth > 768) {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          framesContainer.style.transition = "transform 0.75s ease-out";
          framesContainer.style.transform = "scale(0.8)";
        });
      });
    }

    // Animación de letras arranca al mismo tiempo
    playSequence(bFrames, bSequence, 0);
    setTimeout(function () {
      playSequence(mFrames, mSequence, 0);
    }, 120);

    // 3) Header cae al terminar la animación: 200ms scale + 1500ms letras + 300ms buffer
    var BSM_ANIM_DURATION = 2000;
    setTimeout(function () {
      var nav = document.querySelector(".bsm-nav");
      if (!nav) return;
      if (window.scrollY < 50) {
        nav.classList.add("on-purple");
      }
      nav.classList.add("show");
    }, BSM_ANIM_DURATION);
  }

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
        if (item.classList.contains("active")) {
          item.classList.remove("active");
          btn.classList.remove("is-open");
        } else {
          serviceItems.forEach(function (otherItem) {
            otherItem.classList.remove("active");
            otherItem.querySelector(".expand-btn").classList.remove("is-open");
          });
          item.classList.add("active");
          btn.classList.add("is-open");
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
    // const section = document.querySelector(".bsm-full-experience"); // Not strictly needed if we target H2 directly
    const title = document.querySelector(".bsm-full-experience h2");

    // Ensure we select all tags properly
    const tags = Array.from(document.querySelectorAll(".services-tags .tag"));

    if (!wrapper || tags.length === 0) {
      return;
    }

    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth < 1200 && window.innerWidth > 768;
    const expEl = document.querySelector(".bsm-full-experience");
    const workEl = document.querySelector(".bsm-work");

    // Initial styles — título entra desde abajo con fadeIn
    if (title) {
      title.style.opacity = 0;
      title.style.transform = "translateY(100vh)";
      title.style.willChange = "transform";
    }

    // Patillas visibles desde el inicio (sin opacity), el overflow las oculta
    tags.forEach((tag) => {
      tag.style.opacity = 1;
    });

    // Map of final rotations — mobile uses Figma exact rotations
    const rotations = isMobile
      ? [13.45, -16.87, 29.94, -7.5, -25.37, 14, -6.18, 26.62]
      : [15, -15, 8, -4, -28, 15, 18, -25];

    // Stagger delays — cada tag entra en momento distinto
    const staggerOffsets = [0, 0.08, 0.14, 0.06, 0.18, 0.10, 0.22, 0.04];

    // Velocidad individual de entrada: parallax — cada tag sube a distinta velocidad
    const entrySpeedFactors = [1.0, 0.7, 1.3, 0.85, 1.15, 0.6, 1.4, 0.9];
    let workIsPinned = false;

    function enterWorkPinned() {
      if (workIsPinned || !workEl || !expEl) return;
      workIsPinned = true;
      const expH = expEl.offsetHeight;
      workEl.style.position = "fixed";
      workEl.style.top = expH + "px";
      workEl.style.left = "0";
      workEl.style.right = "0";
      workEl.style.height = (window.innerHeight - expH) + "px";
      workEl.style.overflow = "hidden";
      workEl.style.zIndex = "6";
      // Fade in — double RAF ensures opacity:0 is painted before transition starts
      workEl.style.transition = "";
      workEl.style.opacity = "0";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          workEl.style.transition = "opacity 0.6s ease";
          workEl.style.opacity = "1";
        });
      });
    }

    function exitWorkPinned() {
      if (!workIsPinned || !workEl) return;
      workIsPinned = false;
      workEl.style.transition = "";
      workEl.style.opacity = "";
      workEl.style.position = "";
      workEl.style.top = "";
      workEl.style.left = "";
      workEl.style.right = "";
      workEl.style.height = "";
      workEl.style.overflow = "";
      workEl.style.zIndex = "";
    }

    function setMobileWrapperHeight() {
      if (!isMobile || !expEl) return;
      wrapper.style.height = (expEl.offsetHeight + window.innerHeight * 0.9) + "px";
    }
    setMobileWrapperHeight();
    window.addEventListener("resize", setMobileWrapperHeight);

    // Reduce movements for smaller screens
    const mobileFactor = isMobile ? 0.7 : (isTablet ? 0.6 : 1);

    const spreadOffsets = isMobile ? [
      // Mobile: tags ya posicionados por CSS (Figma). Sin spread extra — solo entrada + colapso.
      { x:   0, y:   0, r:  0, speed: 1.1 },  // BRANDING
      { x:   0, y:   0, r:  0, speed: 0.9 },  // PACKAGING
      { x:   0, y:   0, r:  0, speed: 1.0 },  // STRATEGY
      { x:   0, y:   0, r:  0, speed: 0.95 }, // DIGITAL
      { x:   0, y:   0, r:  0, speed: 1.05 }, // AD CAMPAIGNS
      { x:   0, y:   0, r:  0, speed: 1.0 },  // WEB & ECOMM
      { x:   0, y:   0, r:  0, speed: 1.1 },  // DESIGN GUIDE
      { x:   0, y:   0, r:  0, speed: 0.95 }, // OUTDOORS
    ] : [
      { x: -100 * mobileFactor, y: -50 * mobileFactor, r: -5, speed: 1.2 },
      { x: 100 * mobileFactor, y: -50 * mobileFactor, r: 5, speed: 0.8 },
      { x: -80 * mobileFactor, y: -20 * mobileFactor, r: -3, speed: 1.1 },
      { x: 150 * mobileFactor, y:  20 * mobileFactor, r: 8,  speed: 0.9 },
      { x: -150 * mobileFactor, y: -40 * mobileFactor, r: -10, speed: 1.3 },
      { x:  120 * mobileFactor, y: -60 * mobileFactor, r: 5,  speed: 1.0 },
      { x:  -60 * mobileFactor, y: -60 * mobileFactor, r: 4,  speed: 1.0 },
      { x:   60 * mobileFactor, y: -60 * mobileFactor, r: -4, speed: 1.15 },
    ];

    function render() {
      if (!isSectionVisible) {
        requestAnimationFrame(render);
        return;
      }

      const rect = wrapper.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // START calculations — empieza antes para que el viaje sea visible sin negro largo
      const entryStart = isMobile ? windowHeight * 2.5 : windowHeight * 1.6;
      const entryEnd = 0;

      // 1. Entry Progress (0 to 1) - While wrapper is entering viewport
      let entryProgress = (entryStart - rect.top) / (entryStart - entryEnd);
      entryProgress = Math.max(0, Math.min(1, entryProgress));

      // 2. Growth Progress (0 -> infinite) - While wrapper is pinned and scrolling
      const pinnedDist = -rect.top;
      const growthDist = windowHeight;
      // growthProgress goes from 0 to 1+
      let growthProgress = pinnedDist / growthDist;

      if (!isMobile) {
        if (growthProgress > 0 && growthProgress < 2.0) {
          enterWorkPinned();
        } else {
          exitWorkPinned();
        }
      }

      // --- ANIMATION LOGIC ---

      // Exit progress: after section unsticks, expEl.top goes negative as it scrolls out
      const expRect = expEl ? expEl.getBoundingClientRect() : null;
      const exitProgress = expRect ? Math.max(0, -expRect.top / windowHeight) : 0;

      // A. Título: entra desde abajo durante Phase 2 (pinned), no durante Phase 1 (entry)
      if (title) {
        const windowH = window.innerHeight;
        let titleTransY;

        const titleEntryEnd  = isMobile ? 0.5 : 0.4;
        const collapseStart  = 1.2; // desktop only
        const baseTitleUp    = isTablet ? 150 : 280;

        const titleRestY = isMobile ? 80 : 0;

        if (growthProgress <= 0) {
          titleTransY = windowH;
        } else if (growthProgress < titleEntryEnd) {
          const p    = growthProgress / titleEntryEnd;
          const ease = 1 - Math.pow(1 - p, 4); // ease out quartic
          titleTransY = windowH * (1 - ease) + titleRestY * ease;
        } else if (!isMobile && growthProgress >= collapseStart) {
          titleTransY = titleRestY - ((growthProgress - collapseStart) * baseTitleUp);
        } else {
          titleTransY = titleRestY;
        }

        // Mobile exit: parallax as section scrolls out
        if (isMobile) {
          titleTransY -= exitProgress * 500;
        }

        title.style.transform = `translateY(${titleTransY}px)`;

        if (growthProgress <= 0) {
          title.style.opacity = 0;
        } else if (growthProgress < titleEntryEnd) {
          title.style.opacity = Math.min(growthProgress / titleEntryEnd * 2, 1);
        } else {
          title.style.opacity = 1;
        }
      }

      const initialTransY = isMobile ? windowHeight * 1.3 : 250; // Patillas entran desde abajo

      tags.forEach((tag, index) => {
        const rotation = rotations[index] !== undefined ? rotations[index] : 0;
        const stagger = staggerOffsets[index] !== undefined ? staggerOffsets[index] : 0;
        const spread = spreadOffsets[index] || { x: 0, y: 0, r: 0, speed: 1 };
        const speedFactor = spread.speed !== undefined ? spread.speed : 1;

        let scale = 0.5;
        let transX = 0;
        let transY = initialTransY;
        let currentRot = rotation;

        if (isMobile) {
          // Mobile: entrada ocurre durante el scroll pinneado (growthProgress 0 → ~0.6)
          // Antes del pin los tags están abajo y el overflow los oculta
          const mobileStagger = stagger * 0.4;
          const entryDuration = 0.6;
          const p = Math.max(0, Math.min(1, (growthProgress - mobileStagger) / entryDuration));
          const ease = 1 - Math.pow(1 - p, 3);

          scale = 0.5 + 0.5 * ease;
          transY = initialTransY * (1 - ease);

          // Exit parallax: cada tag sube a distinta velocidad cuando la sección scrollea
          transY -= exitProgress * 350 * speedFactor;

        } else {
          // Desktop: entrada durante el approach
          if (entryProgress > 0) {
            const entrySpeed = entrySpeedFactors[index] !== undefined ? entrySpeedFactors[index] : 1;
            let p1 = (entryProgress * entrySpeed - stagger) / (1 - stagger);
            p1 = Math.max(0, Math.min(1, p1));
            const ease1 = 1 - Math.pow(1 - p1, 3);
            scale = 0.5 + 0.5 * ease1;
            transY = initialTransY * (1 - ease1);
          }

          if (growthProgress > 0) {
            scale = 1.0;
            const pGrowth = Math.min(1, growthProgress);
            const p1Blend = Math.max(0, 1 - growthProgress / 0.4);
            const p1Carry = transY * p1Blend;
            transX = spread.x * pGrowth;
            transY = spread.y * pGrowth + p1Carry;
            currentRot += (spread.r || 0) * pGrowth;
            const effectiveCollapse = Math.max(0, growthProgress - 1.2);
            const baseUpward = isTablet ? 120 : 250;
            transY -= effectiveCollapse * baseUpward * speedFactor;
          }
        }

        tag.style.transform = `translate(${transX}px, ${transY}px) rotate(${currentRot}deg) scale(${scale})`;
      });

      requestAnimationFrame(render);
    }

    // Visibility Check Optimization
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

  function initTestimonialsAnimation() {
    // Sección reemplazada por Reconocimientos — ver initReconocimientosCarousel
    return;

    const wrapper = document.querySelector(".testimonials-sticky-wrapper");
    const items = document.querySelectorAll(".collage-item");

    if (!wrapper || items.length === 0) return;

    // Focus Sequence (Order of appearance)
    const sequenceSelectors = [
      ".item-tweet-cd816", // 1. Tweet Big Center
      ".item-tweet-organa", // 2. Tweet Organa
      ".item-smart-yellow", // 3. Smart Yellow Poster
      ".item-tweet-garbachos", // 4. Tweet Garbachos
      ".item-garbachos-chela", // 5. Garbachos Poster
      ".item-tweet-smart", // 6. Tweet Smart
      ".item-smart-storie", // 7. Smart Storie
      ".item-organa-postres", // 8. Organa Postres
      ".item-organa-leaf", // 9. Final Branding
    ];

    // Cache Elements
    const sequenceItems = sequenceSelectors
      .map((sel) => document.querySelector(sel))
      .filter((el) => el);

    function render() {
      const rect = wrapper.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const distance = wrapper.offsetHeight - viewportHeight;

      // Assembly starts when section bottom enters viewport
      const earlyStart = viewportHeight;
      const totalRange = distance + earlyStart;
      let progress = 0;
      if (rect.top <= earlyStart) {
        progress = (earlyStart - rect.top) / totalRange;
      }
      progress = Math.max(0, Math.min(1, progress));

      // TIMELINE: assembly completes before pin, focus starts after a pause
      const progressAtPin = earlyStart / totalRange;
      const p1End = progressAtPin * 0.75;         // assembly done at 75% of approach
      const seqStart = progressAtPin + 0.08;       // focus starts 8% after pinning (pausa con todo visible)

      // --- PHASE 1: COLLAGE ASSEMBLY ---
      let assemblyProgress = p1End > 0 ? progress / p1End : 1;
      assemblyProgress = Math.max(0, Math.min(1, assemblyProgress));

      // --- PHASE 2: SEQUENTIAL FOCUS (seqStart → 1.0) ---
      let seqProgress = seqStart < 1 ? (progress - seqStart) / (1 - seqStart) : 0;
      seqProgress = Math.max(0, Math.min(1, seqProgress));

      // Fix B: exclude hidden items (e.g. display:none on mobile)
      const visibleSeqItems = sequenceItems.filter(
        (el) => window.getComputedStyle(el).display !== "none"
      );
      const totalItems = visibleSeqItems.length;
      const rawCurrentIndex = seqProgress * totalItems;
      const currentIndex = Math.min(Math.floor(rawCurrentIndex), totalItems - 1);
      const activeItem = visibleSeqItems[currentIndex];
      const itemProgress = rawCurrentIndex - currentIndex;

      const smoothstep = (t) => t * t * (3 - 2 * t);

      items.forEach((item) => {
        const easeEntry = 1 - Math.pow(1 - assemblyProgress, 3);
        let baseScale = easeEntry;
        let opacity = 1;

        if (progress > p1End) {
          baseScale = 1.0;
        }

        let focusTransform = "";
        let zIndex = "";

        if (progress > seqStart) {
          if (item === activeItem) {
            // Fix A: use offsetLeft/offsetTop — correctly resolves bottom:/right: items
            const winW = window.innerWidth;
            const winH = window.innerHeight;
            const left = item.offsetLeft;
            const top  = item.offsetTop;
            const w    = item.offsetWidth;
            const h    = item.offsetHeight;

            // Center of item in collage coordinates (collage is sticky at top:0)
            const unshiftedCX = left + w / 2;
            const unshiftedCY = top  + h / 2;
            const targetCX = winW / 2;
            const targetCY = winH / 2;

            // Translate needed to move item center to viewport center
            const tx = targetCX - unshiftedCX;
            const ty = targetCY - unshiftedCY;

            // Scale: 0 → peak → 0 (larger on mobile to fill screen)
            const maxFocusScale = window.innerWidth <= 768 ? 2.5 : 1.5;
            let finalScale;
            if (itemProgress < 0.25) {
              finalScale = smoothstep(itemProgress / 0.25) * maxFocusScale;
            } else if (itemProgress < 0.75) {
              finalScale = maxFocusScale;
            } else {
              finalScale = maxFocusScale * (1.0 - smoothstep((itemProgress - 0.75) / 0.25));
            }

            focusTransform = `translate(${tx}px, ${ty}px) scale(${finalScale})`;
            zIndex = 1000;
            opacity = 1;
          } else {
            // All other items hidden during focus
            opacity = 0;
          }
        }

        // APPLY
        if (focusTransform) {
          item.style.transform = focusTransform;
          item.style.zIndex = zIndex;
          item.style.opacity = opacity;
          item.style.boxShadow = "0 30px 80px rgba(0,0,0,0.5)";
        } else {
          let transform = `translate(0px, 0px) scale(${baseScale})`;
          if (item.classList.contains("item-organa-leaf")) {
            transform = `translate(-50%, -50%) scale(${baseScale})`;
          } else if (item.classList.contains("item-tweet-cd816")) {
            transform = `translate(-50%, 0px) scale(${baseScale})`;
          }
          item.style.transform = transform;
          item.style.zIndex = "";
          item.style.opacity = opacity;
          item.style.boxShadow = "";
        }
      });

      // Collage container: no zoom — stays at scale(1) always
      const collage = document.querySelector(".testimonials-collage");
      if (collage) {
        collage.style.transform = "";
        collage.style.opacity = "1";
      }

      requestAnimationFrame(render);
    }

    render();
  }

  function initFooterAnimation() {
    const footer = document.querySelector(".bsm-footer");
    const logoContainer = document.querySelector(".footer-logo");
    if (!footer || !logoContainer) return;

    const img = logoContainer.querySelector("img");
    const registered = logoContainer.querySelector(".footer-logo-registered");
    if (!img) return;

    // Quitar transición CSS — el scroll lo controla directamente
    img.style.transition = "none";
    if (registered) registered.style.transition = "none";

    function updateFooterScroll() {
      const vh = window.innerHeight;
      const wrapperRect = footer.parentElement.getBoundingClientRect();
      const scrolledPast = Math.max(0, -wrapperRect.top);
      const progress = Math.max(0, Math.min(1, scrolledPast / vh));
      const translateY = 80 * (1 - progress);
      img.style.transform = `translateY(${translateY}%)`;
      if (registered) registered.style.transform = `translateY(${translateY}%)`;
    }

    updateFooterScroll();
    window.addEventListener("scroll", updateFooterScroll, { passive: true });
  }

  function initWorkStickyScroll() {
    const wrapper = document.querySelector(".bsm-work-sticky-wrapper");
    const container = document.querySelector(".bsm-work-container");
    const track = document.querySelector(".bsm-work-track");

    if (!wrapper || !container || !track) return;

    // FadeIn/FadeOut del título según visibilidad
    const workTitle = container.querySelector("h2");
    if (workTitle) {
      const titleObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              workTitle.classList.add("is-visible");
            } else {
              workTitle.classList.remove("is-visible");
            }
          });
        },
        { threshold: 0.3 }
      );
      titleObserver.observe(workTitle);
    }

    function updateDimensions() {
      const trackWidth = track.scrollWidth;
      const viewportWidth = window.innerWidth;

      const scrollDist = trackWidth - viewportWidth;

      if (scrollDist <= 0) {
        wrapper.style.height = "auto";
        track.style.transform = "translateX(0)";
        return;
      }

      const buffer = window.innerWidth <= 768 ? 0 : window.innerHeight;
      wrapper.style.height = `${scrollDist + buffer}px`;
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
      initTestimonialsAnimation();
      initFooterAnimation();
    });
  } else {
    initTagsScrollAnimation();
    initWorkStickyScroll();
    initTestimonialsAnimation();
    initFooterAnimation();
  }
})();

/**
 * Contact Drawer
 * Slides in from the right when clicking "¿LISTO PARA CAMBIAR?"
 */
(function () {
  "use strict";

  function initContactDrawer() {
    const drawer = document.getElementById("contactDrawer");
    const overlay = document.getElementById("contactDrawerOverlay");
    const closeBtn = document.getElementById("contactDrawerClose");
    const openBtns = document.querySelectorAll(
      "#openContactDrawer, #openContactDrawerMobile"
    );

    if (!drawer || !overlay) return;

    function openDrawer() {
      drawer.classList.add("is-open");
      overlay.classList.add("is-open");
      drawer.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function closeDrawer() {
      drawer.classList.remove("is-open");
      overlay.classList.remove("is-open");
      drawer.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    openBtns.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        // Also close mobile menu if open
        const mobileOverlay = document.querySelector(".mobile-menu-overlay");
        const mobileBtn = document.querySelector(".mobile-menu-btn");
        if (mobileOverlay && mobileOverlay.classList.contains("is-active")) {
          mobileOverlay.classList.remove("is-active");
          if (mobileBtn) mobileBtn.classList.remove("is-active");
          document.body.style.overflow = "";
        }
        openDrawer();
      });
    });

    if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
    overlay.addEventListener("click", closeDrawer);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.classList.contains("is-open")) {
        closeDrawer();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initContactDrawer);
  } else {
    initContactDrawer();
  }
})();

/**
 * Acordeón "Seguir leyendo" — página de proyecto interno
 */
(function () {
  "use strict";

  function initProyectoAcordeon() {
    const btn   = document.querySelector(".proyecto-seguir-btn");
    const panel = document.querySelector(".proyecto-acordeon");

    if (!btn || !panel) return;

    btn.addEventListener("click", function () {
      const isOpen = panel.classList.contains("is-open");
      panel.classList.toggle("is-open", !isOpen);
      panel.setAttribute("aria-hidden", isOpen ? "true" : "false");
      btn.setAttribute("aria-expanded", isOpen ? "false" : "true");
      btn.classList.toggle("is-open", !isOpen);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initProyectoAcordeon);
  } else {
    initProyectoAcordeon();
  }
})();

/**
 * Animaciones de entrada — página interna de proyecto
 */
(function () {
  "use strict";

  function initInternaAnimations() {
    const main = document.querySelector(".proyecto-interna");
    if (!main) return;

    // Activar estados CSS iniciales
    main.classList.add("anim-ready");

    // ── Animaciones inmediatas al cargar ──────────────────────────────────────
    const title = main.querySelector(".proyecto-main-title");
    const hero = main.querySelector(".proyecto-hero");

    if (title) {
      requestAnimationFrame(() => {
        setTimeout(() => title.classList.add("is-visible"), 80);
      });
    }

    if (hero) {
      requestAnimationFrame(() => {
        setTimeout(() => hero.classList.add("is-visible"), 220);
      });
    }

    // ── Animaciones por scroll (IntersectionObserver) ─────────────────────────
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -50px 0px" }
    );

    // Info columns
    main.querySelectorAll(".proyecto-info-left, .proyecto-info-right").forEach((el) => {
      observer.observe(el);
    });

    // Galería con stagger
    main.querySelectorAll(".galeria-fila").forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.1}s`;
      observer.observe(el);
    });

    // Sección más proyectos
    const masTitle = main.querySelector(".proyecto-mas-title");
    if (masTitle) observer.observe(masTitle);

    main.querySelectorAll(".proyecto-mas-card").forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.14}s`;
      observer.observe(el);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initInternaAnimations);
  } else {
    initInternaAnimations();
  }
})();

/**
 * Carrusel de Reconocimientos
 */
(function () {
  "use strict";

  function initReconocimientosCarousel() {
    const track = document.getElementById("reconocimientosTrack");
    const dotsContainer = document.getElementById("reconocimientosDots");
    if (!track || !dotsContainer) return;

    const slides = Array.from(track.querySelectorAll(".reconocimiento-slide"));
    const total = slides.length;
    let current = 0;
    let autoplayTimer = null;

    // Crear dots
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "reconocimientos-dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("aria-label", "Slide " + (i + 1));
      dot.addEventListener("click", () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    function goTo(index) {
      current = (index + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dotsContainer.querySelectorAll(".reconocimientos-dot").forEach((d, i) => {
        d.classList.toggle("is-active", i === current);
      });
    }

    function startAutoplay() {
      autoplayTimer = setInterval(() => goTo(current + 1), 5000);
    }

    function stopAutoplay() {
      clearInterval(autoplayTimer);
    }

    // Swipe touch support
    let touchStartX = 0;
    track.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
      stopAutoplay();
    }, { passive: true });

    track.addEventListener("touchend", (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
      startAutoplay();
    }, { passive: true });

    startAutoplay();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initReconocimientosCarousel);
  } else {
    initReconocimientosCarousel();
  }
})();
