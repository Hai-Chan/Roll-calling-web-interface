let empCount = 0;
let maxEmp = 8;
let daysInMonth = 31;
let weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

let scheduleData = [];

/* ---------------- TIME PICKER STATE ---------------- */
let activeTimeInput = null;
let pickerMode = "hour";
let pickerHour = 7;
let pickerMinute = 0;
let pickerAmPm = "AM";
let isDraggingClock = false;

/* ---------------- EMPLOYEE UI ---------------- */
function addEmployee() {
  if (empCount >= maxEmp) {
    alert("Reached maximum 8 employees.");
    return;
  }

  empCount += 1;

  let div = document.createElement("div");
  div.className = "employee-card";

  let dayCheckboxes = weekDays
    .map(function (d) {
      return '<label class="checkbox-label"><input type="checkbox" value="' + d + '" /> ' + d + "</label>";
    })
    .join("");

  div.innerHTML = `
    <h3>Employee #${empCount}</h3>

    <div class="form-group">
      <label>Employee Name</label>
      <input type="text" class="emp-name" placeholder="Vd: Nguyen Van A" />
    </div>

    <div class="form-group">
      <label>Shift 1 (In - Out)</label>
      <div class="time-row">
        <input type="text" class="s1start time-picker" placeholder="07:00 AM" readonly />
        <span>to</span>
        <input type="text" class="s1end time-picker" placeholder="05:00 PM" readonly />
      </div>
    </div>

    <div class="form-group">
      <label>Shift 2 (Optional)</label>
      <div class="time-row">
        <input type="text" class="s2start time-picker" placeholder="--:--" readonly />
        <span>to</span>
        <input type="text" class="s2end time-picker" placeholder="--:--" readonly />
      </div>
    </div>

    <div class="form-group">
      <label>Days Off</label>
      <div class="days-grid">
        ${dayCheckboxes}
      </div>
    </div>
  `;

  document.getElementById("employees").appendChild(div);
  bindTimePickers(div);
}

function bindTimePickers(scope) {
  let inputs = scope.querySelectorAll(".time-picker");

  inputs.forEach(function (input) {
    input.addEventListener("click", function () {
      openTimePicker(input);
    });
  });
}

/* ---------------- TIME PICKER OPEN/CLOSE ---------------- */
function openTimePicker(input) {
  activeTimeInput = input;

  let parsed = parseTimeValue(input.value);
  pickerHour = parsed.hour;
  pickerMinute = parsed.minute;
  pickerAmPm = parsed.ampm;
  pickerMode = "hour";

  updateDigitalDisplay();
  renderClockFace();
  updateClockVisual();
  updatePickerHint();

  document.getElementById("timePickerModal").classList.remove("hidden");
}

function closeTimePicker() {
  document.getElementById("timePickerModal").classList.add("hidden");
  isDraggingClock = false;
  activeTimeInput = null;
}

function parseTimeValue(value) {
  if (!value || value === "--:--") {
    return {
      hour: 7,
      minute: 0,
      ampm: "AM"
    };
  }

  let match = value.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);

  if (!match) {
    return {
      hour: 7,
      minute: 0,
      ampm: "AM"
    };
  }

  let hour = parseInt(match[1], 10);
  let minute = parseInt(match[2], 10);
  let ampm = (match[3] || "AM").toUpperCase();

  if (hour < 1 || hour > 12) {
    hour = 7;
  }

  if (minute < 0 || minute > 59) {
    minute = 0;
  }

  return {
    hour: hour,
    minute: minute,
    ampm: ampm
  };
}

/* ---------------- DISPLAY ---------------- */
function updateDigitalDisplay() {
  let displayHour = document.getElementById("displayHour");
  let displayMinute = document.getElementById("displayMinute");
  let amBtn = document.getElementById("amBtn");
  let pmBtn = document.getElementById("pmBtn");

  displayHour.textContent = String(pickerHour).padStart(2, "0");
  displayMinute.textContent = String(pickerMinute).padStart(2, "0");

  displayHour.classList.toggle("active", pickerMode === "hour");
  displayMinute.classList.toggle("active", pickerMode === "minute");

  amBtn.classList.toggle("active", pickerAmPm === "AM");
  pmBtn.classList.toggle("active", pickerAmPm === "PM");
}

function updatePickerHint() {
  let hint = document.getElementById("pickerHintText");

  if (pickerMode === "hour") {
    hint.textContent = "Select hour by dragging or clicking on the clock face";
  } else {
    hint.textContent = "Select minute by dragging or clicking on the clock face";
  }
}

/* ---------------- CLOCK RENDER ---------------- */
function renderClockFace() {
  let dial = document.getElementById("clockDial");
  let oldLabels = dial.querySelectorAll(".clock-label");

  oldLabels.forEach(function (label) {
    label.remove();
  });

  if (pickerMode === "hour") {
    renderHourLabels();
  } else {
    renderMinuteLabels();
  }
}

function renderHourLabels() {
  let dial = document.getElementById("clockDial");
  let radius = 126;
  let center = 150;

  for (let i = 1; i <= 12; i += 1) {
    let angleDeg = i * 30 - 90;
    let angleRad = angleDeg * Math.PI / 180;
    let x = center + Math.cos(angleRad) * radius;
    let y = center + Math.sin(angleRad) * radius;

    let label = document.createElement("button");
    label.type = "button";
    label.className = "clock-label" + (pickerHour === i ? " selected" : "");
    label.textContent = i;
    label.style.left = x + "px";
    label.style.top = y + "px";

    label.addEventListener("click", function () {
      pickerHour = i;
      updateDigitalDisplay();
      updateClockVisual();

      setTimeout(function () {
        pickerMode = "minute";
        updateDigitalDisplay();
        renderClockFace();
        updateClockVisual();
        updatePickerHint();
      }, 120);
    });

    dial.appendChild(label);
  }
}

function renderMinuteLabels() {
  let dial = document.getElementById("clockDial");
  let radius = 126;
  let center = 150;

  for (let i = 0; i < 60; i += 5) {
    let angleDeg = i * 6 - 90;
    let angleRad = angleDeg * Math.PI / 180;
    let x = center + Math.cos(angleRad) * radius;
    let y = center + Math.sin(angleRad) * radius;

    let label = document.createElement("button");
    label.type = "button";
    label.className = "clock-label" + (pickerMinute === i ? " selected" : "");
    label.textContent = String(i).padStart(2, "0");
    label.style.left = x + "px";
    label.style.top = y + "px";

    label.addEventListener("click", function () {
      pickerMinute = i;
      updateDigitalDisplay();
      renderClockFace();
      updateClockVisual();
    });

    dial.appendChild(label);
  }
}

function updateClockVisual() {
  let hand = document.getElementById("clockHand");
  let knob = document.getElementById("clockKnob");

  let center = 150;
  let radius = 118;
  let angleDeg = 0;
  let knobLabel = "";

  if (pickerMode === "hour") {
    angleDeg = pickerHour * 30 - 90;
    knobLabel = String(pickerHour);
  } else {
    angleDeg = pickerMinute * 6 - 90;
    knobLabel = String(pickerMinute).padStart(2, "0");
  }

  let angleRad = angleDeg * Math.PI / 180;
  let x = center + Math.cos(angleRad) * radius;
  let y = center + Math.sin(angleRad) * radius;

  hand.style.width = radius + "px";
  hand.style.transform = "translateY(-50%) rotate(" + angleDeg + "deg)";

  knob.style.left = x + "px";
  knob.style.top = y + "px";
  knob.textContent = knobLabel;
}

/* ---------------- DRAG LOGIC ---------------- */
function getDialDataFromPoint(clientX, clientY) {
  let dial = document.getElementById("clockDial");
  let rect = dial.getBoundingClientRect();
  let centerX = rect.left + rect.width / 2;
  let centerY = rect.top + rect.height / 2;

  let dx = clientX - centerX;
  let dy = clientY - centerY;

  let angle = Math.atan2(dy, dx) * 180 / Math.PI;
  let adjusted = angle + 90;

  if (adjusted < 0) {
    adjusted += 360;
  }

  return {
    angle: adjusted,
    dx: dx,
    dy: dy
  };
}

function applyDialSelectionFromPoint(clientX, clientY) {
  let dialData = getDialDataFromPoint(clientX, clientY);
  let angle = dialData.angle;

  if (pickerMode === "hour") {
    let rawHour = Math.round(angle / 30);
    if (rawHour === 0) {
      rawHour = 12;
    }
    if (rawHour > 12) {
      rawHour = 12;
    }

    pickerHour = rawHour;
    updateDigitalDisplay();
    renderClockFace();
    updateClockVisual();
  } else {
    let rawMinute = Math.round(angle / 6);
    if (rawMinute === 60) {
      rawMinute = 0;
    }

    pickerMinute = rawMinute;
    updateDigitalDisplay();
    renderClockFace();
    updateClockVisual();
  }
}

function onDialPointerDown(e) {
  isDraggingClock = true;

  let point = getEventPoint(e);
  applyDialSelectionFromPoint(point.x, point.y);

  if (e.cancelable) {
    e.preventDefault();
  }
}

function onDialPointerMove(e) {
  if (!isDraggingClock) {
    return;
  }

  let point = getEventPoint(e);
  applyDialSelectionFromPoint(point.x, point.y);

  if (e.cancelable) {
    e.preventDefault();
  }
}

function onDialPointerUp() {
  if (!isDraggingClock) {
    return;
  }

  isDraggingClock = false;

  if (pickerMode === "hour") {
    setTimeout(function () {
      pickerMode = "minute";
      updateDigitalDisplay();
      renderClockFace();
      updateClockVisual();
      updatePickerHint();
    }, 100);
  }
}

function getEventPoint(e) {
  if (e.touches && e.touches.length > 0) {
    return {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  }

  if (e.changedTouches && e.changedTouches.length > 0) {
    return {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    };
  }

  return {
    x: e.clientX,
    y: e.clientY
  };
}

/* ---------------- TIME FORMATTING ---------------- */
function formatPickedTime() {
  return String(pickerHour).padStart(2, "0") + ":" + String(pickerMinute).padStart(2, "0") + " " + pickerAmPm;
}

function convertTo24Hour(time12h) {
  if (!time12h || time12h === "--:--") {
    return "";
  }

  let match = time12h.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (!match) {
    return "";
  }

  let hour = parseInt(match[1], 10);
  let minute = match[2];
  let ampm = match[3].toUpperCase();

  if (ampm === "AM" && hour === 12) {
    hour = 0;
  } else if (ampm === "PM" && hour !== 12) {
    hour += 12;
  }

  return String(hour).padStart(2, "0") + ":" + minute;
}

/* ---------------- PICKER EVENTS ---------------- */
function bindGlobalTimePickerEvents() {
  let displayHour = document.getElementById("displayHour");
  let displayMinute = document.getElementById("displayMinute");
  let amBtn = document.getElementById("amBtn");
  let pmBtn = document.getElementById("pmBtn");
  let cancelBtn = document.getElementById("cancelTimePicker");
  let confirmBtn = document.getElementById("confirmTimePicker");
  let modal = document.getElementById("timePickerModal");
  let dial = document.getElementById("clockDial");

  displayHour.addEventListener("click", function () {
    pickerMode = "hour";
    updateDigitalDisplay();
    renderClockFace();
    updateClockVisual();
    updatePickerHint();
  });

  displayMinute.addEventListener("click", function () {
    pickerMode = "minute";
    updateDigitalDisplay();
    renderClockFace();
    updateClockVisual();
    updatePickerHint();
  });

  amBtn.addEventListener("click", function () {
    pickerAmPm = "AM";
    updateDigitalDisplay();
  });

  pmBtn.addEventListener("click", function () {
    pickerAmPm = "PM";
    updateDigitalDisplay();
  });

  cancelBtn.addEventListener("click", function () {
    closeTimePicker();
  });

  confirmBtn.addEventListener("click", function () {
    if (activeTimeInput) {
      activeTimeInput.value = formatPickedTime();
    }
    closeTimePicker();
  });

  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeTimePicker();
    }
  });

  dial.addEventListener("mousedown", onDialPointerDown);
  dial.addEventListener("touchstart", onDialPointerDown, { passive: false });

  window.addEventListener("mousemove", onDialPointerMove);
  window.addEventListener("touchmove", onDialPointerMove, { passive: false });

  window.addEventListener("mouseup", onDialPointerUp);
  window.addEventListener("touchend", onDialPointerUp);
}

/* ---------------- SCHEDULE LOGIC ---------------- */
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shiftTime(time, offset) {
  if (!time) {
    return "";
  }

  let parts = time.split(":").map(Number);
  let h = parts[0];
  let m = parts[1];
  let total = h * 60 + m + offset;

  if (total < 0) {
    total = 0;
  }

  let nh = Math.floor(total / 60) % 24;
  let nm = total % 60;

  return String(nh).padStart(2, "0") + ":" + String(nm).padStart(2, "0");
}

function generateOffsets() {
  let offsets = Array(daysInMonth).fill(null);

  for (let block = 0; block < daysInMonth; block += 10) {
    let extremeDays = [];
    let blockEnd = Math.min(block + 10, daysInMonth);

    while (extremeDays.length < 2 && Math.random() < 0.7) {
      let d = rand(block, blockEnd - 1);
      if (!extremeDays.includes(d)) {
        extremeDays.push(d);
      }
    }

    for (let i = block; i < blockEnd; i += 1) {
      if (extremeDays.includes(i)) {
        offsets[i] = Math.random() < 0.5 ? -120 : 120;
      } else {
        offsets[i] = rand(-10, 10);
      }
    }
  }

  for (let i = 2; i < offsets.length; i += 1) {
    if (offsets[i] === offsets[i - 1] && offsets[i] === offsets[i - 2]) {
      offsets[i] += rand(-5, 5);

      if (offsets[i] === offsets[i - 1]) {
        offsets[i] += 1;
      }
    }
  }

  return offsets;
}

function validExtreme(startTime, offset) {
  if (!startTime) {
    return true;
  }

  let time24 = convertTo24Hour(startTime);

  if (!time24) {
    return true;
  }

  let parts = time24.split(":").map(Number);
  let h = parts[0];
  let nh = h + offset / 60;

  return nh >= 8 && nh <= 23;
}

function generate() {
  let out = document.getElementById("output");
  out.innerHTML = "";
  scheduleData = [];

  let employeeCards = document.querySelectorAll(".employee-card");

  if (employeeCards.length === 0) {
    out.innerHTML = '<p class="placeholder-text">No employees added.</p>';
    return;
  }

  employeeCards.forEach(function (emp) {
    let name = emp.querySelector(".emp-name").value || "No name set";
    let s1sDisplay = emp.querySelector(".s1start").value;
    let s1eDisplay = emp.querySelector(".s1end").value;
    let s2sDisplay = emp.querySelector(".s2start").value;
    let s2eDisplay = emp.querySelector(".s2end").value;

    let s1s = convertTo24Hour(s1sDisplay);
    let s1e = convertTo24Hour(s1eDisplay);
    let s2s = convertTo24Hour(s2sDisplay);
    let s2e = convertTo24Hour(s2eDisplay);

    let off = Array.from(emp.querySelectorAll('input[type="checkbox"]:checked')).map(function (c) {
      return c.value;
    });

    let offsets = generateOffsets();
    let empRows = [];

    let tableHTML = `
      <table class="schedule-table">
        <thead>
          <tr class="emp-header">
            <th colspan="5">${name}</th>
          </tr>
          <tr>
            <th>Day</th>
            <th>Shift 1 In</th>
            <th>Shift 1 Out</th>
            <th>Shift 2 In</th>
            <th>Shift 2 Out</th>
          </tr>
        </thead>
        <tbody>
    `;

    for (let d = 1; d <= daysInMonth; d += 1) {
      let weekday = weekDays[(d - 1) % 7];
      let offset = offsets[d - 1];

      let rowData = {
        day: d,
        weekday: weekday,
        s1_in: "-",
        s1_out: "-",
        s2_in: "-",
        s2_out: "-",
        isOff: false
      };

      if (off.includes(weekday)) {
        rowData.isOff = true;
        tableHTML += '<tr class="day-off"><td>' + d + " (" + weekday + ')</td><td colspan="4">OFF</td></tr>';
        empRows.push(rowData);
      } else {
        if (Math.abs(offset) === 120) {
          let s1Valid = !s1s || validExtreme(s1sDisplay, offset);
          let s2Valid = !s2s || validExtreme(s2sDisplay, offset);

          if (!s1Valid || !s2Valid) {
            offset = rand(-10, 10);
          }
        }

        if (s1s && s1e) {
          rowData.s1_in = shiftTime(s1s, offset);
          rowData.s1_out = shiftTime(s1e, offset);
        }

        if (s2s && s2e) {
          rowData.s2_in = shiftTime(s2s, offset);
          rowData.s2_out = shiftTime(s2e, offset);
        }

        tableHTML += '<tr><td>' + d + ' <span style="color:#555; font-size:0.8em">(' + weekday + ")</span></td>";
        tableHTML += "<td>" + rowData.s1_in + "</td><td>" + rowData.s1_out + "</td>";
        tableHTML += "<td>" + rowData.s2_in + "</td><td>" + rowData.s2_out + "</td></tr>";

        empRows.push(rowData);
      }
    }

    tableHTML += "</tbody></table><br><br>";
    out.innerHTML += tableHTML;

    scheduleData.push({
      name: name,
      rows: empRows
    });
  });
}

function exportToExcel() {
  if (scheduleData.length === 0) {
    alert("Click 'Generate Schedule' before exporting to Excel.");
    return;
  }

  let wb = XLSX.utils.book_new();
  let usedSheetNames = new Set();

  scheduleData.forEach(function (emp, index) {
    let wsData = [
      [emp.name],
      ["Day", "Day of Week", "Shift 1 In", "Shift 1 Out", "Shift 2 In", "Shift 2 Out"]
    ];

    emp.rows.forEach(function (r) {
      if (r.isOff) {
        wsData.push([r.day, r.weekday, " ", " ", " ", " "]);
      } else {
        wsData.push([r.day, r.weekday, r.s1_in, r.s1_out, r.s2_in, r.s2_out]);
      }
    });

    let ws = XLSX.utils.aoa_to_sheet(wsData);

    let baseName = emp.name.replace(/[\\/?*$:]/g, "").trim();

    if (!baseName) {
      baseName = "NV_" + (index + 1);
    }

    baseName = baseName.substring(0, 31);

    let sheetName = baseName;
    let counter = 1;

    while (usedSheetNames.has(sheetName)) {
      let suffix = "_" + counter;
      let spaceLeft = 31 - suffix.length;
      sheetName = baseName.substring(0, spaceLeft) + suffix;
      counter += 1;
    }

    usedSheetNames.add(sheetName);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  });

  XLSX.writeFile(wb, "Lich_Lam_Viec.xlsx");
}

bindGlobalTimePickerEvents();