/* English-only language compatibility layer.
   Language switching and translation have been removed from Sacred Sankalpam.
   This small API remains so existing dashboard and authentication scripts keep working. */
(function (window, document) {
  "use strict";
  var englishMessages = {
    googleProtoMsg: "Google sign-in requires backend OAuth setup (not active in this frontend-only prototype).",
    errNameRequired: "Please enter your full name.",
    errEmailInvalid: "Please enter a valid email address.",
    errPasswordRequired: "Please enter your password.",
    errPasswordShort: "Password must be at least 6 characters.",
    errPasswordMismatch: "Passwords do not match.",
    loginSuccessMsg: "Prototype session saved. Redirecting to dashboard...",
    signupSuccessMsg: "Prototype account details saved locally. You can now go to Login.",
    resetSuccessMsg: "If this email is registered in the prototype, reset instructions are noted locally."
  };
  window.SankalpamLang = {
    getLang: function () { return "en"; },
    setLang: function () { document.documentElement.setAttribute("lang", "en"); return "en"; },
    t: function (key) { return englishMessages[key] || key; },
    onChange: function () { /* No language changes are available in English-only mode. */ }
  };
  try { window.localStorage.removeItem("sankalpam_lang"); } catch (e) {}
  document.documentElement.setAttribute("lang", "en");
})(window, document);
