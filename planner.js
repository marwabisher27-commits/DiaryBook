const selectedDay = localStorage.getItem("selectedDay") || "Today";
document.getElementById("dayTitle").innerText = selectedDay + " Planner 🌸";

const plannerList = document.getElementById("plannerList");

function createPlanner() {
  plannerList.innerHTML = "";

  for (let hour = 0; hour < 24; hour++) {
    createTimeRow(hour, "00");
    createTimeRow(hour, "30");
  }
}

function createTimeRow(hour, minutes) {
  const time = hour.toString().padStart(2, "0") + ":" + minutes;
  const key = selectedDay + "-" + time;

  const savedNote = localStorage.getItem(key + "-note") || "";
  const preview = savedNote ? savedNote.substring(0, 35) : "No note yet";

  const row = document.createElement("div");
  row.className = "time-row";

  if (savedNote) {
    row.classList.add("has-note");
  }

  row.innerHTML = `
    <div class="row-time">${time}</div>
    <div class="row-preview">${preview}</div>
    <div class="row-arrow">›</div>
  `;

  row.onclick = function () {
    openSlot(time);
  };

  plannerList.appendChild(row);
}

function openSlot(time) {
  const key = selectedDay + "-" + time;
  const savedNote = localStorage.getItem(key + "-note") || "";
  const savedImage = localStorage.getItem(key + "-image") || "";

  plannerList.innerHTML = `
    <div class="time-card big-card">
      <h2>${time}</h2>

      <textarea id="noteInput" placeholder="Write your note...">${savedNote}</textarea>

      <input type="file" accept="image/*" id="imageInput">

      <div id="imageBox" class="image-box">
        ${savedImage ? `<img src="${savedImage}">` : ""}
      </div>

      <button class="save-btn" onclick="saveSlot('${key}', '${time}')">Save</button>
      <button class="bell-btn" onclick="setReminder('${time}')">🔔 Reminder</button>
      <button class="back-list-btn" onclick="createPlanner()">Back to hours</button>
    </div>
  `;

  document.getElementById("imageInput").onchange = function () {
    saveImage(key, this);
  };
}

function saveSlot(key, time) {
  const note = document.getElementById("noteInput").value;
  localStorage.setItem(key + "-note", note);

  alert("Saved " + time);
  createPlanner();
}

function saveImage(key, input) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function () {
    localStorage.setItem(key + "-image", reader.result);
    document.getElementById("imageBox").innerHTML = `<img src="${reader.result}">`;
  };

  reader.readAsDataURL(file);
}

function setReminder(time) {
  alert("Reminder saved for " + selectedDay + " at " + time);
}

function goBack() {
  localStorage.setItem("goToDays", "true");
  window.location.href = "index.html";
}

createPlanner();