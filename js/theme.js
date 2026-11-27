
/* ==========================================================================
   Centralized Theme Manager (js/theme.js)
   Manages Light and Dark mode across all Sacred Sankalpam pages.
   ========================================================================== */

(function (window, document) {
  "use strict";

  const THEME_STORAGE_KEY = "sankalpam_theme";
  const BUTTON_SELECTOR = "[data-theme-toggle], #themeToggleBtn";

  /* Read saved theme */

  function readSavedTheme() {
    try {
      return window.localStorage.getItem(THEME_STORAGE_KEY) === "dark"
        ? "dark"
        : "light";
    } catch (error) {
      return "light";
    }
  }

  /* Save theme */

  function writeSavedTheme(theme) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      // Storage may be unavailable in restricted browser contexts.
    }
  }

  /* Synchronize theme button accessibility */

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

  /* Apply theme */

  function applyTheme(theme) {
    const normalized = theme === "dark" ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", normalized);
    document.documentElement.style.colorScheme = normalized;

    writeSavedTheme(normalized);
    syncThemeButtons(normalized);

    return normalized;
  }

  /* Toggle theme */

  function toggleTheme() {
    const current =
      document.documentElement.getAttribute("data-theme") ||
      readSavedTheme();

    return applyTheme(current === "dark" ? "light" : "dark");
  }

  /* Event delegation: supports buttons on every page,
     including buttons added dynamically. */

  function bindThemeToggles() {
    if (document.documentElement.getAttribute("data-theme-events-bound") === "true") {
      syncThemeButtons(readSavedTheme());
      return;
    }

    document.documentElement.setAttribute("data-theme-events-bound", "true");

    document.addEventListener("click", function (event) {
      const button = event.target.closest(BUTTON_SELECTOR);

      if (!button) {
        return;
      }

      event.preventDefault();
      toggleTheme();
    });

    syncThemeButtons(readSavedTheme());
  }

  /* Image fallback handling */

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

  /* Initialize */

  function initializeThemeManager() {
    applyTheme(readSavedTheme());
    bindThemeToggles();
    applyImageFallbacks();
  }

  /* Apply saved theme as early as possible */

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

  /* Synchronize theme when changed in another browser tab */

  window.addEventListener("storage", function (event) {
    if (event.key === THEME_STORAGE_KEY) {
      applyTheme(event.newValue === "dark" ? "dark" : "light");
    }
  });

  /* Public API: preserve compatibility */

  window.SankalpamTheme = {
    getTheme: readSavedTheme,
    setTheme: applyTheme,
    toggleTheme: toggleTheme
  };

})(window, document);
