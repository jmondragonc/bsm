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
    // Aumentamos el umbral para que primero se haga "pin" y luego aparezcan
    if (window.scrollY > 50) {
      if (nav) {
        nav.classList.add("show");
      }
      if (heroTitle) {
        heroTitle.classList.add("show");
      }
    } else {
      // Opcional: ocultarlos si vuelve arriba (el usuario no especificó quitarlos, pero es consistente)
      // if (nav) nav.classList.remove("show");
      // if (heroTitle) heroTitle.classList.remove("show");
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

    // Detener la animación después de 2.5 segundos (tiempo estimado de la animación original)
    setTimeout(function () {
      clearInterval(bInterval);
      clearInterval(mInterval);

      // Asegurarse de que termine en el frame principal (opcional, si se ve mal detenido en otro frame)
      // resetToMainFrame();
    }, 2500);
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
    // const section = document.querySelector(".bsm-full-experience"); // Not strictly needed if we target H2 directly
    const title = document.querySelector(".bsm-full-experience h2");

    // Ensure we select all tags properly
    const tags = Array.from(document.querySelectorAll(".services-tags .tag"));

    if (!wrapper || tags.length === 0) {
      return;
    }

    // Initial styles
    if (title) {
      title.style.opacity = 0;
      title.style.willChange = "opacity";
    }

    // Map of final rotations matching CSS requirements
    const rotations = [15, -15, 8, -4, -28, 15, 18, -25];

    // Stagger delays to create wave effect
    const staggerOffsets = [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35];

    // Spread vectors for Phase 2 (Growth)
    // As they grow, move them outwards to avoid overlapping
    // {x, y, r, speed} (r = additional rotation, speed = parallax speed factor)
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth < 1200 && window.innerWidth >= 768;

    // Disable complex animations on mobile
    if (isMobile) {
      // Simple fade in only for mobile - no scale or movement
      tags.forEach((tag) => {
        tag.style.opacity = 1;
        tag.style.transform = 'none';
      });
      if (title) title.style.opacity = 1;
      return; // Exit early, no animation loop
    }

    // Reduce movements for smaller screens
    const mobileFactor = isTablet ? 0.6 : 1;

    const spreadOffsets = [
      { x: -100 * mobileFactor, y: -50 * mobileFactor, r: -5, speed: 1.2 },
      { x: 100 * mobileFactor, y: -50 * mobileFactor, r: 5, speed: 0.8 },
      { x: -80 * mobileFactor, y: -20 * mobileFactor, r: -3, speed: 1.1 },
      { x: 150 * mobileFactor, y: 20 * mobileFactor, r: 8, speed: 0.9 },
      { x: -150 * mobileFactor, y: 80 * mobileFactor, r: -10, speed: 1.3 },
      { x: 120 * mobileFactor, y: 120 * mobileFactor, r: 5, speed: 0.7 },
      { x: -60 * mobileFactor, y: 150 * mobileFactor, r: 4, speed: 1.0 },
      { x: 60 * mobileFactor, y: 150 * mobileFactor, r: -4, speed: 1.15 },
    ];

    function render() {
      if (!isSectionVisible) {
        requestAnimationFrame(render);
        return;
      }

      const rect = wrapper.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // START calculations
      const entryStart = windowHeight;
      const entryEnd = 0;

      // 1. Entry Progress (0 to 1) - While wrapper is entering viewport
      let entryProgress = (entryStart - rect.top) / (entryStart - entryEnd);
      entryProgress = Math.max(0, Math.min(1, entryProgress));

      // 2. Growth Progress (0 -> infinite) - While wrapper is pinned and scrolling
      const pinnedDist = -rect.top;
      const growthDist = windowHeight;
      // growthProgress goes from 0 to 1+
      let growthProgress = pinnedDist / growthDist;

      // Calculate Scroll Up Progress (starts after growth/pinning is done or during)
      // We want continuous upward movement.
      // Let's use the raw pinned distance
      // MOVED: Calculation happens per tag now for variable speed

      // --- ANIMATION LOGIC ---

      // A. Text Fade In
      if (title) {
        // Fade in during the first 50% of entry
        let textOpacity = entryProgress / 0.8;
        title.style.opacity = Math.min(1, Math.max(0, textOpacity));
      }

      const initialTransY = 400; // Deep entry as requested

      tags.forEach((tag, index) => {
        const rotation = rotations[index] !== undefined ? rotations[index] : 0;
        const stagger =
          staggerOffsets[index] !== undefined ? staggerOffsets[index] : 0;
        const spread = spreadOffsets[index] || { x: 0, y: 0, r: 0, speed: 1 };
        const speedFactor = spread.speed !== undefined ? spread.speed : 1;

        let scale = 0.5;
        let transX = 0;
        let transY = initialTransY;
        let opacity = 0;
        let currentRot = rotation;

        // PHASE 1: Entry (Coming up from bottom)
        if (entryProgress > 0) {
          // Normalized progress for this specific tag considering stagger
          // Stagger is 0 to 0.35. We want all to finish by entryProgress = 1
          let p1 = (entryProgress - stagger) / (1 - stagger);
          p1 = Math.max(0, Math.min(1, p1));

          const ease1 = p1 * (2 - p1); // Ease Out Quad

          scale = 0.5 + 0.5 * ease1; // 0.5 -> 1.0
          transY = initialTransY * (1 - ease1); // 400 -> 0
          opacity = ease1;
        }

        // PHASE 2 & 3: Growth and Continuous Upward Scroll
        if (growthProgress > 0) {
          // Base state is end of Phase 1
          scale = 1.0;
          transX = 0;
          transY = 0;
          opacity = 1;

          // Growth
          // Scale DISABLED to prevent oversized tags
          let pGrowth = Math.min(1, growthProgress); // Cap growth phase at 1
          const easeGrowth = pGrowth; // Linear or ease

          // No scale - keep tags at original size
          scale = 1.0;

          // Spreading out
          transX = spread.x * easeGrowth;
          transY = spread.y * easeGrowth;

          currentRot += (spread.r || 0) * easeGrowth;

          // CONTINUOUS UPWARD SCROLL (Parallax)
          // As we scroll past, move everything UP further
          // This happens on top of the spread
          // Using growthProgress directly for continuous movement
          // Apply unique speed factor (reduced for mobile)
          const baseUpward = isMobile ? 80 : (isTablet ? 150 : 250);
          const upwardMovement = growthProgress * baseUpward * speedFactor;
          transY -= upwardMovement;
        }

        tag.style.opacity = opacity;
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
    const wrapper = document.querySelector(".testimonials-sticky-wrapper");
    // Select all collage items
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
      // Check visibility
      const rect = wrapper.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const distance = wrapper.offsetHeight - viewportHeight;
      const currentScroll = -rect.top;

      let progress = 0;
      if (rect.top <= 0) {
        progress = currentScroll / distance;
      }
      progress = Math.max(0, Math.min(1, progress));

      // TIMELINE CONFIG
      const p1End = 0.15; // Phase 1 ends at 15%

      // --- PHASE 1: COLLAGE ASSEMBLY (0% - 15%) ---
      // We normalize this 0-0.15 range to 0-1 for the assembly animation
      let assemblyProgress = progress / p1End;
      assemblyProgress = Math.max(0, Math.min(1, assemblyProgress));

      // --- PHASE 2: SEQUENTIAL FOCUS (15% - 100%) ---
      // Normalize 0.15-1.0 to 0-1
      let seqProgress = (progress - p1End) / (1 - p1End);
      seqProgress = Math.max(0, Math.min(1, seqProgress));

      // Calculate active index for sequence
      const totalItems = sequenceItems.length;
      // Map seqProgress 0-1 to 0-totalItems
      const rawCurrentIndex = seqProgress * (totalItems + 1); // +1 buffer
      const currentIndex = Math.floor(rawCurrentIndex);
      const activeItem = sequenceItems[currentIndex];

      // Sub-progress for the current item (0 to 1)
      const itemProgress = rawCurrentIndex - currentIndex;

      items.forEach((item, index) => {
        // --- BASE STATE (Collage) ---
        // Recalculate the Phase 1 Base State for everyone

        const speed = 1.0 + (index % 4) * 0.15;

        let p = assemblyProgress * 1;

        const easeEntry = 1 - Math.pow(1 - assemblyProgress, 3);

        const startScale = 0.5;
        const endScale = 1.0;
        let baseScale = startScale + (endScale - startScale) * easeEntry;

        const startY = 300 * speed;
        let currentY = startY * (1 - easeEntry);

        let opacity = Math.min(1, easeEntry * 2.5);

        // If Phase 2 started, base state is fully assembled
        if (progress > p1End) {
          baseScale = 1.0;
          currentY = 0;
          opacity = 1;
        }

        // --- PHASE 2 FOCUS LOGIC ---
        let focusTransform = "";
        let zIndex = "";

        if (progress > p1End) {
          // Check if active
          if (item === activeItem) {
            // FOCUS THIS ITEM
            const style = window.getComputedStyle(item);
            const val = (v, parent) => {
              if (v && v.includes("px")) return parseFloat(v);
              if (v && v.includes("%")) return (parseFloat(v) / 100) * parent;
              return 0;
            };

            const winW = window.innerWidth;
            const winH = window.innerHeight;

            const top = val(style.top, winH);
            const left = val(style.left, winW);
            const width = parseFloat(style.width) || 0;
            const height = parseFloat(style.height) || 0;

            // CSS Center
            const cx = left + width / 2;
            const cy = top + height / 2;

            // Target Center (Viewport)
            const targetCX = winW / 2;
            const targetCY = winH / 2;

            const dx = targetCX - cx;
            const dy = targetCY - cy;

            // Transition Logic
            // Enter: 0-0.2
            // Hold: 0.2-0.8
            // Exit: 0.8-1.0

            let focusFactor = 0;
            if (itemProgress < 0.2) {
              const t = itemProgress / 0.2;
              focusFactor = t * (2 - t);
            } else if (itemProgress < 0.8) {
              focusFactor = 1;
            } else {
              const t = (itemProgress - 0.8) / 0.2;
              focusFactor = 1 - t * t;
            }

            const finalScale = 1.0 + 0.5 * focusFactor; // 1.0 -> 1.5

            // Base Rotation Handling
            let baseRotate = 0;
            if (item.classList.contains("item-garbachos-bocas"))
              baseRotate = -10;
            if (item.classList.contains("item-smart-yellow")) baseRotate = 5;

            const currentRotate = baseRotate * (1 - focusFactor); // Rotate -> 0

            // Handle CSS TranslateX(-50%) on some items
            let startX = 0;
            if (item.classList.contains("item-tweet-cd816"))
              startX = -0.5 * width;
            if (item.classList.contains("item-organa-leaf"))
              startX = -0.5 * width;
            if (item.classList.contains("item-organa-leaf"))
              currentY += -0.5 * height; // CSS has translate -50, -50 for this one

            // Correct interpolated center
            // dx moves from 'left' based center to 'viewport' center
            // but transform adds to 'left'.
            const frameX = startX + (dx - startX) * focusFactor; // Approximate interpolation

            // For simplified focus:
            // We just want to effectively translate it by (dx, dy)
            // But preserving the start offset

            // Let's use a simpler transform for focus:
            // We know dx, dy needed to move center to center.
            // We apply that on TOP of whatever base css positioning exists.
            // IF we ignore the `startX` logic and just do `translate(dx, dy)`,
            // it works IF the transform origin matches.
            // But CSS transform origin is 50% 50% usually.

            // Re-calculating proper translate:
            // Current visual center (with no transform) = cx, cy.
            // We want visual center = targetCX, targetCY.
            // Translate needed = (targetCX - cx, targetCY - cy).

            // Is there existing transform?
            // cd816 has translateX(-50%). So its Visual Center X is (left + width/2) - (width/2) = left.
            // So for cd816, cx should be `left`.
            let visualCX = cx;
            let visualCY = cy;

            if (item.classList.contains("item-tweet-cd816"))
              visualCX -= width / 2;
            if (item.classList.contains("item-organa-leaf")) {
              visualCX -= width / 2;
              visualCY -= height / 2;
            }

            const moveX = targetCX - visualCX;
            const moveY = targetCY - visualCY;

            const curMoveX = moveX * focusFactor;
            const curMoveY = moveY * focusFactor;

            // Apply. We need to include the 'base' transform in the calculation?
            // No, we are generating the full string.
            // Phase 2 Base transform is translate(0,0).
            // So we just output the move.
            // BUT we need to add the base transform strings back if we aren't fully focused?
            // No, FocusFactor handles the blend from 0 to 1.
            // When FocusFactor is 0, curMoveX is 0.
            // BUT we need `startX` (the -50%) to be there when FocusFactor is 0!

            let baseTransformStr = "";
            if (item.classList.contains("item-tweet-cd816"))
              baseTransformStr = "translateX(-50%)";
            if (item.classList.contains("item-organa-leaf"))
              baseTransformStr = "translate(-50%, -50%)";

            // If we just use the calculated move from Visual Center, we don't need the base transform string
            // because `curMoveX` is the total distance from "Natural Element Position" to "Target".
            // Wait. "Natural Element Position" is defined by top/left.
            // `moveX` is (Target - VisualCenter).
            // If we apply `translateX(moveX)`, the new center is VisualCenter + moveX = Target.
            // HOWEVER, this assumes `translateX` starts at 0 relative to Natural Position.
            // If the element has `translateX(-50%)` in CSS, that Shift is part of its Natural Visual Position?
            // No, standard CSS flow puts it at top/left. Transform shifts it.
            // So "Natural Top/Left Position" is `left, top`.
            // "Visual Start" is `left - width/2`.
            // We want to go to `Target`.
            // Distance = Target - (left). (Using Center of element as ref).
            // Center of element (untransformed) is `left + width/2`.
            // We want final center to be `Target`.
            // Translate needed = Target - (left + width/2).
            // If we apply this Translate, the element center moves to Target.
            // This works REGARDLESS of the CSS `translateX(-50%)` ONLY IF we remove that class shift.
            // We are overwriting `transform`, so we ARE removing the CSS shift.
            // So we just need to calculate `Target - UnshiftedCenter`.
            // UnshiftedCenter = left + width/2.

            const realUnshiftedCX = left + width / 2;
            const realUnshiftedCY = top + height / 2;

            const realDX = targetCX - realUnshiftedCX;
            const realDY = targetCY - realUnshiftedCY;

            // Interpolate
            // Start State (FocusFactor 0): We want it to look like the Collage.
            // In Collage, cd816 looks centered because of CSS `translateX(-50%)`.
            // If we overwrite transform with `translate(0,0)`, it jumps to the right.
            // So Start State must be `translate(-50%, 0)`.
            // Or, in pixels: `translate(-width/2, 0)`.

            let startTX = 0;
            let startTY = 0;
            if (item.classList.contains("item-tweet-cd816"))
              startTX = -width / 2;
            if (item.classList.contains("item-organa-leaf")) {
              startTX = -width / 2;
              startTY = -height / 2;
            }

            const currentTX = startTX + (realDX - startTX) * focusFactor;
            const currentTY = startTY + (realDY - startTY) * focusFactor;

            focusTransform = `translate(${currentTX}px, ${currentTY}px) scale(${finalScale}) rotate(${currentRotate}deg)`;
            zIndex = 1000;
          } else {
            // Dim others
            if (currentIndex >= 0 && currentIndex < totalItems) {
              opacity = 0.1;
            }
          }
        }

        // APPLY
        if (focusTransform) {
          item.style.transform = focusTransform;
          item.style.zIndex = zIndex;
          item.style.opacity = 1;
          item.style.boxShadow = "0 30px 80px rgba(0,0,0,0.5)";
        } else {
          let transform = `translate(${0}px, ${currentY}px) scale(${baseScale})`;

          if (item.classList.contains("item-organa-leaf")) {
            transform = `translate(-50%, calc(-50% + ${currentY}px)) scale(${baseScale})`;
          } else if (item.classList.contains("item-tweet-cd816")) {
            transform = `translate(-50%, ${currentY}px) scale(${baseScale})`;
          } else {
            if (item.classList.contains("item-garbachos-bocas"))
              transform += " rotate(-10deg)";
            if (item.classList.contains("item-smart-yellow"))
              transform += " rotate(5deg)";
          }

          item.style.transform = transform;
          item.style.zIndex = "";
          item.style.opacity = opacity;
          item.style.boxShadow = "";
        }
      });

      requestAnimationFrame(render);
    }

    render();
  }

  function initFooterAnimation() {
    const footer = document.querySelector(".bsm-footer");
    const logoContainer = document.querySelector(".footer-logo");

    if (!footer || !logoContainer) return;

    // Remove any inline styles left by the previous scroll logic
    const img = logoContainer.querySelector("img");
    if (img) img.style.transform = "";
    // And ensure transition is active in CSS, removing the 'none' override
    if (img) img.style.transition = "";

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add class to trigger CSS transition
            logoContainer.classList.add("is-visible");
          } else {
            // Remove class to reset animation when scrolling away
            logoContainer.classList.remove("is-visible");
          }
        });
      },
      { threshold: 0 }
    ); // Trigger immediately on enter/exit check

    observer.observe(footer);
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
