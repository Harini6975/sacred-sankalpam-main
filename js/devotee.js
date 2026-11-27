/* ==========================================================================
   Devotee Dashboard Logic (js/devotee.js)
   Handles sidebar sections, real metric counts from stored bookings,
   booking creation with slot conflict checks, Samagri display, cancellations,
   printable confirmation, notifications, and profile updates (English-only).
   ========================================================================== */

(function (window, document) {
  "use strict";

  const BOOKINGS_KEY = "sankalpam_proto_bookings_v1";
  const PROFILE_KEY = "sankalpam_proto_devotee_profile_v1";
  const NOTIFS_KEY = "sankalpam_proto_devotee_notifs_v1";

  // Sample catalog & priests (clearly labeled as sample prototype data)
  const SAMPLE_POOJAS = {
    "ganapathi-homam": {
      id: "ganapathi-homam",
      name: "Ganapathi Homam (Sample)",
      amount: 2500,
      samagri: [
        "Ghee & samidha sticks",
        "Modak & coconut",
        "Arugampul & flowers",
        "Turmeric, kumkum, betel leaves"
      ]
    },
    "gruhapravesam": {
      id: "gruhapravesam",
      name: "Gruhapravesam (Sample)",
      amount: 3500,
      samagri: [
        "Raw milk & brass vessel",
        "Mango leaves & floral torans",
        "Brass lamp, oil & wicks",
        "Rice, jaggery, coconut"
      ]
    },
    "satyanarayana-pooja": {
      id: "satyanarayana-pooja",
      name: "Satyanarayana Pooja (Sample)",
      amount: 2200,
      samagri: [
        "Panchamritam items",
        "Banana & seasonal fruits",
        "Tulsi & flowers",
        "Kalasham set & camphor"
      ]
    },
    "lakshmi-pooja": {
      id: "lakshmi-pooja",
      name: "Lakshmi Pooja (Sample)",
      amount: 1800,
      samagri: [
        "Flowers & kumkum",
        "Oil lamps & ghee wicks",
        "Rice, coins & turmeric",
        "Prasad ingredients"
      ]
    },
    "marriage-pooja": {
      id: "marriage-pooja",
      name: "Marriage Pooja (Sample)",
      amount: 7500,
      samagri: [
        "Ceremonial garlands",
        "Homa items & ghee",
        "Coconuts, betel & bananas",
        "Traditional ritual items"
      ]
    },
    "ayush-homam": {
      id: "ayush-homam",
      name: "Ayush Homam (Sample)",
      amount: 2600,
      samagri: [
        "Durva grass & sesame",
        "Ghee & homa samidha",
        "Flowers & sacred thread",
        "Coconut & fruits"
      ]
    }
  };

  const SAMPLE_PRIESTS = {
    raghavan: {
      id: "raghavan",
      name: "Acharya Raghavan S. (Sample)",
      spec: "Homam / Havan & Griha Pooja",
      loc: "Madurai",
      blockedDates: ["2026-12-25"]
    },
    karthik: {
      id: "karthik",
      name: "Pandit Karthik M. (Sample)",
      spec: "Marriage & Festival Pooja",
      loc: "Chennai",
      blockedDates: ["2026-12-26"]
    },
    narayanan: {
      id: "narayanan",
      name: "Vathiyar Narayanan V. (Sample)",
      spec: "Health & Wellness Rituals",
      loc: "Coimbatore",
      blockedDates: ["2026-12-27"]
    }
  };

  const INITIAL_BOOKINGS = [
    {
      id: "BK-1001",
      poojaId: "ganapathi-homam",
      priestId: "raghavan",
      date: "2026-12-05",
      time: "07:00 AM",
      location: "Madurai (Sample)",
      notes: "Morning household homam (Sample)",
      bookingStatus: "Confirmed",
      paymentStatus: "Paid",
      amount: 2500
    },
    {
      id: "BK-1002",
      poojaId: "satyanarayana-pooja",
      priestId: "karthik",
      date: "2026-12-12",
      time: "09:30 AM",
      location: "Chennai (Sample)",
      notes: "Family prayer gathering (Sample)",
      bookingStatus: "Pending",
      paymentStatus: "Pending",
      amount: 2200
    },
    {
      id: "BK-1003",
      poojaId: "lakshmi-pooja",
      priestId: "raghavan",
      date: "2026-10-18",
      time: "06:00 PM",
      location: "Madurai (Sample)",
      notes: "Completed sample ceremony",
      bookingStatus: "Completed",
      paymentStatus: "Paid",
      amount: 1800
    }
  ];

  const INITIAL_PROFILE = {
    name: "Devotee User (Sample)",
    email: "devotee@example.org",
    phone: "+91 90000 00000",
    city: "Madurai"
  };

  const INITIAL_NOTIFS = [
    {
      id: "N-1",
      text: "Booking BK-1001 is Confirmed (Payment: Paid) [Sample]."
    },
    {
      id: "N-2",
      text: "Booking BK-1002 is awaiting Priest response (Payment: Pending) [Sample]."
    }
  ];

  const LABELS = {
    brandName: "Sacred Sankalpam",
    brandTagline: "Pooja & Priest Booking",
    roleBadge: "Devotee Portal",
    welcomePrefix: "Welcome,",
    welcomeSub: "Manage pooja bookings, Samagri lists, payment status, and notifications (Sample prototype data).",
    navOverview: "Overview",
    navBook: "Book a Pooja",
    navBookings: "My Bookings",
    navPriests: "My Priests",
    navSamagri: "Samagri",
    navPayments: "Payments",
    navNotifications: "Notifications",
    navProfile: "My Profile",
    btnLogout: "Logout",
    kpiTotal: "Total Bookings",
    kpiUpcoming: "Upcoming Bookings",
    kpiCompleted: "Completed Bookings",
    kpiPending: "Pending Bookings",
    recentActivityHeading: "Recent Booking Activity",
    bookFormHeading: "Book a Pooja (Steps 1 \u2013 6)",
    lblPooja: "1. Select Pooja",
    lblPriest: "2. Select Priest",
    lblDate: "3. Preferred Date",
    lblTime: "4. Preferred Time Slot",
    lblLocation: "4. Ceremony Location",
    lblNotes: "4. Additional Requirements",
    samagriPreviewTitle: "5. Required Samagri for Selected Pooja",
    btnSubmitBooking: "6. Submit Booking Request",
    thId: "Booking ID",
    thPooja: "Pooja",
    thPriest: "Priest",
    thDate: "Date",
    thTime: "Time",
    thLocation: "Location",
    thBookingStatus: "Booking Status",
    thPaymentStatus: "Payment Status",
    thActions: "Actions",
    thAmount: "Amount",
    btnCancel: "Cancel",
    btnPrint: "Print",
    btnBookAgain: "Book Again",
    btnViewProfile: "View Profile",
    samagriHeading: "Samagri Materials for Booked Poojas",
    paymentsHeading: "Payment History & Status",
    paymentNote: "Prototype note: Payment statuses are displayed for workflow demonstration only; no real payment gateway is connected.",
    notifsHeading: "Booking Notifications",
    profileHeading: "My Profile",
    lblProfileName: "Full Name",
    lblProfileEmail: "Email Address",
    lblProfilePhone: "Phone Number",
    lblProfileCity: "City / Service Area",
    btnSaveProfile: "Save Profile",
    errRequired: "Please fill out all required booking fields.",
    errBlockedDate: "Selected priest is unavailable on this date.",
    errOverlap: "Selected priest already has an active booking on this date and time.",
    bookingCreated: "Booking request submitted with status Pending and payment status Pending.",
    bookingCancelled: "Booking status updated to Cancelled.",
    profileSaved: "Profile details updated in browser storage."
  };

  function t(key) {
    return Object.prototype.hasOwnProperty.call(LABELS, key) ? LABELS[key] : key;
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&")
      .replace(/</g, "<")
      .replace(/>/g, ">")
      .replace(/"/g, """)
      .replace(/'/g, "'");
  }

  function loadStorage(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function saveStorage(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // Ignore storage errors in restricted browser contexts
    }
  }

  let bookings = loadStorage(BOOKINGS_KEY, INITIAL_BOOKINGS);
  let profile = loadStorage(PROFILE_KEY, INITIAL_PROFILE);
  let notifications = loadStorage(NOTIFS_KEY, INITIAL_NOTIFS);

  function statusBadgeClass(status) {
    if (status === "Confirmed" || status === "Completed" || status === "Paid") return "badge-success";
    if (status === "Accepted") return "badge-info";
    if (status === "Pending") return "badge-warning";
    if (status === "Rejected" || status === "Cancelled" || status === "Failed") return "badge-danger";
    return "badge-gold";
  }

  function showFeedback(message, badgeType) {
    const box = document.getElementById("devoteeFeedback");
    if (!box) return;
    box.className = "dash-feedback " + (badgeType || "badge-info");
    box.style.display = "block";
    box.textContent = message;
  }

  function populateSelectOptions() {
    const poojaSelect = document.getElementById("bookPoojaSelect");
    const priestSelect = document.getElementById("bookPriestSelect");

    if (poojaSelect) {
      const prevPooja = poojaSelect.value || "ganapathi-homam";
      poojaSelect.innerHTML = "";
      Object.keys(SAMPLE_POOJAS).forEach(function (key) {
        const item = SAMPLE_POOJAS[key];
        const opt = document.createElement("option");
        opt.value = item.id;
        opt.textContent = item.name + " (\u20B9" + item.amount + ")";
        poojaSelect.appendChild(opt);
      });
      poojaSelect.value = SAMPLE_POOJAS[prevPooja] ? prevPooja : "ganapathi-homam";
    }

    if (priestSelect) {
      const prevPriest = priestSelect.value || "raghavan";
      priestSelect.innerHTML = "";
      Object.keys(SAMPLE_PRIESTS).forEach(function (key) {
        const p = SAMPLE_PRIESTS[key];
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.textContent = p.name + " \u2014 " + p.loc;
        priestSelect.appendChild(opt);
      });
      priestSelect.value = SAMPLE_PRIESTS[prevPriest] ? prevPriest : "raghavan";
    }

    // Apply URL query parameters if navigated from pooja-details or priest-profile
    const params = new URLSearchParams(window.location.search);
    const qPooja = params.get("pooja");
    const qPriest = params.get("priest");
    if (qPooja && SAMPLE_POOJAS[qPooja] && poojaSelect) poojaSelect.value = qPooja;
    if (qPriest && SAMPLE_PRIESTS[qPriest] && priestSelect) priestSelect.value = qPriest;

    renderBookingSamagriPreview();
  }

  function renderBookingSamagriPreview() {
    const poojaId = (document.getElementById("bookPoojaSelect") || {}).value || "ganapathi-homam";
    const pooja = SAMPLE_POOJAS[poojaId] || SAMPLE_POOJAS["ganapathi-homam"];
    const ul = document.getElementById("bookingSamagriPreview");
    if (!ul) return;
    ul.innerHTML = "";
    pooja.samagri.forEach(function (txt) {
      const li = document.createElement("li");
      li.textContent = txt;
      ul.appendChild(li);
    });
  }

  function renderOverviewMetrics() {
    const total = bookings.length;
    const upcoming = bookings.filter(function (b) {
      return (
        b.bookingStatus === "Pending" ||
        b.bookingStatus === "Accepted" ||
        b.bookingStatus === "Confirmed" ||
        b.bookingStatus === "Rescheduled"
      );
    }).length;
    const completed = bookings.filter(function (b) {
      return b.bookingStatus === "Completed";
    }).length;
    const pending = bookings.filter(function (b) {
      return b.bookingStatus === "Pending";
    }).length;

    const totalEl = document.getElementById("kpiTotalVal");
    const upcomingEl = document.getElementById("kpiUpcomingVal");
    const completedEl = document.getElementById("kpiCompletedVal");
    const pendingEl = document.getElementById("kpiPendingVal");

    if (totalEl) totalEl.textContent = String(total);
    if (upcomingEl) upcomingEl.textContent = String(upcoming);
    if (completedEl) completedEl.textContent = String(completed);
    if (pendingEl) pendingEl.textContent = String(pending);

    const recentBody = document.getElementById("recentActivityBody");
    if (!recentBody) return;
    recentBody.innerHTML = "";

    bookings.slice().reverse().slice(0, 5).forEach(function (b) {
      const pooja = SAMPLE_POOJAS[b.poojaId];
      const priest = SAMPLE_PRIESTS[b.priestId];
      const tr = document.createElement("tr");
      tr.innerHTML =
        "<td><strong>" + escapeHtml(b.id) + "</strong></td>" +
        "<td>" + escapeHtml(pooja ? pooja.name : b.poojaId) + "</td>" +
        "<td>" + escapeHtml(priest ? priest.name : b.priestId) + "</td>" +
        "<td>" + escapeHtml(b.date) + " \u00B7 " + escapeHtml(b.time) + "</td>" +
        "<td><span class='badge " + statusBadgeClass(b.bookingStatus) + "'>" + escapeHtml(b.bookingStatus) + "</span></td>";
      recentBody.appendChild(tr);
    });
  }

  function renderBookingsTable() {
    const tbody = document.getElementById("myBookingsBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    bookings.forEach(function (b, idx) {
      const pooja = SAMPLE_POOJAS[b.poojaId];
      const priest = SAMPLE_PRIESTS[b.priestId];
      const canCancel =
        b.bookingStatus === "Pending" ||
        b.bookingStatus === "Accepted" ||
        b.bookingStatus === "Confirmed";

      const tr = document.createElement("tr");
      tr.innerHTML =
        "<td><strong>" + escapeHtml(b.id) + "</strong></td>" +
        "<td>" + escapeHtml(pooja ? pooja.name : b.poojaId) + "</td>" +
        "<td>" + escapeHtml(priest ? priest.name : b.priestId) + "</td>" +
        "<td>" + escapeHtml(b.date) + "</td>" +
        "<td>" + escapeHtml(b.time) + "</td>" +
        "<td>" + escapeHtml(b.location) + "</td>" +
        "<td><span class='badge " + statusBadgeClass(b.bookingStatus) + "'>" + escapeHtml(b.bookingStatus) + "</span></td>" +
        "<td><span class='badge " + statusBadgeClass(b.paymentStatus) + "'>" + escapeHtml(b.paymentStatus) + "</span></td>" +
        "<td style='display:flex;gap:6px;flex-wrap:wrap;'>" +
          "<button type='button' class='btn btn-secondary btn-sm' data-print-idx='" + idx + "'>" + escapeHtml(t("btnPrint")) + "</button>" +
          (canCancel
            ? "<button type='button' class='btn btn-primary btn-sm' data-cancel-idx='" + idx + "'>" + escapeHtml(t("btnCancel")) + "</button>"
            : "") +
        "</td>";
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll("[data-cancel-idx]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const index = Number(btn.getAttribute("data-cancel-idx"));
        if (!bookings[index]) return;
        bookings[index].bookingStatus = "Cancelled";
        saveStorage(BOOKINGS_KEY, bookings);
        notifications.unshift({
          id: "N-" + Date.now(),
          text: "Booking " + bookings[index].id + " was marked Cancelled [Sample]."
        });
        saveStorage(NOTIFS_KEY, notifications);
        renderAll();
        showFeedback(t("bookingCancelled"), "badge-warning");
      });
    });

    tbody.querySelectorAll("[data-print-idx]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const index = Number(btn.getAttribute("data-print-idx"));
        const rec = bookings[index];
        if (!rec) return;
        const win = window.open("", "_blank", "width=600,height=500");
        if (win) {
          win.document.write(
            "<html><head><title>Booking Confirmation - " + escapeHtml(rec.id) + "</title></head>" +
            "<body style='font-family:sans-serif;padding:24px;'>" +
            "<h2>Sacred Sankalpam \u2014 Booking Confirmation (Sample Prototype)</h2>" +
            "<p><strong>Booking ID:</strong> " + escapeHtml(rec.id) + "</p>" +
            "<p><strong>Pooja:</strong> " + escapeHtml(rec.poojaId) + "</p>" +
            "<p><strong>Priest:</strong> " + escapeHtml(rec.priestId) + "</p>" +
            "<p><strong>Date & Time:</strong> " + escapeHtml(rec.date) + " (" + escapeHtml(rec.time) + ")</p>" +
            "<p><strong>Location:</strong> " + escapeHtml(rec.location) + "</p>" +
            "<p><strong>Booking Status:</strong> " + escapeHtml(rec.bookingStatus) + "</p>" +
            "<p><strong>Payment Status:</strong> " + escapeHtml(rec.paymentStatus) + "</p>" +
            "</body></html>"
          );
          win.document.close();
          win.print();
        }
      });
    });
  }

  function renderMyPriests() {
    const grid = document.getElementById("myPriestsGrid");
    if (!grid) return;
    grid.innerHTML = "";

    Object.keys(SAMPLE_PRIESTS).forEach(function (key) {
      const p = SAMPLE_PRIESTS[key];
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML =
        "<h3 style='margin-bottom:6px;'>" + escapeHtml(p.name) + "</h3>" +
        "<p style='color:var(--text-secondary);margin-bottom:14px;'>" +
          escapeHtml(p.spec) + " \u00B7 " + escapeHtml(p.loc) +
        "</p>" +
        "<div style='display:flex;gap:8px;flex-wrap:wrap;margin-top:auto;'>" +
          "<a href='priest-profile.html?priest=" + encodeURIComponent(p.id) + "' class='btn btn-secondary btn-sm'>" + escapeHtml(t("btnViewProfile")) + "</a>" +
          "<button type='button' class='btn btn-primary btn-sm' data-quick-priest='" + escapeHtml(p.id) + "'>" + escapeHtml(t("btnBookAgain")) + "</button>" +
        "</div>";
      grid.appendChild(card);
    });

    grid.querySelectorAll("[data-quick-priest]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const pid = btn.getAttribute("data-quick-priest");
        const priestSelect = document.getElementById("bookPriestSelect");
        if (priestSelect) priestSelect.value = pid;
        switchSection("book");
      });
    });
  }

  function renderSamagriTab() {
    const container = document.getElementById("bookedSamagriList");
    if (!container) return;
    container.innerHTML = "";

    bookings.forEach(function (b) {
      const pooja = SAMPLE_POOJAS[b.poojaId];
      if (!pooja) return;
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML =
        "<div style='display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px;'>" +
          "<h3 style='margin-bottom:0;font-size:1.05rem;'>" + escapeHtml(pooja.name) + "</h3>" +
          "<span class='badge badge-gold'>" + escapeHtml(b.id) + "</span>" +
        "</div>" +
        "<ul style='list-style:disc;padding-left:18px;color:var(--text-secondary);margin-bottom:0;'>" +
          pooja.samagri.map(function (it) { return "<li>" + escapeHtml(it) + "</li>"; }).join("") +
        "</ul>";
      container.appendChild(card);
    });
  }

  function renderPaymentsTable() {
    const tbody = document.getElementById("paymentsTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    bookings.forEach(function (b) {
      const pooja = SAMPLE_POOJAS[b.poojaId];
      const tr = document.createElement("tr");
      tr.innerHTML =
        "<td><strong>" + escapeHtml(b.id) + "</strong></td>" +
        "<td>" + escapeHtml(pooja ? pooja.name : b.poojaId) + "</td>" +
        "<td>\u20B9" + escapeHtml(b.amount) + "</td>" +
        "<td>" + escapeHtml(b.date) + "</td>" +
        "<td><span class='badge " + statusBadgeClass(b.paymentStatus) + "'>" + escapeHtml(b.paymentStatus) + "</span></td>";
      tbody.appendChild(tr);
    });
  }

  function renderNotifications() {
    const list = document.getElementById("devoteeNotifsList");
    if (!list) return;
    list.innerHTML = "";

    notifications.forEach(function (n) {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = "<p style='margin-bottom:0;'>" + escapeHtml(n.text) + "</p>";
      list.appendChild(card);
    });
  }

  function hydrateProfileForm() {
    const nameInput = document.getElementById("devProfileName");
    const emailInput = document.getElementById("devProfileEmail");
    const phoneInput = document.getElementById("devProfilePhone");
    const cityInput = document.getElementById("devProfileCity");
    const topName = document.getElementById("topbarUserName");
    const topAvatar = document.getElementById("topbarUserAvatar");

    if (nameInput) nameInput.value = profile.name || "";
    if (emailInput) emailInput.value = profile.email || "";
    if (phoneInput) phoneInput.value = profile.phone || "";
    if (cityInput) cityInput.value = profile.city || "";
    if (topName) topName.textContent = profile.name || "Devotee";
    if (topAvatar) {
      const initials = (profile.name || "D").trim().charAt(0).toUpperCase();
      topAvatar.textContent = initials || "D";
    }
  }

  function applyDashboardLabels() {
    document.documentElement.setAttribute("lang", "en");
    document.querySelectorAll("[data-dash-i18n]").forEach(function (el) {
      const key = el.getAttribute("data-dash-i18n");
      el.textContent = t(key);
    });
    populateSelectOptions();
    renderAll();
  }

  function renderAll() {
    renderOverviewMetrics();
    renderBookingsTable();
    renderMyPriests();
    renderSamagriTab();
    renderPaymentsTable();
    renderNotifications();
    hydrateProfileForm();
  }

  function switchSection(sectionId) {
    document.querySelectorAll(".dash-section").forEach(function (sec) {
      sec.classList.toggle("is-active", sec.getAttribute("data-section") === sectionId);
    });
    document.querySelectorAll(".dash-nav-btn[data-target]").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-target") === sectionId);
    });

    // Close mobile drawer if open
    const sidebar = document.getElementById("dashSidebar");
    const backdrop = document.getElementById("dashBackdrop");
    if (sidebar) sidebar.classList.remove("is-open");
    if (backdrop) backdrop.classList.remove("is-open");
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".dash-nav-btn[data-target]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        switchSection(btn.getAttribute("data-target"));
      });
    });

    const mobileToggle = document.getElementById("dashMobileToggle");
    const sidebar = document.getElementById("dashSidebar");
    const backdrop = document.getElementById("dashBackdrop");
    if (mobileToggle && sidebar && backdrop) {
      mobileToggle.addEventListener("click", function () {
        sidebar.classList.toggle("is-open");
        backdrop.classList.toggle("is-open");
      });
      backdrop.addEventListener("click", function () {
        sidebar.classList.remove("is-open");
        backdrop.classList.remove("is-open");
      });
    }

    const poojaSelect = document.getElementById("bookPoojaSelect");
    if (poojaSelect) {
      poojaSelect.addEventListener("change", renderBookingSamagriPreview);
    }

    const bookingForm = document.getElementById("devoteeBookingForm");
    if (bookingForm) {
      bookingForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const poojaId = document.getElementById("bookPoojaSelect").value;
        const priestId = document.getElementById("bookPriestSelect").value;
        const dateVal = document.getElementById("bookDateInput").value;
        const timeVal = document.getElementById("bookTimeSelect").value;
        const locVal = document.getElementById("bookLocationInput").value.trim();
        const notesVal = document.getElementById("bookNotesInput").value.trim();

        if (!poojaId || !priestId || !dateVal || !timeVal || !locVal) {
          showFeedback(t("errRequired"), "badge-danger");
          return;
        }

        const priest = SAMPLE_PRIESTS[priestId];
        if (priest && Array.isArray(priest.blockedDates) && priest.blockedDates.includes(dateVal)) {
          showFeedback(t("errBlockedDate"), "badge-danger");
          return;
        }

        const hasOverlap = bookings.some(function (b) {
          const active =
            b.bookingStatus === "Pending" ||
            b.bookingStatus === "Accepted" ||
            b.bookingStatus === "Confirmed" ||
            b.bookingStatus === "Rescheduled";
          return active && b.priestId === priestId && b.date === dateVal && b.time === timeVal;
        });

        if (hasOverlap) {
          showFeedback(t("errOverlap"), "badge-danger");
          return;
        }

        const pooja = SAMPLE_POOJAS[poojaId];
        const newBooking = {
          id: "BK-" + String(1000 + bookings.length + 1),
          poojaId: poojaId,
          priestId: priestId,
          date: dateVal,
          time: timeVal,
          location: locVal,
          notes: notesVal,
          bookingStatus: "Pending",
          paymentStatus: "Pending",
          amount: pooja ? pooja.amount : 2000
        };

        bookings.push(newBooking);
        saveStorage(BOOKINGS_KEY, bookings);

        notifications.unshift({
          id: "N-" + Date.now(),
          text: "New booking request " + newBooking.id + " submitted for " + dateVal + " (" + timeVal + ") [Sample]."
        });
        saveStorage(NOTIFS_KEY, notifications);

        bookingForm.reset();
        populateSelectOptions();
        renderAll();
        switchSection("bookings");
        showFeedback(t("bookingCreated"), "badge-success");
      });
    }

    const profileForm = document.getElementById("devoteeProfileForm");
    if (profileForm) {
      profileForm.addEventListener("submit", function (event) {
        event.preventDefault();
        profile = {
          name: document.getElementById("devProfileName").value.trim() || INITIAL_PROFILE.name,
          email: document.getElementById("devProfileEmail").value.trim() || INITIAL_PROFILE.email,
          phone: document.getElementById("devProfilePhone").value.trim() || INITIAL_PROFILE.phone,
          city: document.getElementById("devProfileCity").value.trim() || INITIAL_PROFILE.city
        };
        saveStorage(PROFILE_KEY, profile);
        hydrateProfileForm();
        showFeedback(t("profileSaved"), "badge-success");
      });
    }

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        try {
          window.localStorage.removeItem("sankalpam_proto_session");
        } catch (e) {}
        window.location.href = "login.html";
      });
    }

    applyDashboardLabels();
  });
})(window, document);