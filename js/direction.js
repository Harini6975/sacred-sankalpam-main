```javascript
/* ==========================================================================
   Centralized Text Direction Manager (js/direction.js)

   Manages Left-to-Right (LTR) and Right-to-Left (RTL) layout direction
   across all Sacred Sankalpam pages.

   Features:
   - Saves the selected direction using localStorage.
   - Restores the saved direction when a page loads.
   - Supports direction toggle buttons across all pages.
   - Updates accessibility attributes.
   - Preserves the existing universal direction symbol (⇄).
   - Exposes a public API for other JavaScript files.
   ========================================================================== */

(function (window, document) {
  "use strict";

  const DIR_STORAGE_KEY = "sankalpam_dir";
  const DIR_SYMBOL = "⇄";

  /* ------------------------------------------------------------------------
     Read saved direction
     ------------------------------------------------------------------------ */

  function readSavedDirection() {
    try {
      const value = window.localStorage.getItem(DIR_STORAGE_KEY);

      return value === "rtl" ? "rtl" : "ltr";
    } catch (err) {
      return "ltr";
    }
  }

  /* ------------------------------------------------------------------------
     Save selected direction
     ------------------------------------------------------------------------ */

  function writeSavedDirection(dir) {
    try {
      window.localStorage.setItem(DIR_STORAGE_KEY, dir);
    } catch (err) {
      // Ignore storage errors in restricted browser contexts.
    }
  }

  /* ------------------------------------------------------------------------
     Synchronize direction toggle buttons
     ------------------------------------------------------------------------ */

  function syncDirectionButtons(dir) {
    const isRtl = dir === "rtl";

    const nextLabel = isRtl
      ? "Switch layout to Left-to-Right (LTR)"
      : "Switch layout to Right-to-Left (RTL)";

    const buttons = document.querySelectorAll(
      "[data-dir-toggle], #dirToggleBtn"
    );

    buttons.forEach(function (btn) {
      btn.textContent = DIR_SYMBOL;

      btn.setAttribute("aria-pressed", String(isRtl));
      btn.setAttribute("aria-label", nextLabel);
      btn.setAttribute("title", nextLabel);
    });
  }

  /* ------------------------------------------------------------------------
     Apply direction
     ------------------------------------------------------------------------ */

  function applyDirection(dir) {
    const normalized = dir === "rtl" ? "rtl" : "ltr";

    document.documentElement.setAttribute("dir", normalized);
    document.documentElement.setAttribute("lang", "en");

    writeSavedDirection(normalized);
    syncDirectionButtons(normalized);

    return normalized;
  }

  /* ------------------------------------------------------------------------
     Toggle between LTR and RTL
     ------------------------------------------------------------------------ */

  function toggleDirection() {
    const current = document.documentElement.getAttribute("dir");

    return applyDirection(
      current === "rtl" ? "ltr" : "rtl"
    );
  }

  /* ------------------------------------------------------------------------
     Bind direction toggle buttons
     Prevent duplicate event listeners.
     ------------------------------------------------------------------------ */

  function bindDirectionToggles() {
    const buttons = document.querySelectorAll(
      "[data-dir-toggle], #dirToggleBtn"
    );

    buttons.forEach(function (btn) {
      if (btn.getAttribute("data-dir-bound") === "true") {
        return;
      }

      btn.setAttribute("data-dir-bound", "true");

      btn.addEventListener("click", function () {
        toggleDirection();
      });
    });

    // Keep all direction buttons synchronized.
    syncDirectionButtons(
      document.documentElement.getAttribute("dir") || "ltr"
    );
  }

  /* ------------------------------------------------------------------------
     Initialize direction manager
     ------------------------------------------------------------------------ */

  function initializeDirectionManager() {
    applyDirection(readSavedDirection());
    bindDirectionToggles();
  }

  // Apply the saved direction immediately on page load.
  applyDirection(readSavedDirection());

  // Support normal page loading and scripts loaded after DOM readiness.
  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeDirectionManager,
      { once: true }
    );
  } else {
    initializeDirectionManager();
  }

  /* ------------------------------------------------------------------------
     Public API
     Preserve compatibility with other JavaScript files.
     ------------------------------------------------------------------------ */

  window.SankalpamDir = {
    getDir: readSavedDirection,
    setDir: applyDirection,
    toggleDir: toggleDirection
  };

})(window, document);
```