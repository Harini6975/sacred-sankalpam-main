/* ==========================================================================
   Frontend Prototype Session Helpers (js/auth.js)
   NOTE: localStorage is used strictly for frontend prototype convenience.
   Real authentication, password hashing, and role-based access control require
   a backend/auth service and must not rely on browser storage alone.
   ========================================================================== */

(function (window) {
  "use strict";

  const SESSION_KEY = "sankalpam_proto_session";
  const ALLOWED_SIGNUP_ROLES = ["devotee", "priest"];

  function readFromStorage(storage) {
    try {
      const raw = storage.getItem(SESSION_KEY);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") {
        return null;
      }
      return parsed;
    } catch (err) {
      return null;
    }
  }

  function getSession() {
    const localSession = readFromStorage(window.localStorage);
    if (localSession) {
      return localSession;
    }
    try {
      return readFromStorage(window.sessionStorage);
    } catch (err) {
      return null;
    }
  }

  function setSession(data) {
    if (!data || typeof data !== "object") {
      return null;
    }
    const role = ALLOWED_SIGNUP_ROLES.indexOf(data.role) !== -1 ? data.role : "devotee";
    const email = String(data.email || "").trim();
    const name = String(data.name || "").trim();
    const remember = Boolean(data.remember);

    const sessionObj = {
      name: name,
      email: email,
      role: role,
      remember: remember,
      updatedAt: new Date().toISOString()
    };

    try {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(sessionObj));
    } catch (err) {
      try {
        window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionObj));
      } catch (sessionErr) {
        // Ignore storage errors in restricted browser contexts
      }
    }

    return sessionObj;
  }

  function clearSession() {
    try {
      window.localStorage.removeItem(SESSION_KEY);
    } catch (err) {
      // Ignore storage errors
    }
    try {
      window.sessionStorage.removeItem(SESSION_KEY);
    } catch (err) {
      // Ignore storage errors
    }
  }

  function isValidEmail(email) {
    const trimmed = String(email || "").trim();
    const atIndex = trimmed.indexOf("@");
    if (trimmed.length < 5 || atIndex <= 0 || trimmed.indexOf("@", atIndex + 1) !== -1) {
      return false;
    }
    const domainPart = trimmed.slice(atIndex + 1);
    const dotIndex = domainPart.indexOf(".");
    return dotIndex > 0 && dotIndex < domainPart.length - 1;
  }

  window.SankalpamAuth = {
    ALLOWED_SIGNUP_ROLES: ALLOWED_SIGNUP_ROLES.slice(),
    getSession: getSession,
    setSession: setSession,
    clearSession: clearSession,
    isValidEmail: isValidEmail
  };
})(window);