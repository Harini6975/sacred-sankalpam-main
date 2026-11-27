```javascript
/* ==========================================================================
   Admin Dashboard Logic (js/admin.js)

   Sacred Sankalpam Admin Dashboard
   - Vanilla JavaScript
   - Browser localStorage prototype data
   - English-only interface
   - Preserves existing dashboard HTML selectors and functionality

   IMPORTANT:
   This is a FRONT-END PROTOTYPE.
   Records are stored only in the current browser's localStorage.
   No real database, authentication, payment gateway, or backend is connected.
   ========================================================================== */

(function (window, document) {
  "use strict";

  /* ------------------------------------------------------------------------
     STORAGE KEYS
     ------------------------------------------------------------------------ */

  const BOOKINGS_KEY = "sankalpam_proto_bookings_v1";
  const DEVOTEES_KEY = "sankalpam_proto_admin_devotees_v1";
  const PRIESTS_KEY = "sankalpam_proto_admin_priests_v1";
  const CATEGORIES_KEY = "sankalpam_proto_admin_categories_v1";
  const SERVICES_KEY = "sankalpam_proto_admin_services_v1";
  const SAMAGRI_KEY = "sankalpam_proto_admin_samagri_v1";
  const REVIEWS_KEY = "sankalpam_proto_admin_reviews_v1";
  const NOTIFS_KEY = "sankalpam_proto_admin_notifs_v1";
  const SETTINGS_KEY = "sankalpam_proto_admin_settings_v1";

  /* ------------------------------------------------------------------------
     INITIAL SAMPLE DATA

     All records below are illustrative prototype records.
     They are not real devotees, priests, bookings, or reviews.
     ------------------------------------------------------------------------ */

  const INITIAL_BOOKINGS = [
    {
      id: "BK-1001",
      poojaId: "ganapathi-homam",
      poojaName: "Ganapathi Homam (Sample)",
      priestId: "raghavan",
      priestName: "Acharya Raghavan S. (Sample)",
      date: "2026-12-05",
      time: "07:00 AM",
      location: "Madurai (Sample)",
      bookingStatus: "Confirmed",
      paymentStatus: "Paid",
      amount: 2500
    },
    {
      id: "BK-1002",
      poojaId: "satyanarayana-pooja",
      poojaName: "Satyanarayana Pooja (Sample)",
      priestId: "karthik",
      priestName: "Pandit Karthik M. (Sample)",
      date: "2026-12-12",
      time: "09:30 AM",
      location: "Chennai (Sample)",
      bookingStatus: "Pending",
      paymentStatus: "Pending",
      amount: 2200
    },
    {
      id: "BK-1003",
      poojaId: "lakshmi-pooja",
      poojaName: "Lakshmi Pooja (Sample)",
      priestId: "raghavan",
      priestName: "Acharya Raghavan S. (Sample)",
      date: "2026-10-18",
      time: "06:00 PM",
      location: "Madurai (Sample)",
      bookingStatus: "Completed",
      paymentStatus: "Paid",
      amount: 1800
    }
  ];

  const INITIAL_DEVOTEES = [
    {
      id: "DEV-1",
      name: "Meenakshi R. (Sample)",
      email: "meenakshi.sample@example.org",
      city: "Madurai",
      status: "Active"
    },
    {
      id: "DEV-2",
      name: "Senthil K. (Sample)",
      email: "senthil.sample@example.org",
      city: "Chennai",
      status: "Active"
    }
  ];

  const INITIAL_PRIESTS = [
    {
      id: "PR-1",
      name: "Acharya Raghavan S. (Sample)",
      city: "Madurai",
      experience: "14 yrs",
      approval: "Approved",
      accountStatus: "Active"
    },
    {
      id: "PR-2",
      name: "Pandit Karthik M. (Sample)",
      city: "Chennai",
      experience: "11 yrs",
      approval: "Approved",
      accountStatus: "Active"
    },
    {
      id: "PR-3",
      name: "Sastri Subramanian K. (Sample)",
      city: "Trichy",
      experience: "9 yrs",
      approval: "Pending",
      accountStatus: "Active"
    }
  ];

  const INITIAL_CATEGORIES = [
    { id: "CAT-1", name_en: "Griha Pooja" },
    { id: "CAT-2", name_en: "Homam / Havan" },
    { id: "CAT-3", name_en: "Festival Pooja" },
    { id: "CAT-4", name_en: "Marriage Ceremonies" },
    { id: "CAT-5", name_en: "Health and Wellness Rituals" },
    { id: "CAT-6", name_en: "Special Religious Ceremonies" }
  ];

  const INITIAL_SERVICES = [
    {
      id: "SRV-101",
      name: "Ganapathi Homam (Sample)",
      category: "Homam / Havan",
      image: "images/pooja/ganapathi-homam.png",
      duration: "1.5 – 2 hrs",
      price: 2500,
      samagri: "Modak, coconut, ghee, samidha",
      description: "Traditional fire ceremony (Sample)."
    },
    {
      id: "SRV-102",
      name: "Gruhapravesam (Sample)",
      category: "Griha Pooja",
      image: "images/pooja/gruhapravesam.png",
      duration: "2 – 3 hrs",
      price: 3500,
      samagri: "Milk, brass vessel, mango leaves",
      description: "Housewarming ritual (Sample)."
    }
  ];

  const INITIAL_SAMAGRI = [
    {
      id: "SM-1",
      material: "Ghee & Samidha Sticks (Sample)",
      pooja: "Ganapathi Homam (Sample)",
      quantity: "1 set"
    },
    {
      id: "SM-2",
      material: "Raw Milk & Mango Leaves (Sample)",
      pooja: "Gruhapravesam (Sample)",
      quantity: "1 set"
    }
  ];

  const INITIAL_REVIEWS = [
    {
      id: "REV-1",
      author: "Meenakshi R. (Sample)",
      target: "Acharya Raghavan S. (Sample)",
      comment: "Clear Samagri list and punctual ceremony guidance (Sample)."
    },
    {
      id: "REV-2",
      author: "Senthil K. (Sample)",
      target: "Pandit Karthik M. (Sample)",
      comment: "Smooth scheduling for our family prayer (Sample)."
    }
  ];

  const INITIAL_NOTIFS = [
    {
      id: "AD-N1",
      message: "Welcome to the Sacred Sankalpam Admin prototype workspace."
    }
  ];

  const INITIAL_SETTINGS = {
    platformName: "Sacred Sankalpam",
    supportedLanguages: "English (en)",
    announcement: "Sample prototype mode active."
  };

  /* ------------------------------------------------------------------------
     LABELS
     ------------------------------------------------------------------------ */

  const LABELS = {
    brandName: "Sacred Sankalpam",
    brandTagline: "Pooja & Priest Booking",
    roleBadge: "Admin Portal",
    welcomeTitle: "Admin Dashboard",
    welcomeSub: "Manage devotees, priests, categories, services, Samagri, bookings, payments, reviews, reports, and settings (Sample data).",

    navOverview: "Overview",
    navDevotees: "Manage Devotees",
    navPriests: "Manage Priests",
    navCategories: "Pooja Categories",
    navServices: "Pooja Services",
    navSamagri: "Samagri Management",
    navBookings: "Bookings",
    navPayments: "Payments",
    navReviews: "Reviews",
    navNotifications: "Notifications",
    navReports: "Reports",
    navSettings: "Settings",

    btnLogout: "Logout",
    kpiDevotees: "Total Devotees",
    kpiPriests: "Total Priests",
    kpiBookings: "Total Bookings",
    kpiPending: "Pending Bookings",
    kpiCompleted: "Completed Bookings",
    kpiPayments: "Payment Summary (Paid)",

    btnApprove: "Approve",
    btnReject: "Reject",
    btnToggleStatus: "Toggle Active",
    btnDelete: "Delete",
    btnRefund: "Mark Refunded",
    btnAdd: "Add",
    btnSave: "Save",

    msgUpdated: "Admin record updated in browser storage."
  };

  /* ------------------------------------------------------------------------
     DOM HELPERS
     ------------------------------------------------------------------------ */

  function getElement(id) {
    return document.getElementById(id);
  }

  function addEvent(id, eventName, callback) {
    const element = getElement(id);

    if (element) {
      element.addEventListener(eventName, callback);
    }

    return element;
  }

  function getInputValue(id) {
    const element = getElement(id);
    return element ? element.value.trim() : "";
  }

  function setInputValue(id, value) {
    const element = getElement(id);

    if (element) {
      element.value = value == null ? "" : value;
    }
  }

  function resetForm(form) {
    if (form && typeof form.reset === "function") {
      form.reset();
    }
  }

  function t(key) {
    return Object.prototype.hasOwnProperty.call(LABELS, key)
      ? LABELS[key]
      : key;
  }

  /* ------------------------------------------------------------------------
     HTML ESCAPING

     Prevents stored or entered text from being interpreted as HTML.
     ------------------------------------------------------------------------ */

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /* ------------------------------------------------------------------------
     LOCAL STORAGE HELPERS
     ------------------------------------------------------------------------ */

  function loadStorage(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);

      if (!raw) {
        return fallback.slice ? fallback.slice() : fallback;
      }

      const parsed = JSON.parse(raw);

      if (Array.isArray(fallback)) {
        return Array.isArray(parsed) ? parsed : fallback.slice();
      }

      if (
        fallback &&
        typeof fallback === "object" &&
        !Array.isArray(fallback)
      ) {
        return parsed && typeof parsed === "object" &&
          !Array.isArray(parsed)
          ? parsed
          : Object.assign({}, fallback);
      }

      return parsed;
    } catch (err) {
      return fallback.slice ? fallback.slice() : fallback;
    }
  }

  function saveStorage(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      return false;
    }
  }

  /* ------------------------------------------------------------------------
     APPLICATION DATA
     ------------------------------------------------------------------------ */

  let bookings = loadStorage(BOOKINGS_KEY, INITIAL_BOOKINGS);
  let devotees = loadStorage(DEVOTEES_KEY, INITIAL_DEVOTEES);
  let priests = loadStorage(PRIESTS_KEY, INITIAL_PRIESTS);
  let categories = loadStorage(CATEGORIES_KEY, INITIAL_CATEGORIES);
  let services = loadStorage(SERVICES_KEY, INITIAL_SERVICES);
  let samagri = loadStorage(SAMAGRI_KEY, INITIAL_SAMAGRI);
  let reviews = loadStorage(REVIEWS_KEY, INITIAL_REVIEWS);
  let notifs = loadStorage(NOTIFS_KEY, INITIAL_NOTIFS);
  let settings = loadStorage(SETTINGS_KEY, INITIAL_SETTINGS);

  /* ------------------------------------------------------------------------
     UNIQUE ID GENERATOR

     Avoids duplicate IDs when records are deleted and new records are added.
     ------------------------------------------------------------------------ */

  function createId(prefix, records) {
    let highestNumber = 0;

    records.forEach(function (record) {
      const match = String(record.id || "").match(/(\d+)$/);

      if (match) {
        highestNumber = Math.max(
          highestNumber,
          Number(match[1])
        );
      }
    });

    return prefix + (highestNumber + 1);
  }

  /* ------------------------------------------------------------------------
     FEEDBACK
     ------------------------------------------------------------------------ */

  function showFeedback(message, type) {
    const box = getElement("adminFeedback");

    if (!box) return;

    box.className = "dash-feedback " +
      (type === "error" ? "badge-danger" : "badge-success");

    box.style.display = "block";
    box.textContent = message || t("msgUpdated");
  }

  function showError(message) {
    showFeedback(message, "error");
  }

  /* ------------------------------------------------------------------------
     STATUS BADGES
     ------------------------------------------------------------------------ */

  function statusBadge(status) {
    if (
      status === "Approved" ||
      status === "Active" ||
      status === "Confirmed" ||
      status === "Completed" ||
      status === "Paid"
    ) {
      return "badge-success";
    }

    if (status === "Pending" || status === "Accepted" ||
        status === "Rescheduled") {
      return "badge-warning";
    }

    if (
      status === "Rejected" ||
      status === "Inactive" ||
      status === "Cancelled" ||
      status === "Refunded" ||
      status === "Failed"
    ) {
      return "badge-danger";
    }

    return "badge-info";
  }

  /* ------------------------------------------------------------------------
     OVERVIEW
     ------------------------------------------------------------------------ */

  function renderOverview() {
    const totalDevotees = getElement("aKpiDevotees");
    const totalPriests = getElement("aKpiPriests");
    const totalBookings = getElement("aKpiBookings");
    const pendingBookings = getElement("aKpiPending");
    const completedBookings = getElement("aKpiCompleted");
    const paymentSummary = getElement("aKpiPayments");

    if (totalDevotees) {
      totalDevotees.textContent = String(devotees.length);
    }

    if (totalPriests) {
      totalPriests.textContent = String(priests.length);
    }

    if (totalBookings) {
      totalBookings.textContent = String(bookings.length);
    }

    if (pendingBookings) {
      pendingBookings.textContent = String(
        bookings.filter(function (booking) {
          return booking.bookingStatus === "Pending";
        }).length
      );
    }

    if (completedBookings) {
      completedBookings.textContent = String(
        bookings.filter(function (booking) {
          return booking.bookingStatus === "Completed";
        }).length
      );
    }

    const paidSum = bookings
      .filter(function (booking) {
        return booking.paymentStatus === "Paid";
      })
      .reduce(function (sum, booking) {
        return sum + (Number(booking.amount) || 0);
      }, 0);

    if (paymentSummary) {
      paymentSummary.textContent =
        "₹" + paidSum.toLocaleString("en-IN");
    }
  }

  /* ------------------------------------------------------------------------
     DEVOTEES
     ------------------------------------------------------------------------ */

  function renderDevotees() {
    const body = getElement("adminDevoteesBody");

    if (!body) return;

    body.innerHTML = "";

    if (!devotees.length) {
      body.innerHTML =
        "<tr><td colspan='6'>No devotee records available.</td></tr>";
      return;
    }

    devotees.forEach(function (devotee, index) {
      const row = document.createElement("tr");

      row.innerHTML =
        "<td>" + escapeHtml(devotee.id) + "</td>" +
        "<td><strong>" + escapeHtml(devotee.name) + "</strong></td>" +
        "<td>" + escapeHtml(devotee.email) + "</td>" +
        "<td>" + escapeHtml(devotee.city) + "</td>" +
        "<td><span class='badge " +
          statusBadge(devotee.status) + "'>" +
          escapeHtml(devotee.status) + "</span></td>" +
        "<td><button type='button' class='btn btn-secondary btn-sm' " +
          "data-dev-toggle='" + index + "'>" +
          escapeHtml(t("btnToggleStatus")) +
          "</button></td>";

      body.appendChild(row);
    });

    body.querySelectorAll("[data-dev-toggle]").forEach(function (button) {
      button.addEventListener("click", function () {
        const index = Number(button.getAttribute("data-dev-toggle"));
        const devotee = devotees[index];

        if (!devotee) return;

        devotee.status =
          devotee.status === "Active" ? "Inactive" : "Active";

        saveStorage(DEVOTEES_KEY, devotees);
        renderDevotees();
        showFeedback();
      });
    });
  }

  /* ------------------------------------------------------------------------
     PRIESTS
     ------------------------------------------------------------------------ */

  function renderPriests() {
    const body = getElement("adminPriestsBody");

    if (!body) return;

    body.innerHTML = "";

    if (!priests.length) {
      body.innerHTML =
        "<tr><td colspan='6'>No priest records available.</td></tr>";
      return;
    }

    priests.forEach(function (priest, index) {
      const row = document.createElement("tr");

      row.innerHTML =
        "<td>" + escapeHtml(priest.id) + "</td>" +
        "<td><strong>" + escapeHtml(priest.name) + "</strong></td>" +
        "<td>" + escapeHtml(priest.city) + " (" +
          escapeHtml(priest.experience) + ")</td>" +
        "<td><span class='badge " +
          statusBadge(priest.approval) + "'>" +
          escapeHtml(priest.approval) + "</span></td>" +
        "<td><span class='badge " +
          statusBadge(priest.accountStatus) + "'>" +
          escapeHtml(priest.accountStatus) + "</span></td>" +
        "<td style='display:flex;gap:6px;flex-wrap:wrap;'>" +
          "<button type='button' class='btn btn-primary btn-sm' " +
            "data-p-app='" + index + "'>" +
            escapeHtml(t("btnApprove")) + "</button>" +
          "<button type='button' class='btn btn-secondary btn-sm' " +
            "data-p-rej='" + index + "'>" +
            escapeHtml(t("btnReject")) + "</button>" +
          "<button type='button' class='btn btn-secondary btn-sm' " +
            "data-p-act='" + index + "'>" +
            escapeHtml(t("btnToggleStatus")) + "</button>" +
        "</td>";

      body.appendChild(row);
    });

    body.querySelectorAll("[data-p-app]").forEach(function (button) {
      button.addEventListener("click", function () {
        const priest = priests[
          Number(button.getAttribute("data-p-app"))
        ];

        if (!priest) return;

        priest.approval = "Approved";

        saveStorage(PRIESTS_KEY, priests);
        renderPriests();
        showFeedback("Priest approval updated in browser storage.");
      });
    });

    body.querySelectorAll("[data-p-rej]").forEach(function (button) {
      button.addEventListener("click", function () {
        const priest = priests[
          Number(button.getAttribute("data-p-rej"))
        ];

        if (!priest) return;

        priest.approval = "Rejected";

        saveStorage(PRIESTS_KEY, priests);
        renderPriests();
        showFeedback("Priest approval updated in browser storage.");
      });
    });

    body.querySelectorAll("[data-p-act]").forEach(function (button) {
      button.addEventListener("click", function () {
        const priest = priests[
          Number(button.getAttribute("data-p-act"))
        ];

        if (!priest) return;

        priest.accountStatus =
          priest.accountStatus === "Active" ? "Inactive" : "Active";

        saveStorage(PRIESTS_KEY, priests);
        renderPriests();
        showFeedback();
      });
    });
  }

  /* ------------------------------------------------------------------------
     POOJA CATEGORIES
     ------------------------------------------------------------------------ */

  function renderCategories() {
    const body = getElement("adminCategoriesBody");

    if (!body) return;

    body.innerHTML = "";

    if (!categories.length) {
      body.innerHTML =
        "<tr><td colspan='3'>No categories available.</td></tr>";
      return;
    }

    categories.forEach(function (category, index) {
      const row = document.createElement("tr");

      row.innerHTML =
        "<td>" + escapeHtml(category.id) + "</td>" +
        "<td><strong>" +
          escapeHtml(category.name_en) +
          "</strong></td>" +
        "<td style='display:flex;gap:6px;flex-wrap:wrap;'>" +
          "<button type='button' class='btn btn-secondary btn-sm' " +
            "data-cat-edit='" + index + "'>" +
            escapeHtml(t("btnSave")) + " (Rename)</button>" +
          "<button type='button' class='btn btn-primary btn-sm' " +
            "data-cat-del='" + index + "'>" +
            escapeHtml(t("btnDelete")) + "</button>" +
        "</td>";

      body.appendChild(row);
    });

    body.querySelectorAll("[data-cat-edit]").forEach(function (button) {
      button.addEventListener("click", function () {
        const index = Number(button.getAttribute("data-cat-edit"));
        const category = categories[index];

        if (!category) return;

        const updated = window.prompt(
          "Updated category name:",
          category.name_en
        );

        if (updated && updated.trim()) {
          category.name_en = updated.trim();

          saveStorage(CATEGORIES_KEY, categories);
          renderCategories();
          showFeedback("Category renamed successfully.");
        }
      });
    });

    body.querySelectorAll("[data-cat-del]").forEach(function (button) {
      button.addEventListener("click", function () {
        const index = Number(button.getAttribute("data-cat-del"));

        if (!categories[index]) return;

        const confirmed = window.confirm(
          "Are you sure you want to delete this category?"
        );

        if (!confirmed) return;

        categories.splice(index, 1);

        saveStorage(CATEGORIES_KEY, categories);
        renderCategories();
        showFeedback("Category deleted.");
      });
    });
  }

  /* ------------------------------------------------------------------------
     POOJA SERVICES
     ------------------------------------------------------------------------ */

  function renderServices() {
    const body = getElement("adminServicesBody");

    if (!body) return;

    body.innerHTML = "";

    if (!services.length) {
      body.innerHTML =
        "<tr><td colspan='6'>No services available.</td></tr>";
      return;
    }

    services.forEach(function (service, index) {
      const row = document.createElement("tr");

      row.innerHTML =
        "<td><strong>" + escapeHtml(service.name) + "</strong></td>" +
        "<td>" + escapeHtml(service.category) + "</td>" +
        "<td>" + escapeHtml(service.duration) + "</td>" +
        "<td>₹" + escapeHtml(service.price) + "</td>" +
        "<td>" + escapeHtml(service.samagri) + "</td>" +
        "<td><button type='button' class='btn btn-primary btn-sm' " +
          "data-srv-del='" + index + "'>" +
          escapeHtml(t("btnDelete")) + "</button></td>";

      body.appendChild(row);
    });

    body.querySelectorAll("[data-srv-del]").forEach(function (button) {
      button.addEventListener("click", function () {
        const index = Number(button.getAttribute("data-srv-del"));

        if (!services[index]) return;

        const confirmed = window.confirm(
          "Are you sure you want to delete this service?"
        );

        if (!confirmed) return;

        services.splice(index, 1);

        saveStorage(SERVICES_KEY, services);
        renderServices();
        showFeedback("Pooja service deleted.");
      });
    });
  }

  /* ------------------------------------------------------------------------
     SAMAGRI
     ------------------------------------------------------------------------ */

  function renderSamagri() {
    const body = getElement("adminSamagriBody");

    if (!body) return;

    body.innerHTML = "";

    if (!samagri.length) {
      body.innerHTML =
        "<tr><td colspan='4'>No Samagri records available.</td></tr>";
      return;
    }

    samagri.forEach(function (item, index) {
      const row = document.createElement("tr");

      row.innerHTML =
        "<td><strong>" + escapeHtml(item.material) + "</strong></td>" +
        "<td>" + escapeHtml(item.pooja) + "</td>" +
        "<td>" + escapeHtml(item.quantity) + "</td>" +
        "<td><button type='button' class='btn btn-primary btn-sm' " +
          "data-sm-del='" + index + "'>" +
          escapeHtml(t("btnDelete")) + "</button></td>";

      body.appendChild(row);
    });

    body.querySelectorAll("[data-sm-del]").forEach(function (button) {
      button.addEventListener("click", function () {
        const index = Number(button.getAttribute("data-sm-del"));

        if (!samagri[index]) return;

        const confirmed = window.confirm(
          "Are you sure you want to delete this Samagri item?"
        );

        if (!confirmed) return;

        samagri.splice(index, 1);

        saveStorage(SAMAGRI_KEY, samagri);
        renderSamagri();
        showFeedback("Samagri item deleted.");
      });
    });
  }

  /* ------------------------------------------------------------------------
     BOOKINGS AND PAYMENTS
     ------------------------------------------------------------------------ */

  function renderBookingsAndPayments() {
    const bookingBody = getElement("adminBookingsBody");

    if (bookingBody) {
      bookingBody.innerHTML = "";

      if (!bookings.length) {
        bookingBody.innerHTML =
          "<tr><td colspan='6'>No booking records available.</td></tr>";
      }

      const statuses = [
        "Pending",
        "Accepted",
        "Confirmed",
        "Completed",
        "Rejected",
        "Cancelled",
        "Rescheduled"
      ];

      bookings.forEach(function (booking, index) {
        const options = statuses.map(function (status) {
          return (
            "<option value='" + escapeHtml(status) + "'" +
            (booking.bookingStatus === status ? " selected" : "") +
            ">" + escapeHtml(status) + "</option>"
          );
        }).join("");

        const row = document.createElement("tr");

        row.innerHTML =
          "<td><strong>" + escapeHtml(booking.id) + "</strong></td>" +
          "<td>" + escapeHtml(
            booking.poojaName || booking.poojaId
          ) + "</td>" +
          "<td>" + escapeHtml(
            booking.priestName || booking.priestId
          ) + "</td>" +
          "<td>" + escapeHtml(booking.date) + " · " +
            escapeHtml(booking.time) + "</td>" +
          "<td><span class='badge " +
            statusBadge(booking.bookingStatus) + "'>" +
            escapeHtml(booking.bookingStatus) + "</span></td>" +
          "<td><select class='form-control' " +
            "style='min-height:34px;padding:4px 8px;' " +
            "data-b-status='" + index + "'>" +
            options +
          "</select></td>";

        bookingBody.appendChild(row);
      });

      bookingBody.querySelectorAll("[data-b-status]").forEach(
        function (select) {
          select.addEventListener("change", function () {
            const booking = bookings[
              Number(select.getAttribute("data-b-status"))
            ];

            if (!booking) return;

            booking.bookingStatus = select.value;

            saveStorage(BOOKINGS_KEY, bookings);
            renderOverview();
            renderBookingsAndPayments();

            showFeedback("Booking status updated.");
          });
        }
      );
    }

    const paymentBody = getElement("adminPaymentsBody");

    if (paymentBody) {
      paymentBody.innerHTML = "";

      if (!bookings.length) {
        paymentBody.innerHTML =
          "<tr><td colspan='5'>No payment records available.</td></tr>";
      }

      bookings.forEach(function (booking, index) {
        const row = document.createElement("tr");

        row.innerHTML =
          "<td><strong>" + escapeHtml(booking.id) + "</strong></td>" +
          "<td>₹" + escapeHtml(Number(booking.amount) || 0) + "</td>" +
          "<td>" + escapeHtml(booking.date) + "</td>" +
          "<td><span class='badge " +
            statusBadge(booking.paymentStatus) + "'>" +
            escapeHtml(booking.paymentStatus) + "</span></td>" +
          "<td>" +
            (booking.paymentStatus === "Paid"
              ? "<button type='button' class='btn btn-secondary btn-sm' " +
                "data-refund='" + index + "'>" +
                escapeHtml(t("btnRefund")) + "</button>"
              : "<span>—</span>") +
          "</td>";

        paymentBody.appendChild(row);
      });

      paymentBody.querySelectorAll("[data-refund]").forEach(
        function (button) {
          button.addEventListener("click", function () {
            const booking = bookings[
              Number(button.getAttribute("data-refund"))
            ];

            if (!booking) return;

            const confirmed = window.confirm(
              "Mark this prototype payment as refunded?"
            );

            if (!confirmed) return;

            booking.paymentStatus = "Refunded";

            saveStorage(BOOKINGS_KEY, bookings);
            renderOverview();
            renderBookingsAndPayments();

            showFeedback(
              "Payment status marked as Refunded in browser storage."
            );
          });
        }
      );
    }
  }

  /* ------------------------------------------------------------------------
     REVIEWS, NOTIFICATIONS, REPORTS AND SETTINGS
     ------------------------------------------------------------------------ */

  function renderReviewsNotifsReportsSettings() {
    const reviewList = getElement("adminReviewsList");

    if (reviewList) {
      reviewList.innerHTML = "";

      if (!reviews.length) {
        reviewList.textContent = "No reviews available.";
      }

      reviews.forEach(function (review, index) {
        const card = document.createElement("article");

        card.className = "card";

        card.innerHTML =
          "<p style='margin-bottom:6px;'><strong>" +
            escapeHtml(review.author) +
            "</strong> → " +
            escapeHtml(review.target) +
          "</p>" +
          "<p style='color:var(--text-secondary);margin-bottom:12px;'>" +
            escapeHtml(review.comment) +
          "</p>" +
          "<button type='button' class='btn btn-secondary btn-sm' " +
            "style='align-self:flex-start;' " +
            "data-rev-del='" + index + "'>" +
            escapeHtml(t("btnDelete")) +
          "</button>";

        reviewList.appendChild(card);
      });

      reviewList.querySelectorAll("[data-rev-del]").forEach(
        function (button) {
          button.addEventListener("click", function () {
            const index = Number(button.getAttribute("data-rev-del"));

            if (!reviews[index]) return;

            const confirmed = window.confirm(
              "Are you sure you want to delete this review?"
            );

            if (!confirmed) return;

            reviews.splice(index, 1);

            saveStorage(REVIEWS_KEY, reviews);
            renderReviewsNotifsReportsSettings();

            showFeedback("Review deleted.");
          });
        }
      );
    }

    const notificationList = getElement("adminNotifsList");

    if (notificationList) {
      notificationList.innerHTML = "";

      if (!notifs.length) {
        notificationList.textContent = "No notifications available.";
      }

      notifs.forEach(function (notification) {
        const card = document.createElement("article");

        card.className = "card";

        const paragraph = document.createElement("p");
        paragraph.style.marginBottom = "0";
        paragraph.textContent = notification.message || "";

        card.appendChild(paragraph);
        notificationList.appendChild(card);
      });
    }

    const reportOutput = getElement("adminReportOutput");

    if (
      reportOutput &&
      !reportOutput.textContent.trim()
    ) {
      reportOutput.textContent =
        "Select a report button above to generate a summary from current prototype records.";
    }

    setInputValue(
      "setPlatformName",
      settings.platformName || ""
    );

    setInputValue(
      "setLangs",
      settings.supportedLanguages || ""
    );

    setInputValue(
      "setNotice",
      settings.announcement || ""
    );
  }

  /* ------------------------------------------------------------------------
     LABELS AND RENDERING
     ------------------------------------------------------------------------ */

  function applyLabels() {
    document.documentElement.setAttribute("lang", "en");

    document.querySelectorAll("[data-dash-i18n]").forEach(
      function (element) {
        const key = element.getAttribute("data-dash-i18n");
        element.textContent = t(key);
      }
    );

    renderAll();
  }

  function renderAll() {
    renderOverview();
    renderDevotees();
    renderPriests();
    renderCategories();
    renderServices();
    renderSamagri();
    renderBookingsAndPayments();
    renderReviewsNotifsReportsSettings();
  }

  /* ------------------------------------------------------------------------
     DASHBOARD SECTION NAVIGATION
     ------------------------------------------------------------------------ */

  function switchSection(sectionId) {
    document.querySelectorAll(".dash-section").forEach(
      function (section) {
        section.classList.toggle(
          "is-active",
          section.getAttribute("data-section") === sectionId
        );
      }
    );

    document.querySelectorAll(
      ".dash-nav-btn[data-target]"
    ).forEach(function (button) {
      button.classList.toggle(
        "is-active",
        button.getAttribute("data-target") === sectionId
      );
    });

    const sidebar = getElement("dashSidebar");
    const backdrop = getElement("dashBackdrop");

    if (sidebar) {
      sidebar.classList.remove("is-open");
    }

    if (backdrop) {
      backdrop.classList.remove("is-open");
    }
  }

  /* ------------------------------------------------------------------------
     FORM HANDLERS
     ------------------------------------------------------------------------ */

  function bindCategoryForm() {
    const form = addEvent(
      "addCategoryForm",
      "submit",
      function (event) {
        event.preventDefault();

        const name = getInputValue("catNameEn");

        if (!name) {
          showError("Please enter a category name.");
          return;
        }

        categories.push({
          id: createId("CAT-", categories),
          name_en: name
        });

        saveStorage(CATEGORIES_KEY, categories);

        resetForm(form);
        renderCategories();

        showFeedback("Category added successfully.");
      }
    );
  }

  function bindServiceForm() {
    const form = addEvent(
      "addServiceForm",
      "submit",
      function (event) {
        event.preventDefault();

        const name = getInputValue("admSrvName");
        const category = getInputValue("admSrvCat");
        const image = getInputValue("admSrvImg") ||
          "images/pooja/ganapathi-homam.png";
        const duration = getInputValue("admSrvDur");
        const priceValue = getInputValue("admSrvPrice");
        const samagriRequired = getInputValue("admSrvSamagri");
        const description = getInputValue("admSrvDesc");

        const price = Number(priceValue) || 0;

        if (!name || !category || !duration) {
          showError(
            "Please enter the service name, category and duration."
          );
          return;
        }

        if (price < 0) {
          showError("Service price cannot be negative.");
          return;
        }

        services.push({
          id: createId("SRV-", services),
          name: name,
          category: category,
          image: image,
          duration: duration,
          price: price,
          samagri: samagriRequired,
          description: description
        });

        saveStorage(SERVICES_KEY, services);

        resetForm(form);
        renderServices();

        showFeedback("Pooja service added successfully.");
      }
    );
  }

  function bindSamagriForm() {
    const form = addEvent(
      "addSamagriForm",
      "submit",
      function (event) {
        event.preventDefault();

        const material = getInputValue("smMaterial");
        const pooja = getInputValue("smPooja");
        const quantity = getInputValue("smQty") || "1 set";

        if (!material || !pooja) {
          showError("Please enter the material and pooja name.");
          return;
        }

        samagri.push({
          id: createId("SM-", samagri),
          material: material,
          pooja: pooja,
          quantity: quantity
        });

        saveStorage(SAMAGRI_KEY, samagri);

        resetForm(form);
        renderSamagri();

        showFeedback("Samagri item added successfully.");
      }
    );
  }

  function bindNotificationForm() {
    const form = addEvent(
      "sendNotifForm",
      "submit",
      function (event) {
        event.preventDefault();

        const message = getInputValue("admNotifText");

        if (!message) {
          showError("Please enter a notification message.");
          return;
        }

        notifs.unshift({
          id: "AD-N" + Date.now(),
          message: message
        });

        saveStorage(NOTIFS_KEY, notifs);

        resetForm(form);
        renderReviewsNotifsReportsSettings();

        showFeedback(
          "Notification added to the admin prototype list."
        );
      }
    );
  }

  function bindSettingsForm() {
    addEvent(
      "adminSettingsForm",
      "submit",
      function (event) {
        event.preventDefault();

        settings = {
          platformName:
            getInputValue("setPlatformName") ||
            INITIAL_SETTINGS.platformName,

          supportedLanguages:
            getInputValue("setLangs") ||
            INITIAL_SETTINGS.supportedLanguages,

          announcement: getInputValue("setNotice")
        };

        saveStorage(SETTINGS_KEY, settings);

        showFeedback(
          "Settings saved in this browser's prototype storage."
        );
      }
    );
  }

  /* ------------------------------------------------------------------------
     REPORT GENERATION

     Reports are summaries of local prototype records only.
     ------------------------------------------------------------------------ */

  function setReportOutput(message) {
    const output = getElement("adminReportOutput");

    if (output) {
      output.textContent = message;
    }
  }

  function bindReportButtons() {
    addEvent(
      "genBookingReportBtn",
      "click",
      function () {
        const pending = bookings.filter(function (booking) {
          return booking.bookingStatus === "Pending";
        }).length;

        const confirmed = bookings.filter(function (booking) {
          return booking.bookingStatus === "Confirmed";
        }).length;

        const completed = bookings.filter(function (booking) {
          return booking.bookingStatus === "Completed";
        }).length;

        setReportOutput(
          "Booking Report (Sample Data): Total=" + bookings.length +
          ", Pending=" + pending +
          ", Confirmed=" + confirmed +
          ", Completed=" + completed
        );
      }
    );

    addEvent(
      "genPriestReportBtn",
      "click",
      function () {
        const approved = priests.filter(function (priest) {
          return priest.approval === "Approved";
        }).length;

        const pending = priests.filter(function (priest) {
          return priest.approval === "Pending";
        }).length;

        setReportOutput(
          "Priest Report (Sample Data): Total=" + priests.length +
          ", Approved=" + approved +
          ", Pending=" + pending
        );
      }
    );

    addEvent(
      "genPaymentReportBtn",
      "click",
      function () {
        const paid = bookings
          .filter(function (booking) {
            return booking.paymentStatus === "Paid";
          })
          .reduce(function (sum, booking) {
            return sum + (Number(booking.amount) || 0);
          }, 0);

        setReportOutput(
          "Payment Report (Sample Data): Paid Total=₹" +
          paid.toLocaleString("en-IN") +
          ", Records=" + bookings.length
        );
      }
    );
  }

  /* ------------------------------------------------------------------------
     MOBILE SIDEBAR
     ------------------------------------------------------------------------ */

  function bindMobileSidebar() {
    const mobileToggle = getElement("dashMobileToggle");
    const sidebar = getElement("dashSidebar");
    const backdrop = getElement("dashBackdrop");

    if (!mobileToggle || !sidebar || !backdrop) {
      return;
    }

    mobileToggle.addEventListener("click", function () {
      const isOpen = sidebar.classList.toggle("is-open");

      backdrop.classList.toggle("is-open", isOpen);

      mobileToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );
    });

    backdrop.addEventListener("click", function () {
      sidebar.classList.remove("is-open");
      backdrop.classList.remove("is-open");

      mobileToggle.setAttribute("aria-expanded", "false");
    });
  }

  /* ------------------------------------------------------------------------
     SIDEBAR NAVIGATION
     ------------------------------------------------------------------------ */

  function bindNavigation() {
    document.querySelectorAll(
      ".dash-nav-btn[data-target]"
    ).forEach(function (button) {
      button.addEventListener("click", function () {
        switchSection(button.getAttribute("data-target"));
      });
    });
  }

  /* ------------------------------------------------------------------------
     LOGOUT

     This only removes the prototype session marker.
     It is NOT secure server-side authentication.
     ------------------------------------------------------------------------ */

  function bindLogout() {
    addEvent("logoutBtn", "click", function () {
      try {
        window.localStorage.removeItem(
          "sankalpam_proto_session"
        );
      } catch (err) {
        // Continue to the login page if storage is unavailable.
      }

      window.location.href = "login.html";
    });
  }

  /* ------------------------------------------------------------------------
     INITIALIZATION
     ------------------------------------------------------------------------ */

  function initializeAdminDashboard() {
    bindNavigation();
    bindMobileSidebar();

    bindCategoryForm();
    bindServiceForm();
    bindSamagriForm();
    bindNotificationForm();
    bindSettingsForm();

    bindReportButtons();
    bindLogout();

    applyLabels();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeAdminDashboard,
      { once: true }
    );
  } else {
    initializeAdminDashboard();
  }

})(window, document);
```