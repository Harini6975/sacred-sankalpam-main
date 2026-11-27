
/* ==========================================================================
   Centralized Theme Manager (js/theme.js)
   Manages Light and Dark mode across all Sacred Sankalpam pages.
   Features:
   - Light and Dark theme switching
   - Saves theme preference in localStorage
   - Automatically applies saved theme on every page
   - Supports dynamically added theme buttons
   - Synchronizes theme buttons across browser tabs
   - Updates button accessibility labels
   - Handles image fallback
   ========================================================================== */

(function (window, document) {
  "use strict";

  const THEME_STORAGE_KEY = "sankalpam_theme";
  const BUTTON_SELECTOR = "[data-theme-toggle], #themeToggleBtn";

  /* ----------------------------------------------------------
     Read saved theme
  ---------------------------------------------------------- */

  function readSavedTheme() {
    try {
      return window.localStorage.getItem(THEME_STORAGE_KEY) === "dark"
        ? "dark"
        : "light";
    } catch (error) {
      return "light";
    }
  }

  /* ----------------------------------------------------------
     Save theme
  ---------------------------------------------------------- */

  function writeSavedTheme(theme) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      // Storage may be unavailable in restricted browser contexts.
    }
  }

  /* ----------------------------------------------------------
     Synchronize theme button accessibility
  ---------------------------------------------------------- */

  function syncThemeButtons(theme) {
    const isDark = theme === "dark";

    const label = isDark
      ? "Switch to light mode"
      : "Switch to dark mode";

    document.querySelectorAll(BUTTON_SELECTOR).forEach(function (button) {
      button.setAttribute("aria-pressed", String(isDark));
      button.setAttribute("aria-label", label);
      button.setAttribute("title", label);
    });
  }

  /* ----------------------------------------------------------
     Apply theme
  ---------------------------------------------------------- */

  function applyTheme(theme) {
    const normalized = theme === "dark" ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", normalized);
    document.documentElement.style.colorScheme = normalized;

    // Keep the website English-only.
    document.documentElement.setAttribute("lang", "en");

    writeSavedTheme(normalized);
    syncThemeButtons(normalized);

    return normalized;
  }

  /* ----------------------------------------------------------
     Toggle theme
  ---------------------------------------------------------- */

  function toggleTheme() {
    const current =
      document.documentElement.getAttribute("data-theme") ||
      readSavedTheme();

    return applyTheme(current === "dark" ? "light" : "dark");
  }

  /* ----------------------------------------------------------
     Bind theme toggle buttons
     Event delegation supports buttons on every page,
     including buttons added dynamically.
  ---------------------------------------------------------- */

  function bindThemeToggles() {
    const root = document.documentElement;

    // Prevent duplicate event listeners.
    if (root.getAttribute("data-theme-events-bound") === "true") {
      syncThemeButtons(readSavedTheme());
      return;
    }

    root.setAttribute("data-theme-events-bound", "true");

    document.addEventListener("click", function (event) {
      const target = event.target;

      // Safely check whether the click target supports closest().
      if (!target || typeof target.closest !== "function") {
        return;
      }

      const button = target.closest(BUTTON_SELECTOR);

      if (!button) {
        return;
      }

      event.preventDefault();
      toggleTheme();
    });

    syncThemeButtons(readSavedTheme());
  }

  /* ----------------------------------------------------------
     Image fallback handling
     Uses data-fallback when an image fails to load.
  ---------------------------------------------------------- */

  function applyImageFallbacks() {
    document.querySelectorAll("img[data-fallback]").forEach(function (img) {
      if (img.getAttribute("data-fallback-bound") === "true") {
        return;
      }

      img.setAttribute("data-fallback-bound", "true");

      img.addEventListener("error", function () {
        const fallbackSrc = img.getAttribute("data-fallback");

        if (!fallbackSrc || img.getAttribute("src") === fallbackSrc) {
          return;
        }

        img.setAttribute("src", fallbackSrc);
      });
    });
  }

  /* ----------------------------------------------------------
     Initialize theme manager
  ---------------------------------------------------------- */

  function initializeThemeManager() {
    applyTheme(readSavedTheme());
    bindThemeToggles();
    applyImageFallbacks();
  }

  /* ----------------------------------------------------------
     Apply saved theme as early as possible
     Prevents unnecessary theme flashing during page loading.
  ---------------------------------------------------------- */

  applyTheme(readSavedTheme());

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeThemeManager,
      { once: true }
    );
  } else {
    initializeThemeManager();
  }

  /* ----------------------------------------------------------
     Synchronize theme across browser tabs
  ---------------------------------------------------------- */

  window.addEventListener("storage", function (event) {
    if (event.key === THEME_STORAGE_KEY) {
      applyTheme(event.newValue === "dark" ? "dark" : "light");
    }
  });

  /* ----------------------------------------------------------
     Public API
     Preserve compatibility with existing website scripts.
  ---------------------------------------------------------- */

  window.SankalpamTheme = {
    getTheme: readSavedTheme,
    setTheme: applyTheme,
    toggleTheme: toggleTheme
  };

})(window, document);
