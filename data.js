/* ================================================================
   data.js — Mock Data & localStorage Initialization
   Hostel Room Booking System (SRIT)
   ================================================================ */

// ── Sample occupants for pre-populated beds ──────────────────────
const SAMPLE_OCCUPANTS = [
  { name: "Ravi Kumar",    roll: "21CS011" },
  { name: "Sanjay M",     roll: "21CS042" },
  { name: "Anita R",      roll: "21EC013" },
  { name: "Deepak V",     roll: "21ME014" },
  { name: "Karthik S",    roll: "21CS055" },
  { name: "Meena T",      roll: "21EC036" },
  { name: "Bala R",       roll: "21CS077" },
  { name: "Kavya N",      roll: "22CS018" },
  { name: "Vijay P",      roll: "22EC019" },
  { name: "Sundar K",     roll: "22CS020" },
  { name: "Lakshmi D",    roll: "22ME021" },
  { name: "Praveen J",    roll: "22CS022" },
  { name: "Nandini R",    roll: "22EC023" },
  { name: "Bharath A",    roll: "23CS024" },
  { name: "Swetha V",     roll: "23EC025" },
  { name: "Harish K",     roll: "23CS026" },
];

let _occIdx = 0;
function nextOcc() { return SAMPLE_OCCUPANTS[_occIdx++ % SAMPLE_OCCUPANTS.length]; }

// ── Room + Bed generator ─────────────────────────────────────────
// occupiedBeds: array of bed indices (0-3) that are pre-occupied
function generateRoom(id, roomNumber, year, block, floor, occupiedBeds = []) {
  const beds = [1, 2, 3, 4].map((bedNum, idx) => {
    const isOcc = occupiedBeds.includes(idx);
    const occ   = isOcc ? nextOcc() : null;
    return {
      id:           `${id}-b${bedNum}`,
      roomId:       id,
      bedNumber:    bedNum,
      status:       isOcc ? "occupied" : "available",
      occupantName: occ ? occ.name : "",
      occupantRoll: occ ? occ.roll : "",
    };
  });
  return {
    room: { id, roomNumber, year, block, floor, capacity: 4 },
    beds,
  };
}

// ── Define all rooms ─────────────────────────────────────────────
const ALL_ROOMS_DEFS = [
  // ── FIRST YEAR ── Block A ────────────────────────────────────
  generateRoom("y1-a101", "101", "First Year",  "A", 1, [0,1]),
  generateRoom("y1-a102", "102", "First Year",  "A", 1, [0,1,2]),
  generateRoom("y1-a103", "103", "First Year",  "A", 1, [0,1,2,3]),   // full
  generateRoom("y1-a104", "104", "First Year",  "A", 2, []),
  generateRoom("y1-a105", "105", "First Year",  "A", 2, [0]),
  generateRoom("y1-a106", "106", "First Year",  "A", 2, [0,1,2,3]),   // full
  // ── FIRST YEAR ── Block B ────────────────────────────────────
  generateRoom("y1-b201", "201", "First Year",  "B", 1, [0,1]),
  generateRoom("y1-b202", "202", "First Year",  "B", 1, [0,1,2]),
  generateRoom("y1-b203", "203", "First Year",  "B", 2, [2,3]),
  generateRoom("y1-b204", "204", "First Year",  "B", 2, [0,1,2,3]),   // full
  generateRoom("y1-b205", "205", "First Year",  "B", 3, []),
  generateRoom("y1-b206", "206", "First Year",  "B", 3, [0,2]),

  // ── SECOND YEAR ── Block C ───────────────────────────────────
  generateRoom("y2-c101", "101", "Second Year", "C", 1, [0]),
  generateRoom("y2-c102", "102", "Second Year", "C", 1, [0,1]),
  generateRoom("y2-c103", "103", "Second Year", "C", 1, [0,1,2,3]),   // full
  generateRoom("y2-c104", "104", "Second Year", "C", 2, []),
  generateRoom("y2-c105", "105", "Second Year", "C", 2, [0,1]),
  generateRoom("y2-c106", "106", "Second Year", "C", 2, [0,1,2]),
  // ── SECOND YEAR ── Block D ───────────────────────────────────
  generateRoom("y2-d201", "201", "Second Year", "D", 1, [0,1,2,3]),   // full
  generateRoom("y2-d202", "202", "Second Year", "D", 1, [0,2]),
  generateRoom("y2-d203", "203", "Second Year", "D", 2, [0]),
  generateRoom("y2-d204", "204", "Second Year", "D", 3, [0,1,2,3]),   // full
  generateRoom("y2-d205", "205", "Second Year", "D", 3, []),
  generateRoom("y2-d206", "206", "Second Year", "D", 3, [0,3]),

  // ── THIRD YEAR ── Block E ────────────────────────────────────
  generateRoom("y3-e101", "101", "Third Year",  "E", 1, [0,1,2]),
  generateRoom("y3-e102", "102", "Third Year",  "E", 1, []),
  generateRoom("y3-e103", "103", "Third Year",  "E", 1, [0,1,2,3]),   // full
  generateRoom("y3-e104", "104", "Third Year",  "E", 2, [0,2]),
  generateRoom("y3-e105", "105", "Third Year",  "E", 2, [0,1]),
  generateRoom("y3-e106", "106", "Third Year",  "E", 2, [0,1,2,3]),   // full
  // ── THIRD YEAR ── Block F ────────────────────────────────────
  generateRoom("y3-f201", "201", "Third Year",  "F", 1, [0,1]),
  generateRoom("y3-f202", "202", "Third Year",  "F", 1, [0,1,2]),
  generateRoom("y3-f203", "203", "Third Year",  "F", 2, [1,3]),
  generateRoom("y3-f204", "204", "Third Year",  "F", 2, [0,1,2,3]),   // full
  generateRoom("y3-f205", "205", "Third Year",  "F", 3, []),
  generateRoom("y3-f206", "206", "Third Year",  "F", 3, [0]),

  // ── FOURTH YEAR ── Block G ───────────────────────────────────
  generateRoom("y4-g101", "101", "Fourth Year", "G", 1, []),
  generateRoom("y4-g102", "102", "Fourth Year", "G", 1, [0,1]),
  generateRoom("y4-g103", "103", "Fourth Year", "G", 1, [0,1,2,3]),   // full
  generateRoom("y4-g104", "104", "Fourth Year", "G", 2, [0,3]),
  generateRoom("y4-g105", "105", "Fourth Year", "G", 2, [0]),
  generateRoom("y4-g106", "106", "Fourth Year", "G", 2, [0,1,2,3]),   // full
  // ── FOURTH YEAR ── Block H ───────────────────────────────────
  generateRoom("y4-h201", "201", "Fourth Year", "H", 1, [0,1,2]),
  generateRoom("y4-h202", "202", "Fourth Year", "H", 1, []),
  generateRoom("y4-h203", "203", "Fourth Year", "H", 2, [0,2]),
  generateRoom("y4-h204", "204", "Fourth Year", "H", 3, [0,1,2,3]),   // full
  generateRoom("y4-h205", "205", "Fourth Year", "H", 3, [1,3]),
  generateRoom("y4-h206", "206", "Fourth Year", "H", 3, [0]),
];

// ── Flatten into rooms[] and beds[] arrays ───────────────────────
const INITIAL_ROOMS = ALL_ROOMS_DEFS.map(d => d.room);
const INITIAL_BEDS  = ALL_ROOMS_DEFS.flatMap(d => d.beds);

// ── Seed localStorage (only on first visit) ──────────────────────
(function seedStorage() {
  if (!localStorage.getItem("hostel_rooms")) {
    localStorage.setItem("hostel_rooms", JSON.stringify(INITIAL_ROOMS));
  }
  if (!localStorage.getItem("hostel_beds")) {
    localStorage.setItem("hostel_beds", JSON.stringify(INITIAL_BEDS));
  }
  if (!localStorage.getItem("hostel_bookings")) {
    localStorage.setItem("hostel_bookings", JSON.stringify([]));
  }
})();

// ── Data access helpers ──────────────────────────────────────────
const DataStore = {
  getRooms()   { return JSON.parse(localStorage.getItem("hostel_rooms"))    || []; },
  getBeds()    { return JSON.parse(localStorage.getItem("hostel_beds"))     || []; },
  getBookings(){ return JSON.parse(localStorage.getItem("hostel_bookings")) || []; },

  getRoomsForYear(year) {
    return this.getRooms().filter(r => r.year === year);
  },

  getBedsForRoom(roomId) {
    return this.getBeds().filter(b => b.roomId === roomId);
  },

  getRoomById(roomId) {
    return this.getRooms().find(r => r.id === roomId) || null;
  },

  getBedById(bedId) {
    return this.getBeds().find(b => b.id === bedId) || null;
  },

  // Returns count of occupied beds for a room
  occupiedCount(roomId) {
    return this.getBedsForRoom(roomId).filter(b => b.status === "occupied").length;
  },

  // Book a bed: update beds array in localStorage
  bookBed(bedId, user) {
    const beds = this.getBeds();
    const idx  = beds.findIndex(b => b.id === bedId);
    if (idx === -1) return false;
    beds[idx].status       = "occupied";
    beds[idx].occupantName = user.name;
    beds[idx].occupantRoll = user.roll;
    localStorage.setItem("hostel_beds", JSON.stringify(beds));

    // Also save to bookings
    const bookings = this.getBookings();
    const bed      = beds[idx];
    const room     = this.getRoomById(bed.roomId);
    bookings.push({
      id:        `bk-${Date.now()}`,
      bedId,
      roomId:    bed.roomId,
      roomNumber: room ? room.roomNumber : "",
      year:      room ? room.year : "",
      block:     room ? room.block : "",
      floor:     room ? room.floor : "",
      bedNumber: bed.bedNumber,
      studentName: user.name,
      studentRoll: user.roll,
      bookedAt:  new Date().toISOString(),
    });
    localStorage.setItem("hostel_bookings", JSON.stringify(bookings));
    return true;
  },

  // Get active booking for logged-in user
  getMyBooking(roll) {
    return this.getBookings().find(b => b.studentRoll === roll) || null;
  },

  // Reset all data to initial state (for testing)
  reset() {
    localStorage.removeItem("hostel_rooms");
    localStorage.removeItem("hostel_beds");
    localStorage.removeItem("hostel_bookings");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("selectedYear");
    localStorage.removeItem("selectedRoom");
    location.href = "index.html";
  },
};
