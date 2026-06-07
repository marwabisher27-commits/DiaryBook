const selectedDay = localStorage.getItem("selectedDay") || "Today";
document.getElementById("dayTitle").innerText = selectedDay + " Planner 🌸";

const plannerList = document.getElementById("plannerList");

function createPlanner() {
  plannerList.innerHTML = "";

  for (let hour = 0; hour < 24; hour++) {
    createSlot(hour, "00");
    createSlot(hour, "30");
  }
}

function createSlot(hour, minutes) {
  const time =
    hour.toString().padStart(2, "0") + ":" + minutes;

  const key = selectedDay + "-" + time;

  const card = document.createElement("div");
  card.className = "time-card";

  card.innerHTML = `
    <div class="time">${time}</div>

    <textarea 
      placeholder="Write your note..."
      oninput="saveNote('${key}', this.value)"
    >${localStorage.getItem(key + "-note") || ""}</textarea>

    <input type="file" accept="image/*" onchange="saveImage('${key}', this)">

    <div id="${key}-image-box" class="image-box"></div>

    <button class="bell-btn" onclick="setReminder('${time}')">🔔 Reminder</button>
  `;

  plannerList.appendChild(card);

  const savedImage = localStorage.getItem(key + "-image");
  if (savedImage) {
    document.getElementById(key + "-image-box").innerHTML =
      `<img src="${savedImage}">`;
  }
}

function saveNote(key, value) {
  localStorage.setItem(key + "-note", value);
}

function saveImage(key, input) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function () {
    localStorage.setItem(key + "-image", reader.result);
    document.getElementById(key + "-image-box").innerHTML =
      `<img src="${reader.result}">`;
  };

  reader.readAsDataURL(file);
}

function setReminder(time) {
  alert("Reminder saved for " + selectedDay + " at " + time);
}

function goBack() {
  window.location.href = "index.html";
}

createPlanner();