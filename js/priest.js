/* ==========================================================================
   Priest Dashboard Logic (js/priest.js)
   Handles sidebar sections, real metric counts, profile updates, services
   (pending admin approval), availability/blocked dates, booking requests
   (Accept/Reject), schedule, marking ceremonies Completed, earnings,
   and notifications (English-only).
   ========================================================================== */

(function (window, document) {
  "use strict";

  const BOOKINGS_KEY = "sankalpam_proto_bookings_v1";
  const PRIEST_PROFILE_KEY = "sankalpam_proto_priest_profile_v1";
  const PRIEST_SERVICES_KEY = "sankalpam_proto_priest_services_v1";
  const PRIEST_AVAIL_KEY = "sankalpam_proto_priest_avail_v1";
  const PRIEST_NOTIFS_KEY = "sankalpam_proto_priest_notifs_v1";

  const INITIAL_BOOKINGS = [
    {
      id: "BK-1001",
      poojaId: "ganapathi-homam",
      poojaName: "Ganapathi Homam (Sample)",
      devoteeName: "Devotee User (Sample)",
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
      poojaName: "Satyanarayana Pooja (Sample)",
      devoteeName: "Devotee User (Sample)",
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
      poojaName: "Lakshmi Pooja (Sample)",
      devoteeName: "Devotee User (Sample)",
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
    name: "Acharya Raghavan S. (Sample)",
    phone: "+91 90000 11111",
    email: "priest.sample@example.org",
    experience: "14 Years",
    specializations: "Homam / Havan, Griha Pooja",
    languages: "Tamil, Sanskrit, English",
    locations: "Madurai & Nearby Areas (Sample)",
    bio: "Conducts traditional household rituals and fire ceremonies with clear guidance on Samagri preparation (Sample prototype profile)."
  };

  const INITIAL_SERVICES = [
    {
      id: "SRV-1",
      name: "Ganapathi Homam (Sample)",
      category: "Homam / Havan",
      duration: "1.5 – 2 hrs",
      fee: 2500,
      approvalStatus: "Approved (Sample)"
    },
    {
      id: "SRV-2",
      name: "Gruhapravesam (Sample)",
      category: "Griha Pooja",
      duration: "2 – 3 hrs",
      fee: 3500,
      approvalStatus: "Approved (Sample)"
    }
  ];

  const INITIAL_AVAILABILITY = {
    slots: [
      { id: "SL-1", date: "2026-12-06", time: "07:00 AM", status: "Available" },
      { id: "SL-2", date: "2026-12-07", time: "09:30 AM", status: "Available" }
    ],
    blockedDates: ["2026-12-25"]
  };

  const INITIAL_NOTIFS = [
    {
      id: "PN-1",
      text: "New booking request BK-1002 is Pending review [Sample]."
    },
    {
      id: "PN-2",
      text: "Booking BK-1001 is Confirmed and marked Paid [Sample]."
    }
  ];

  const LABELS = {
    brandName: "Sacred Sankalpam",
    brandTagline: "Pooja & Priest Booking",
    roleBadge: "Priest Portal",
    welcomePrefix: "Welcome,",
    welcomeSub: "Manage requests, availability, schedule, services, and earnings (Sample prototype data).",
    navOverview: "Overview",
    navProfile: "My Profile",
    navServices: "My Services",
    navAvailability: "Availability",
    navRequests: "Booking Requests",
    navSchedule: "My Schedule",
    navCompleted: "Completed Poojas",
    navEarnings: "Earnings",
    navNotifications: "Notifications",
    btnLogout: "Logout",
    kpiTotal: "Total Bookings",
    kpiPending: "Pending Requests",
    kpiUpcoming: "Upcoming Ceremonies",
    kpiCompleted: "Completed Poojas",
    kpiEarnings: "Earnings Summary",
    profileHeading: "Priest Profile",
    lblName: "Priest Name",
    lblPhone: "Contact Phone",
    lblEmail: "Contact Email",
    lblExperience: "Experience",
    lblSpecializations: "Specializations",
    lblLanguages: "Languages Spoken",
    lblLocations: "Service Locations",
    lblBio: "Biography",
    btnSaveProfile: "Save Profile",
    servicesHeading: "My Offered Services",
    serviceNote: "New or edited services are marked Pending Admin Approval until reviewed by an administrator.",
    lblSrvName: "Service Name",
    lblSrvCat: "Category",
    lblSrvDur: "Estimated Duration",
    lblSrvFee: "Dakshina / Fee (₹)",
    btnAddService: "Add Service (Pending Approval)",
    availHeading: "Availability & Blocked Dates",
    lblAvailDate: "Available Date",
    lblAvailTime: "Available Time Slot",
    btnAddSlot: "Add Available Slot",
    lblBlockDate: "Block Unavailable Date",
    btnBlockDate: "Block Date",
    openSlotsHeading: "Open Slots",
    blockedDatesHeading: "Blocked Unavailable Dates",
    requestsHeading: "Incoming Booking Requests",
    scheduleHeading: "Upcoming Ceremonies Schedule",
    completedHeading: "Completed Poojas",
    earningsHeading: "Earnings & Payment Records",
    earningsNote: "Prototype note: Figures shown are from sample/local prototype records only.",
    notifsHeading: "Priest Notifications",
    thId: "ID",
    thPooja: "Pooja",
    thDevotee: "Devotee",
    thDate: "Date",
    thTime: "Time",
    thLocation: "Location",
    thBookingStatus: "Booking Status",
    thPaymentStatus: "Payment Status",
    thAmount: "Amount",
    thActions: "Actions",
    btnAccept: "Accept",
    btnReject: "Reject",
    btnMarkCompleted: "Mark Completed",
    btnRemove: "Remove",
    msgProfileSaved: "Priest profile updated in browser storage.",
    msgServiceAdded: "Service added with status Pending Admin Approval.",
    msgSlotAdded: "Available slot added.",
    msgDateBlocked: "Date added to blocked unavailable dates.",
    msgRequestAccepted: "Booking request marked Accepted.",
    msgRequestRejected: "Booking request marked Rejected.",
    msgMarkedCompleted: "Ceremony marked Completed."
  };

  function t(key) {
    return Object.prototype.hasOwnProperty.call(LABELS, key) ? LABELS[key] : key;
  }

  function escapeHtml(value) {
   return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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
  let profile = loadStorage(PRIEST_PROFILE_KEY, INITIAL_PROFILE);
  let services = loadStorage(PRIEST_SERVICES_KEY, INITIAL_SERVICES);
  let avail = loadStorage(PRIEST_AVAIL_KEY, INITIAL_AVAILABILITY);
  let notifs = loadStorage(PRIEST_NOTIFS_KEY, INITIAL_NOTIFS);

  function statusBadgeClass(status) {
    if (
      status === "Confirmed" ||
      status === "Completed" ||
      status === "Paid" ||
      status === "Approved (Sample)"
    ) {
      return "badge-success";
    }
    if (status === "Accepted") return "badge-info";
    if (status === "Pending" || String(status).indexOf("Pending") === 0) return "badge-warning";
    if (status === "Rejected" || status === "Cancelled" || status === "Failed") return "badge-danger";
    return "badge-gold";
  }

  function showFeedback(message, badgeType) {
    const box = document.getElementById("priestFeedback");
    if (!box) return;
    box.className = "dash-feedback " + (badgeType || "badge-info");
    box.style.display = "block";
    box.textContent = message;
  }

  function renderOverview() {
    const total = bookings.length;
    const pending = bookings.filter(function (b) { return b.bookingStatus === "Pending"; }).length;
    const upcoming = bookings.filter(function (b) {
      return (
        b.bookingStatus === "Accepted" ||
        b.bookingStatus === "Confirmed" ||
        b.bookingStatus === "Rescheduled"
      );
    }).length;
    const completed = bookings.filter(function (b) { return b.bookingStatus === "Completed"; }).length;
    const earned = bookings
      .filter(function (b) { return b.paymentStatus === "Paid"; })
      .reduce(function (sum, b) { return sum + (Number(b.amount) || 0); }, 0);

    const totalEl = document.getElementById("pKpiTotal");
    const pendingEl = document.getElementById("pKpiPending");
    const upcomingEl = document.getElementById("pKpiUpcoming");
    const completedEl = document.getElementById("pKpiCompleted");
    const earnEl = document.getElementById("pKpiEarnings");

    if (totalEl) totalEl.textContent = String(total);
    if (pendingEl) pendingEl.textContent = String(pending);
    if (upcomingEl) upcomingEl.textContent = String(upcoming);
    if (completedEl) completedEl.textContent = String(completed);
    if (earnEl) earnEl.textContent = "₹" + earned.toLocaleString("en-IN");
  }

  function hydrateProfile() {
    const nameInput = document.getElementById("pNameInput");
    const phoneInput = document.getElementById("pPhoneInput");
    const emailInput = document.getElementById("pEmailInput");
    const expInput = document.getElementById("pExpInput");
    const specInput = document.getElementById("pSpecInput");
    const langInput = document.getElementById("pLangInput");
    const locInput = document.getElementById("pLocInput");
    const bioInput = document.getElementById("pBioInput");
    const topName = document.getElementById("priestTopName");
    const topAvatar = document.getElementById("priestTopAvatar");

    if (nameInput) nameInput.value = profile.name || "";
    if (phoneInput) phoneInput.value = profile.phone || "";
    if (emailInput) emailInput.value = profile.email || "";
    if (expInput) expInput.value = profile.experience || "";
    if (specInput) specInput.value = profile.specializations || "";
    if (langInput) langInput.value = profile.languages || "";
    if (locInput) locInput.value = profile.locations || "";
    if (bioInput) bioInput.value = profile.bio || "";

    if (topName) topName.textContent = profile.name || "Priest";
    const ch = (profile.name || "P").trim().charAt(0).toUpperCase() || "P";
    if (topAvatar) topAvatar.textContent = ch;
  }

  function renderServices() {
    const tbody = document.getElementById("priestServicesBody");
    if (!tbody) return;
    tbody.innerHTML = "";
    services.forEach(function (srv) {
      const tr = document.createElement("tr");
      tr.innerHTML =
        "<td><strong>" + escapeHtml(srv.name) + "</strong></td>" +
        "<td>" + escapeHtml(srv.category) + "</td>" +
        "<td>" + escapeHtml(srv.duration) + "</td>" +
        "<td>₹" + escapeHtml(srv.fee) + "</td>" +
        "<td><span class='badge " + statusBadgeClass(srv.approvalStatus) + "'>" + escapeHtml(srv.approvalStatus) + "</span></td>";
      tbody.appendChild(tr);
    });
  }

  function renderAvailability() {
    const slotList = document.getElementById("openSlotsList");
    const blockList = document.getElementById("blockedDatesList");

    if (slotList) {
      slotList.innerHTML = "";
      avail.slots.forEach(function (s, idx) {
        const div = document.createElement("div");
        div.className = "card";
        div.style.padding = "12px 16px";
        div.style.flexDirection = "row";
        div.style.justifyContent = "space-between";
        div.style.alignItems = "center";
        div.innerHTML =
          "<span><strong>" + escapeHtml(s.date) + "</strong> · " + escapeHtml(s.time) + "</span>" +
          "<button type='button' class='btn btn-secondary btn-sm' data-del-slot='" + idx + "'>" + escapeHtml(t("btnRemove")) + "</button>";
        slotList.appendChild(div);
      });

      slotList.querySelectorAll("[data-del-slot]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          avail.slots.splice(Number(btn.getAttribute("data-del-slot")), 1);
          saveStorage(PRIEST_AVAIL_KEY, avail);
          renderAvailability();
        });
      });
    }

    if (blockList) {
      blockList.innerHTML = "";
      avail.blockedDates.forEach(function (d, idx) {
        const div = document.createElement("div");
        div.className = "card";
        div.style.padding = "12px 16px";
        div.style.flexDirection = "row";
        div.style.justifyContent = "space-between";
        div.style.alignItems = "center";
        div.innerHTML =
          "<span class='badge badge-danger'>" + escapeHtml(d) + "</span>" +
          "<button type='button' class='btn btn-secondary btn-sm' data-unblock='" + idx + "'>" + escapeHtml(t("btnRemove")) + "</button>";
        blockList.appendChild(div);
      });

      blockList.querySelectorAll("[data-unblock]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          avail.blockedDates.splice(Number(btn.getAttribute("data-unblock")), 1);
          saveStorage(PRIEST_AVAIL_KEY, avail);
          renderAvailability();
        });
      });
    }
  }

  function renderRequests() {
    const tbody = document.getElementById("requestsTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    bookings.forEach(function (b, idx) {
      const tr = document.createElement("tr");
      const isPending = b.bookingStatus === "Pending";
      tr.innerHTML =
        "<td><strong>" + escapeHtml(b.id) + "</strong></td>" +
        "<td>" + escapeHtml(b.poojaName || b.poojaId) + "</td>" +
        "<td>" + escapeHtml(b.devoteeName || "Devotee (Sample)") + "</td>" +
        "<td>" + escapeHtml(b.date) + " · " + escapeHtml(b.time) + "</td>" +
        "<td>" + escapeHtml(b.location) + "</td>" +
        "<td><span class='badge " + statusBadgeClass(b.bookingStatus) + "'>" + escapeHtml(b.bookingStatus) + "</span></td>" +
        "<td style='display:flex;gap:6px;flex-wrap:wrap;'>" +
          (isPending
            ? "<button type='button' class='btn btn-primary btn-sm' data-accept='" + idx + "'>" + escapeHtml(t("btnAccept")) + "</button>" +
              "<button type='button' class='btn btn-secondary btn-sm' data-reject='" + idx + "'>" + escapeHtml(t("btnReject")) + "</button>"
            : "<span>—</span>") +
        "</td>";
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll("[data-accept]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const i = Number(btn.getAttribute("data-accept"));
        if (!bookings[i]) return;
        bookings[i].bookingStatus = "Accepted";
        saveStorage(BOOKINGS_KEY, bookings);
        notifs.unshift({
          id: "PN-" + Date.now(),
          text: "Accepted booking request " + bookings[i].id + " [Sample]."
        });
        saveStorage(PRIEST_NOTIFS_KEY, notifs);
        renderAll();
        showFeedback(t("msgRequestAccepted"), "badge-success");
      });
    });

    tbody.querySelectorAll("[data-reject]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const i = Number(btn.getAttribute("data-reject"));
        if (!bookings[i]) return;
        bookings[i].bookingStatus = "Rejected";
        saveStorage(BOOKINGS_KEY, bookings);
        notifs.unshift({
          id: "PN-" + Date.now(),
          text: "Rejected booking request " + bookings[i].id + " [Sample]."
        });
        saveStorage(PRIEST_NOTIFS_KEY, notifs);
        renderAll();
        showFeedback(t("msgRequestRejected"), "badge-warning");
      });
    });
  }

  function renderScheduleAndCompleted() {
    const schedBody = document.getElementById("scheduleTableBody");
    const compBody = document.getElementById("completedTableBody");

    if (schedBody) {
      schedBody.innerHTML = "";
      bookings.forEach(function (b, idx) {
        if (
          b.bookingStatus === "Accepted" ||
          b.bookingStatus === "Confirmed" ||
          b.bookingStatus === "Rescheduled"
        ) {
          const tr = document.createElement("tr");
          tr.innerHTML =
            "<td><strong>" + escapeHtml(b.id) + "</strong></td>" +
            "<td>" + escapeHtml(b.poojaName || b.poojaId) + "</td>" +
            "<td>" + escapeHtml(b.date) + "</td>" +
            "<td>" + escapeHtml(b.time) + "</td>" +
            "<td>" + escapeHtml(b.location) + "</td>" +
            "<td><span class='badge " + statusBadgeClass(b.bookingStatus) + "'>" + escapeHtml(b.bookingStatus) + "</span></td>" +
            "<td><button type='button' class='btn btn-primary btn-sm' data-complete='" + idx + "'>" + escapeHtml(t("btnMarkCompleted")) + "</button></td>";
          schedBody.appendChild(tr);
        }
      });

      schedBody.querySelectorAll("[data-complete]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          const i = Number(btn.getAttribute("data-complete"));
          if (!bookings[i]) return;
          bookings[i].bookingStatus = "Completed";
          saveStorage(BOOKINGS_KEY, bookings);
          renderAll();
          showFeedback(t("msgMarkedCompleted"), "badge-success");
        });
      });
    }

    if (compBody) {
      compBody.innerHTML = "";
      bookings
        .filter(function (b) { return b.bookingStatus === "Completed"; })
        .forEach(function (b) {
          const tr = document.createElement("tr");
          tr.innerHTML =
            "<td><strong>" + escapeHtml(b.id) + "</strong></td>" +
            "<td>" + escapeHtml(b.poojaName || b.poojaId) + "</td>" +
            "<td>" + escapeHtml(b.date) + "</td>" +
            "<td>" + escapeHtml(b.location) + "</td>" +
            "<td><span class='badge badge-success'>Completed</span></td>";
          compBody.appendChild(tr);
        });
    }
  }

  function renderEarningsAndNotifs() {
    const earnBody = document.getElementById("earningsTableBody");
    if (earnBody) {
      earnBody.innerHTML = "";
      bookings.forEach(function (b) {
        const tr = document.createElement("tr");
        tr.innerHTML =
          "<td><strong>" + escapeHtml(b.id) + "</strong></td>" +
          "<td>" + escapeHtml(b.poojaName || b.poojaId) + "</td>" +
          "<td>₹" + escapeHtml(b.amount || 0) + "</td>" +
          "<td><span class='badge " + statusBadgeClass(b.paymentStatus) + "'>" + escapeHtml(b.paymentStatus) + "</span></td>";
        earnBody.appendChild(tr);
      });
    }

    const notifList = document.getElementById("priestNotifsList");
    if (notifList) {
      notifList.innerHTML = "";
      notifs.forEach(function (n) {
        const card = document.createElement("article");
        card.className = "card";
        card.innerHTML = "<p style='margin-bottom:0;'>" + escapeHtml(n.text) + "</p>";
        notifList.appendChild(card);
      });
    }
  }

  function applyLabels() {
    document.documentElement.setAttribute("lang", "en");
    document.querySelectorAll("[data-dash-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-dash-i18n"));
    });
    renderAll();
  }

  function renderAll() {
    renderOverview();
    hydrateProfile();
    renderServices();
    renderAvailability();
    renderRequests();
    renderScheduleAndCompleted();
    renderEarningsAndNotifs();
  }

  function switchSection(sectionId) {
    document.querySelectorAll(".dash-section").forEach(function (sec) {
      sec.classList.toggle("is-active", sec.getAttribute("data-section") === sectionId);
    });
    document.querySelectorAll(".dash-nav-btn[data-target]").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-target") === sectionId);
    });
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

    const profileForm = document.getElementById("priestProfileForm");
    if (profileForm) {
      profileForm.addEventListener("submit", function (e) {
        e.preventDefault();
        profile = {
          name: document.getElementById("pNameInput").value.trim() || INITIAL_PROFILE.name,
          phone: document.getElementById("pPhoneInput").value.trim(),
          email: document.getElementById("pEmailInput").value.trim(),
          experience: document.getElementById("pExpInput").value.trim(),
          specializations: document.getElementById("pSpecInput").value.trim(),
          languages: document.getElementById("pLangInput").value.trim(),
          locations: document.getElementById("pLocInput").value.trim(),
          bio: document.getElementById("pBioInput").value.trim()
        };
        saveStorage(PRIEST_PROFILE_KEY, profile);
        hydrateProfile();
        showFeedback(t("msgProfileSaved"), "badge-success");
      });
    }

    const serviceForm = document.getElementById("priestServiceForm");
    if (serviceForm) {
      serviceForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("srvNameInput").value.trim();
        const category = document.getElementById("srvCatInput").value.trim();
        const duration = document.getElementById("srvDurInput").value.trim();
        const fee = Number(document.getElementById("srvFeeInput").value) || 1500;
        if (!name || !category || !duration) return;

        services.push({
          id: "SRV-" + (services.length + 1),
          name: name,
          category: category,
          duration: duration,
          fee: fee,
          approvalStatus: "Pending Admin Approval"
        });
        saveStorage(PRIEST_SERVICES_KEY, services);
        e.target.reset();
        renderServices();
        showFeedback(t("msgServiceAdded"), "badge-warning");
      });
    }

    const slotForm = document.getElementById("addSlotForm");
    if (slotForm) {
      slotForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const d = document.getElementById("slotDateInput").value;
        const tm = document.getElementById("slotTimeInput").value;
        if (!d || !tm) return;
        avail.slots.push({ id: "SL-" + Date.now(), date: d, time: tm, status: "Available" });
        saveStorage(PRIEST_AVAIL_KEY, avail);
        e.target.reset();
        renderAvailability();
        showFeedback(t("msgSlotAdded"), "badge-success");
      });
    }

    const blockForm = document.getElementById("blockDateForm");
    if (blockForm) {
      blockForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const bd = document.getElementById("blockDateInput").value;
        if (!bd) return;
        if (!avail.blockedDates.includes(bd)) {
          avail.blockedDates.push(bd);
          saveStorage(PRIEST_AVAIL_KEY, avail);
        }
        e.target.reset();
        renderAvailability();
        showFeedback(t("msgDateBlocked"), "badge-warning");
      });
    }

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        try { window.localStorage.removeItem("sankalpam_proto_session"); } catch (e) {}
        window.location.href = "login.html";
      });
    }

    applyLabels();
  });
})(window, document);