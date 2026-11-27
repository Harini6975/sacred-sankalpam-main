/* ==========================================================================
   Shared Public Navigation & UI Helpers (js/main.js)
   Plain Vanilla JS for mobile menu drawer and active link state.
   ========================================================================== */

(function (window, document) {
  "use strict";

  function closeMobileNav(mobileBtn, mainNav) {
    if (!mobileBtn || !mainNav) {
      return;
    }
    mainNav.classList.remove("is-open");
    mobileBtn.setAttribute("aria-expanded", "false");
  }

  function initMobileNav() {
    const mobileBtn = document.getElementById("mobileMenuBtn");
    const mainNav = document.getElementById("mainNav");
    if (!mobileBtn || !mainNav) {
      return;
    }

    if (mobileBtn.getAttribute("data-nav-bound") !== "true") {
      mobileBtn.setAttribute("data-nav-bound", "true");
      mobileBtn.addEventListener("click", function () {
        const isOpen = mainNav.classList.toggle("is-open");
        mobileBtn.setAttribute("aria-expanded", String(isOpen));
      });
    }

    // Close menu when a navigation link is clicked on mobile
    mainNav.querySelectorAll("a").forEach(function (link) {
      if (link.getAttribute("data-nav-link-bound") === "true") {
        return;
      }
      link.setAttribute("data-nav-link-bound", "true");
      link.addEventListener("click", function () {
        closeMobileNav(mobileBtn, mainNav);
      });
    });

    if (!document.body.getAttribute("data-nav-doc-bound")) {
      document.body.setAttribute("data-nav-doc-bound", "true");

      document.addEventListener("click", function (event) {
        const currentBtn = document.getElementById("mobileMenuBtn");
        const currentNav = document.getElementById("mainNav");
        if (!currentBtn || !currentNav || !currentNav.classList.contains("is-open")) {
          return;
        }
        const target = event.target;
        if (!currentNav.contains(target) && !currentBtn.contains(target)) {
          closeMobileNav(currentBtn, currentNav);
        }
      });

      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
          const currentBtn = document.getElementById("mobileMenuBtn");
          const currentNav = document.getElementById("mainNav");
          closeMobileNav(currentBtn, currentNav);
        }
      });
    }
  }

  function highlightActiveNavLink() {
    const rawFile = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    const currentFile = rawFile === "pooja-details.html"
      ? "services.html"
      : rawFile === "priest-profile.html"
        ? "priests.html"
        : rawFile;

    document.querySelectorAll(".nav-menu .nav-link").forEach(function (link) {
      const hrefFile = (link.getAttribute("href") || "").split("?")[0].split("#")[0].toLowerCase();
      const isMatch = Boolean(hrefFile && hrefFile === currentFile);
      link.classList.toggle("active", isMatch);
      if (isMatch) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initMobileNav();
    highlightActiveNavLink();
  });

  window.SankalpamMain = {
    initMobileNav: initMobileNav,
    highlightActiveNavLink: highlightActiveNavLink
  };
})(window, document);