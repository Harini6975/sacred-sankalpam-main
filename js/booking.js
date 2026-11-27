/* ==========================================================================
   Booking Workflow & Validation Helpers (js/booking.js)
   Separates Booking Status and Payment Status, validates booking inputs,
   and checks priest unavailable dates and overlapping bookings.
   ========================================================================== */

(function (window) {
  "use strict";

  const BOOKINGS_STORAGE_KEY = "sankalpam_proto_bookings_v1";

  const BOOKING_STATUSES = [
    "Pending",
    "Accepted",
    "Confirmed",
    "Completed",
    "Rejected",
    "Cancelled",
    "Rescheduled"
  ];

  const PAYMENT_STATUSES = [
    "Pending",
    "Paid",
    "Refunded",
    "Failed"
  ];

  const ACTIVE_SLOT_STATUSES = [
    "Pending",
    "Accepted",
    "Confirmed",
    "Rescheduled"
  ];

  function loadBookings(fallbackList) {
    try {
      const raw = window.localStorage.getItem(BOOKINGS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (err) {}
    return Array.isArray(fallbackList) ? fallbackList.slice() : [];
  }

  function saveBookings(list) {
    try {
      window.localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(list || []));
    } catch (err) {}
  }

  function validateBookingPayload(payload) {
    const errors = [];
    if (!payload || !String(payload.poojaId || "").trim()) {
      errors.push("pooja");
    }
    if (!payload || !String(payload.priestId || "").trim()) {
      errors.push("priest");
    }
    if (!payload || !String(payload.date || "").trim()) {
      errors.push("date");
    }
    if (!payload || !String(payload.time || "").trim()) {
      errors.push("time");
    }
    if (!payload || !String(payload.location || "").trim()) {
      errors.push("location");
    }
    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  function isSlotAvailable(existingBookings, priestId, dateStr, timeStr, blockedDates) {
    const blocked = Array.isArray(blockedDates) ? blockedDates : [];
    if (blocked.indexOf(dateStr) !== -1) {
      return { available: false, reason: "blocked_date" };
    }

    const list = Array.isArray(existingBookings) ? existingBookings : [];
    const conflict = list.some(function (item) {
      if (!item || item.priestId !== priestId) {
        return false;
      }
      if (ACTIVE_SLOT_STATUSES.indexOf(item.bookingStatus) === -1) {
        return false;
      }
      return item.date === dateStr && item.time === timeStr;
    });

    if (conflict) {
      return { available: false, reason: "overlapping_booking" };
    }

    return { available: true, reason: null };
  }

  window.SankalpamBooking = {
    STORAGE_KEY: BOOKINGS_STORAGE_KEY,
    BOOKING_STATUSES: BOOKING_STATUSES.slice(),
    PAYMENT_STATUSES: PAYMENT_STATUSES.slice(),
    loadBookings: loadBookings,
    saveBookings: saveBookings,
    validateBookingPayload: validateBookingPayload,
    isSlotAvailable: isSlotAvailable
  };
})(window);