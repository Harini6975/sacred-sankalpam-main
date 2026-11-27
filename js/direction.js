
/* ==========================================================================
   Centralized Text Direction Manager (js/direction.js)
   Manages LTR and RTL layout direction across all Sacred Sankalpam pages.
   ========================================================================== */

(function (window, document) {
  "use strict";

  const DIR_STORAGE_KEY = "sankalpam_dir";
  const DIR_SYMBOL = "⇄";
  const BUTTON_SELECTOR = "[data-dir-toggle], #dirToggleBtn";

  /* Read saved direction */

  function readSavedDirection() {
    try {
      return window.localStorage.getItem(DIR_STORAGE_KEY) === "rtl"
        ? "rtl"
        : "ltr";
    } catch (error) {
      return "ltr";
    }
  }

  /* Save direction */

  function writeSavedDirection(dir) {
    try {
      window.localStorage.setItem(DIR_STORAGE_KEY, dir);
    } catch (error) {
      // Storage may be unavailable in restricted browser contexts.
    }
  }

  /* Synchronize direction buttons */

  function syncDirectionButtons(dir) {
    const isRtl = dir === "rtl";

    const label = isRtl
      ? "Switch layout to Left-to-Right (LTR)"
      : "Switch layout to Right-to-Left (RTL)";

    document.querySelectorAll(BUTTON_SELECTOR).forEach(function (button) {
      button.textContent = DIR_SYMBOL;
      button.setAttribute("aria-pressed", String(isRtl));
      button.setAttribute("aria-label", label);
      button.setAttribute("title", label);
    });
  }

  /* Apply direction */

  function applyDirection(dir) {
    const normalized = dir === "rtl" ? "rtl" : "ltr";

    document.documentElement.setAttribute("dir", normalized);

    writeSavedDirection(normalized);
    syncDirectionButtons(normalized);

    return normalized;
  }

  /* Toggle direction */

  function toggleDirection() {
    const current =
      document.documentElement.getAttribute("dir") ||
      readSavedDirection();

    return applyDirection(current === "rtl" ? "ltr" : "rtl");
  }

  /* Bind buttons using event delegation */

  function bindDirectionToggles() {
    if (
      document.documentElement.getAttribute("data-dir-events-bound") === "true"
    ) {
      syncDirectionButtons(readSavedDirection());
      return;
    }

    document.documentElement.setAttribute("data-dir-events-bound", "true");

    document.addEventListener("click", function (event) {
      const button = event.target.closest(BUTTON_SELECTOR);

      if (!button) {
        return;
      }

      event.preventDefault();
      toggleDirection();
    });

    syncDirectionButtons(readSavedDirection());
  }

  /* Initialize direction manager */

  function initializeDirectionManager() {
    applyDirection(readSavedDirection());
    bindDirectionToggles();
  }

  /* Apply saved direction immediately */

  applyDirection(readSavedDirection());

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeDirectionManager,
      { once: true }
    );
  } else {
    initializeDirectionManager();
  }

  /* Synchronize direction across browser tabs */

  window.addEventListener("storage", function (event) {
    if (event.key === DIR_STORAGE_KEY) {
      applyDirection(event.newValue === "rtl" ? "rtl" : "ltr");
    }
  });

  /* Public API: preserve compatibility */

  window.SankalpamDir = {
    getDir: readSavedDirection,
    setDir: applyDirection,
    toggleDir: toggleDirection
  };

})(window, document);
