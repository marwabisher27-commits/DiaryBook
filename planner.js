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
  const savedImage = localStorage.getItem(key + "-image") || "";
const savedReminder = localStorage.getItem(key + "-reminder") || "";
  const row = document.createElement("div");
  row.className = "time-row";

  if (savedNote.trim() !== "" || savedImage) row.classList.add("has-note");
  row.innerHTML = `
    <div class="row-time">${time}</div>
    <div class="row-preview">
      ${savedNote.trim() !== "" ? savedNote : "No note yet"}
      ${savedImage ? `<br><span class="img-label">📷 Image added</span>` : ""}
      ${savedReminder ? `<br><span class="reminder-label">🔔 Reminder on</span>` : ""}    </div>
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
        ${savedImage ? `<img src="${savedImage}"><button class="delete-img-btn" onclick="deleteImage('${key}')">Delete Image</button>` : ""}
      </div>

      <div class="card-actions">
        <button class="save-btn" onclick="saveSlot('${key}', '${time}')">Save</button>

${localStorage.getItem(key + "-reminder") === "true"
  ? `<button class="reminder-on-btn">✅ Reminder On</button>
     <button class="remove-reminder-btn" onclick="removeReminder('${key}', '${time}')">Remove Reminder</button>`
  : `<button class="bell-btn" onclick="setReminder('${key}', '${time}')">🔔 Add Reminder</button>`
}

<button class="back-list-btn" onclick="createPlanner()">Back to hours</button>
      </div>
    </div>
  `;

  document.getElementById("imageInput").onchange = function () {
    saveImage(key, this);
  };
}

function saveSlot(key, time) {
  const note = document.getElementById("noteInput").value.trim();

  if (note === "") {
    localStorage.removeItem(key + "-note");
  } else {
    localStorage.setItem(key + "-note", note);
  }

  createPlanner();
}

function saveImage(key, input) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function () {
    localStorage.setItem(key + "-image", reader.result);
    document.getElementById("imageBox").innerHTML =
      `<img src="${reader.result}"><button class="delete-img-btn" onclick="deleteImage('${key}')">Delete Image</button>`;
  };

  reader.readAsDataURL(file);
}

function deleteImage(key) {
  localStorage.removeItem(key + "-image");
  document.getElementById("imageBox").innerHTML = "";
}

async function setReminder(key, time) {
  if (!("Notification" in window)) {
    showMessage("Notifications are not supported");
    return;
  }

  const token = await window.requestFirebasePermission();

  if (!token) {
    showMessage("Please allow notifications 🔔");
    return;
  }

  localStorage.setItem(key + "-reminder", "true");

  showMessage("Reminder saved 💗<br>Before 1 hour & before 1 day<br>" + time);

  openSlot(time);
}
function showMessage(text) {
  const msg = document.createElement("div");
  msg.className = "pretty-message";
  msg.innerHTML = text;

  document.body.appendChild(msg);

  setTimeout(() => {
    msg.remove();
  }, 3000);
}
function goBack() {
  localStorage.setItem("goToDays", "true");
  window.location.href = "index.html";
}
function removeReminder(key, time) {
  localStorage.removeItem(key + "-reminder");
  showMessage("Reminder removed");
  openSlot(time);
}
createPlanner();