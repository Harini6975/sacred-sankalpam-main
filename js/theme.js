```javascript
/* ==========================================================================
   Centralized Theme Manager (js/theme.js)
   Manages Light and Dark mode across all Sacred Sankalpam pages.
   Features:
   - Saves the selected theme using localStorage.
   - Applies the saved theme when a page loads.
   - Supports theme toggle buttons across all pages.
   - Updates accessibility attributes.
   - Provides image fallback handling.
   ========================================================================== */

(function (window, document) {
  "use strict";

  const THEME_STORAGE_KEY = "sankalpam_theme";

  /* ------------------------------------------------------------------------
     Read the saved theme
     ------------------------------------------------------------------------ */

  function readSavedTheme() {
    try {
      const value = window.localStorage.getItem(THEME_STORAGE_KEY);
      return value === "dark" ? "dark" : "light";
    } catch (err) {
      return "light";
    }
  }

  /* ------------------------------------------------------------------------
     Save the selected theme
     ------------------------------------------------------------------------ */

  function writeSavedTheme(theme) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (err) {
      // Ignore storage errors in restricted browser contexts.
    }
  }

  /* ------------------------------------------------------------------------
     Update theme toggle button accessibility attributes
     ------------------------------------------------------------------------ */

  function syncThemeButtons(theme) {
    const isDark = theme === "dark";

    const label = isDark
      ? "Switch to light mode"
      : "Switch to dark mode";

    const buttons = document.querySelectorAll(
      "[data-theme-toggle], #themeToggleBtn"
    );

    buttons.forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(isDark));
      btn.setAttribute("aria-label", label);
      btn.setAttribute("title", label);
    });
  }

  /* ------------------------------------------------------------------------
     Apply a theme
     ------------------------------------------------------------------------ */

  function applyTheme(theme) {
    const normalized = theme === "dark" ? "dark" : "light";

    document.documentElement.setAttribute(
      "data-theme",
      normalized
    );

    document.documentElement.setAttribute("lang", "en");

    writeSavedTheme(normalized);
    syncThemeButtons(normalized);

    return normalized;
  }

  /* ------------------------------------------------------------------------
     Toggle between light and dark mode
     ------------------------------------------------------------------------ */

  function toggleTheme() {
    const current = document.documentElement.getAttribute(
      "data-theme"
    );

    return applyTheme(
      current === "dark" ? "light" : "dark"
    );
  }

  /* ------------------------------------------------------------------------
     Bind theme toggle buttons
     Prevent duplicate event listeners.
     ------------------------------------------------------------------------ */

  function bindThemeToggles() {
    const buttons = document.querySelectorAll(
      "[data-theme-toggle], #themeToggleBtn"
    );

    buttons.forEach(function (btn) {
      if (btn.getAttribute("data-theme-bound") === "true") {
        return;
      }

      btn.setAttribute("data-theme-bound", "true");

      btn.addEventListener("click", function () {
        toggleTheme();
      });
    });

    // Keep button labels synchronized with the active theme.
    syncThemeButtons(
      document.documentElement.getAttribute("data-theme") || "light"
    );
  }

  /* ------------------------------------------------------------------------
     Image fallback handling
     If the main image fails, use its data-fallback image.
     ------------------------------------------------------------------------ */

  function applyImageFallbacks() {
    const images = document.querySelectorAll("img[data-fallback]");

    images.forEach(function (img) {
      if (img.getAttribute("data-fallback-bound") === "true") {
        return;
      }

      img.setAttribute("data-fallback-bound", "true");

      img.addEventListener("error", function () {
        const fallbackSrc = img.getAttribute("data-fallback");

        if (!fallbackSrc) {
          return;
        }

        // Prevent repeated fallback attempts.
        if (img.getAttribute("src") === fallbackSrc) {
          return;
        }

        img.setAttribute("src", fallbackSrc);
      });
    });
  }

  /* ------------------------------------------------------------------------
     Initialize theme-related page functionality
     ------------------------------------------------------------------------ */

  function initializeThemeManager() {
    applyTheme(readSavedTheme());
    bindThemeToggles();
    applyImageFallbacks();
  }

  // Apply the saved theme immediately to reduce unwanted theme flashing.
  applyTheme(readSavedTheme());

  // Support both normal page loading and scripts loaded after DOM readiness.
  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeThemeManager,
      { once: true }
    );
  } else {
    initializeThemeManager();
  }

  /* ------------------------------------------------------------------------
     Public API
     Preserve compatibility with other JavaScript files.
     ------------------------------------------------------------------------ */

  window.SankalpamTheme = {
    getTheme: readSavedTheme,
    setTheme: applyTheme,
    toggleTheme: toggleTheme
  };

})(window, document);
```