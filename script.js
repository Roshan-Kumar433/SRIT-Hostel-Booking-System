/* ================================================================
   script.js — Shared JS for all pages
   Hostel Room Booking System (SRIT)
   ================================================================ */

// ================================================================
// ── SHARED UTILITIES ────────────────────────────────────────────
// ================================================================

// Guard: redirect to login if not authenticated
function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    location.href = "login.html";
    return null;
  }
  return user;
}

function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem("currentUser")); }
  catch { return null; }
}

// Initials from name
function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

// Show toast notification
function showToast(message, type = "success", duration = 3000) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  const icon = type === "success" ? "✅" : "❌";
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}

// Logout
function logout() {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("selectedYear");
  localStorage.removeItem("selectedRoom");
  location.href = "login.html";
}

// ── Header Setup (shared across dashboard/rooms/beds) ────────────
function setupHeader(user) {
  const nameEl = document.getElementById("header-user-name");
  const avatarEl = document.getElementById("header-avatar");
  if (nameEl)   nameEl.textContent = user.name;
  if (avatarEl) avatarEl.textContent = getInitials(user.name);

  // Dropdown toggle
  const trigger  = document.getElementById("user-trigger");
  const userMenu = document.getElementById("header-user");
  const logoutBtn = document.getElementById("logout-btn");

  if (trigger && userMenu) {
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      userMenu.classList.toggle("open");
    });
    document.addEventListener("click", () => {
      userMenu.classList.remove("open");
    });
  }
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }
}

// ── Modal helpers ─────────────────────────────────────────────────
function openModal(id)  { document.getElementById(id).classList.add("open"); }
function closeModal(id) { document.getElementById(id).classList.remove("open"); }

// ================================================================
// ── PAGE: LOGIN (index.html) ─────────────────────────────────────
// ================================================================
function initLogin() {
  const form     = document.getElementById("login-form");
  const errorBox = document.getElementById("login-error");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const identifier = document.getElementById("login-id").value.trim();
    const password   = document.getElementById("login-password").value.trim();
    const role       = document.querySelector('input[name="role"]:checked')?.value || "student";

    // Validation
    if (!identifier || !password) {
      showError("Please fill in all fields.");
      return;
    }
    if (password.length < 4) {
      showError("Password must be at least 4 characters.");
      return;
    }

    // Derive name from roll/email (mock — no real auth)
    let name = identifier;
    if (identifier.includes("@")) {
      name = identifier.split("@")[0].replace(/[^a-zA-Z]/g, " ").trim();
      name = name.charAt(0).toUpperCase() + name.slice(1);
    }

    const user = { name, roll: identifier, role };
    localStorage.setItem("currentUser", JSON.stringify(user));
    location.href = "dashboard.html";
  });

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.classList.add("show");
    setTimeout(() => errorBox.classList.remove("show"), 4000);
  }
}

// ================================================================
// ── PAGE: DASHBOARD (dashboard.html) ─────────────────────────────
// ================================================================
function initDashboard() {
  const container = document.getElementById("years-grid");
  if (!container) return;

  const user = requireAuth(); if (!user) return;
  setupHeader(user);

  // Check if user already has a booking
  const myBooking = DataStore.getMyBooking(user.roll);
  renderBookingBanner(myBooking);

  // Render year cards
  const years = [
    { label: "First Year",  sub: "I Year",   roman: "I",   icon: "🏫" },
    { label: "Second Year", sub: "II Year",  roman: "II",  icon: "📚" },
    { label: "Third Year",  sub: "III Year", roman: "III", icon: "🎓" },
    { label: "Fourth Year", sub: "IV Year",  roman: "IV",  icon: "🏆" },
  ];
  container.innerHTML = years.map((y, i) => `
    <div class="year-card" data-year="${y.label}" tabindex="0" role="button" aria-label="Select ${y.label}">
      <div class="year-icon">${y.roman}</div>
      <div>
        <div class="year-label">${y.label}</div>
        <div class="year-sublabel">${y.sub}</div>
      </div>
      <div class="year-arrow">→</div>
    </div>
  `).join("");

  // Click handlers
  container.querySelectorAll(".year-card").forEach(card => {
    const handler = () => {
      localStorage.setItem("selectedYear", card.dataset.year);
      location.href = "rooms.html";
    };
    card.addEventListener("click",  handler);
    card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") handler(); });
  });
}

function renderBookingBanner(booking) {
  const banner = document.getElementById("booking-banner");
  if (!banner) return;
  if (booking) {
    banner.innerHTML = `
      <div class="booking-banner-icon">🏠</div>
      <div class="booking-banner-text">
        <h3>You already have a booking!</h3>
        <p>Room <strong>${booking.roomNumber}</strong> · Block ${booking.block} · Floor ${booking.floor} · Bed ${booking.bedNumber} · ${booking.year}</p>
      </div>
    `;
    banner.style.display = "flex";
  } else {
    banner.style.display = "none";
  }
}

// ================================================================
// ── PAGE: ROOMS (rooms.html) ──────────────────────────────────────
// ================================================================
function initRooms() {
  const container = document.getElementById("rooms-grid");
  if (!container) return;

  const user = requireAuth(); if (!user) return;
  setupHeader(user);

  const year = localStorage.getItem("selectedYear");
  if (!year) { location.href = "dashboard.html"; return; }

  // Breadcrumb & title
  document.getElementById("bc-year").textContent  = year;
  document.getElementById("page-year-title").textContent = year;

  const rooms = DataStore.getRoomsForYear(year);

  if (rooms.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-state-icon">🏗️</div>
        <h3>No rooms found</h3>
        <p>No rooms are available for ${year} right now.</p>
      </div>`;
    return;
  }

  container.innerHTML = rooms.map(room => {
    const occ  = DataStore.occupiedCount(room.id);
    const free = room.capacity - occ;
    const pct  = Math.round((occ / room.capacity) * 100);
    const isFull = free === 0;

    let badgeClass = "badge-available";
    let badgeText  = `${free} Bed${free !== 1 ? "s" : ""} Free`;
    if (isFull)       { badgeClass = "badge-full";    badgeText = "Full"; }
    else if (free < room.capacity) { badgeClass = "badge-partial"; }

    return `
      <div class="room-card${isFull ? " full" : ""}"
           data-room-id="${room.id}"
           tabindex="${isFull ? -1 : 0}"
           role="button"
           aria-label="Room ${room.roomNumber}${isFull ? ", full" : ""}">
        <div class="room-number">Room ${room.roomNumber}</div>
        <div class="room-info">Block ${room.block} · Floor ${room.floor}</div>
        <span class="room-badge ${badgeClass}">${occ}/${room.capacity} Occupied · ${badgeText}</span>
        <div class="room-occupancy-bar">
          <div class="room-occupancy-fill" style="width:${pct}%"></div>
        </div>
      </div>
    `;
  }).join("");

  // Click handlers
  container.querySelectorAll(".room-card:not(.full)").forEach(card => {
    const handler = () => {
      localStorage.setItem("selectedRoom", card.dataset.roomId);
      location.href = "beds.html";
    };
    card.addEventListener("click",  handler);
    card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") handler(); });
  });
}

// ================================================================
// ── PAGE: BEDS (beds.html) ────────────────────────────────────────
// ================================================================
let _selectedBed = null;

function initBeds() {
  const container = document.getElementById("beds-grid");
  if (!container) return;

  const user = requireAuth(); if (!user) return;
  setupHeader(user);

  const year   = localStorage.getItem("selectedYear");
  const roomId = localStorage.getItem("selectedRoom");
  if (!year || !roomId) { location.href = "rooms.html"; return; }

  const room = DataStore.getRoomById(roomId);
  if (!room) { location.href = "rooms.html"; return; }

  // Breadcrumb & title
  document.getElementById("bc-year").textContent   = year;
  document.getElementById("bc-room").textContent   = `Room ${room.roomNumber}`;
  document.getElementById("page-room-title").textContent = `Room ${room.roomNumber}`;

  renderBedGrid(container, room, user);
  setupBedModal(room, year, user);
}

function renderBedGrid(container, room, user) {
  const beds = DataStore.getBedsForRoom(room.id);
  const bedIcons = ["🛏️", "🛌", "🛏️", "🛌"];

  container.innerHTML = beds.map((bed, i) => {
    const isAvail = bed.status === "available";
    return `
      <div class="bed-tile ${isAvail ? "available" : "occupied"}"
           data-bed-id="${bed.id}"
           tabindex="${isAvail ? 0 : -1}"
           role="${isAvail ? "button" : "presentation"}"
           aria-label="Bed ${bed.bedNumber}${isAvail ? ", available" : ", occupied by " + bed.occupantName}">
        <div class="bed-icon">${bedIcons[i]}</div>
        <div class="bed-number">Bed ${bed.bedNumber}</div>
        <span class="bed-status">${isAvail ? "Available" : "Occupied"}</span>
        ${!isAvail ? `
          <div class="bed-occupant">
            <strong>${bed.occupantName}</strong>
            ${bed.occupantRoll}
          </div>` : ""}
      </div>
    `;
  }).join("");

  // Click handlers on available beds
  container.querySelectorAll(".bed-tile.available").forEach(tile => {
    const handler = () => {
      _selectedBed = DataStore.getBedById(tile.dataset.bedId);
      if (_selectedBed) populateModal(_selectedBed, room);
    };
    tile.addEventListener("click",  handler);
    tile.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") handler(); });
  });
}

function populateModal(bed, room) {
  document.getElementById("modal-year").textContent       = room.year;
  document.getElementById("modal-block").textContent      = `Block ${room.block}`;
  document.getElementById("modal-room").textContent       = `Room ${room.roomNumber}`;
  document.getElementById("modal-bed").textContent        = `Bed ${bed.bedNumber}`;
  const user = getCurrentUser();
  document.getElementById("modal-student").textContent    = user ? user.name : "-";
  document.getElementById("modal-roll").textContent       = user ? user.roll : "-";
  openModal("confirm-modal");
}

function setupBedModal(room, year, user) {
  const overlay   = document.getElementById("confirm-modal");
  const cancelBtn = document.getElementById("modal-cancel");
  const confirmBtn = document.getElementById("modal-confirm");

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => closeModal("confirm-modal"));
  }
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal("confirm-modal");
    });
  }
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      if (!_selectedBed) return;

      const ok = DataStore.bookBed(_selectedBed.id, user);
      closeModal("confirm-modal");

      if (ok) {
        showToast("🎉 Room booked successfully!", "success");
        // Re-render beds to reflect the new booking
        const bedsGrid = document.getElementById("beds-grid");
        const freshRoom = DataStore.getRoomById(room.id);
        renderBedGrid(bedsGrid, freshRoom || room, user);
        // Redirect to dashboard after short delay
        setTimeout(() => { location.href = "dashboard.html"; }, 1800);
      } else {
        showToast("Booking failed. Please try again.", "error");
      }
    });
  }
}

// ================================================================
// ── DOMContentLoaded — auto-detect page & init ───────────────────
// ================================================================
document.addEventListener("DOMContentLoaded", () => {
  // Detect current page by checking for page-specific elements
  if (document.getElementById("login-form"))   initLogin();
  if (document.getElementById("years-grid"))   initDashboard();
  if (document.getElementById("rooms-grid"))   initRooms();
  if (document.getElementById("beds-grid"))    initBeds();
});
