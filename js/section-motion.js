/* ==========================================================================
   Section Reveal Motion Controller (js/section-motion.js)
   Adds smooth entrance animations to .section blocks while keeping the
   home hero immediate and accessible.
   ========================================================================== */

(function (window, document) {
  "use strict";

  function revealSection(section) {
    section.classList.add("is-visible");
  }

  function initSectionMotion() {
    if (document.body && document.body.getAttribute("data-motion-initialized") === "true") {
      return;
    }

    const sections = Array.prototype.slice.call(document.querySelectorAll("main .section"));
    if (!sections.length) return;

    if (document.body) {
      document.body.setAttribute("data-motion-initialized", "true");
    }

    const prefersReducedMotion =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    sections.forEach(function (sec, idx) {
      sec.classList.add("motion-section");
      const staggerDelay = Math.min((idx % 4) * 70, 210);
      sec.style.setProperty("--section-delay", staggerDelay + "ms");

      // Hero of home page (#home-sec-1) or top-of-page first section reveals immediately
      const rect = sec.getBoundingClientRect();
      const nearViewport = rect.top < window.innerHeight * 0.95;
      if (prefersReducedMotion || sec.id === "home-sec-1" || nearViewport) {
        revealSection(sec);
      }
    });

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      sections.forEach(revealSection);
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            revealSection(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -24px 0px"
      }
    );

    sections.forEach(function (sec) {
      if (!sec.classList.contains("is-visible")) {
        observer.observe(sec);
      }
    });

    // Safety sweep on scroll so no section ever remains invisible
    window.addEventListener(
      "scroll",
      function () {
        sections.forEach(function (sec) {
          if (!sec.classList.contains("is-visible")) {
            const top = sec.getBoundingClientRect().top;
            if (top < window.innerHeight + 60) {
              revealSection(sec);
            }
          }
        });
      },
      { passive: true }
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSectionMotion);
  } else {
    initSectionMotion();
  }
})(window, document);