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

  const savedImage = localStorage.getItem(key + "-image") || "";
  const savedReminder = localStorage.getItem(key + "-reminder") || "";
  const tasks = getTasks(key);

  const tasksPreview = tasks.length > 0
    ? tasks.map(t => `${t.done ? "✅" : "⬜"} ${t.text}`).join("<br>")
    : "No note yet";

  const row = document.createElement("div");
  row.className = "time-row";

  if (tasks.length > 0 || savedImage || savedReminder) {
    row.classList.add("has-note");
  }

  row.innerHTML = `
    <div class="row-time">${time}</div>

    <div class="row-preview">
      ${tasksPreview}
      ${savedImage ? `<br><span class="img-label">📷 Image added</span>` : ""}
      ${savedReminder ? `<br><span class="reminder-label">🔔 Reminder on</span>` : ""}
    </div>

    <div class="row-arrow">›</div>
  `;

  row.onclick = function () {
    openSlot(time);
  };

  plannerList.appendChild(row);
}

function openSlot(time) {
  const key = selectedDay + "-" + time;
  const savedImage = localStorage.getItem(key + "-image") || "";

  plannerList.innerHTML = `
    <div class="time-card big-card">
      <h2>${time}</h2>

      <div id="tasksBox"></div>

      <div class="add-task-box">
        <input type="text" id="taskInput" placeholder="Write task...">
        <button onclick="addTask('${key}')">+</button>
      </div>

      <input type="file" accept="image/*" id="imageInput">

      <div id="imageBox" class="image-box">
      ${savedImage ? `<img src="${savedImage}" onclick="openImageFull('${savedImage}')"><button class="delete-img-btn" onclick="deleteImage('${key}')">Delete Image</button>` : ""}      </div>

      <div class="card-actions">
        <button class="save-btn" onclick="createPlanner()">Save</button>
        <button class="delete-slot-btn" onclick="deleteSlot('${key}')">Delete Note</button>

        ${localStorage.getItem(key + "-reminder") === "true"
          ? `<button class="reminder-on-btn">✅ Reminder On</button>
             <button class="remove-reminder-btn" onclick="removeReminder('${key}', '${time}')">Remove Reminder</button>`
          : `<button class="bell-btn" onclick="setReminder('${key}', '${time}')">🔔 Add Reminder</button>`
        }

        <button class="back-list-btn" onclick="createPlanner()">Back to hours</button>
      </div>
    </div>
  `;

  loadTasks(key);

  document.getElementById("imageInput").onchange = function () {
    saveImage(key, this);
  };
}

function getTasks(key) {
  return JSON.parse(localStorage.getItem(key + "-tasks")) || [];
}

function saveTasks(key, tasks) {
  localStorage.setItem(key + "-tasks", JSON.stringify(tasks));
}

function loadTasks(key) {
  const tasksBox = document.getElementById("tasksBox");
  const tasks = getTasks(key);

  tasksBox.innerHTML = "";

  if (tasks.length === 0) {
    tasksBox.innerHTML = `<p class="no-tasks">No tasks yet</p>`;
    return;
  }

  tasks.forEach((task, index) => {
    tasksBox.innerHTML += `
      <label class="task-item">
        <input type="checkbox" ${task.done ? "checked" : ""} onchange="toggleTask('${key}', ${index})">
        <span class="${task.done ? "done-task" : ""}">${task.text}</span>
        <button class="edit-task-btn" onclick="editTask('${key}', ${index})" type="button">✏</button>
        <button class="small-delete" onclick="deleteTask('${key}', ${index})" type="button">×</button>
      </label>
    `;
  });
}

function addTask(key) {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();

  if (text === "") return;

  const tasks = getTasks(key);
  tasks.push({ text: text, done: false });

  saveTasks(key, tasks);
  input.value = "";
  loadTasks(key);
}

function toggleTask(key, index) {
  const tasks = getTasks(key);
  tasks[index].done = !tasks[index].done;
  saveTasks(key, tasks);
  loadTasks(key);
}

function deleteTask(key, index) {
  const tasks = getTasks(key);
  tasks.splice(index, 1);
  saveTasks(key, tasks);
  loadTasks(key);
}

function saveImage(key, input) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function () {
    localStorage.setItem(key + "-image", reader.result);
    document.getElementById("imageBox").innerHTML =
      `<img src="${reader.result}" onclick="openImageFull('${reader.result}')">
       <button class="delete-img-btn" onclick="deleteImage('${key}')">Delete Image</button>`;
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

function removeReminder(key, time) {
  localStorage.removeItem(key + "-reminder");
  showMessage("Reminder removed");
  openSlot(time);
}

function deleteSlot(key) {
  localStorage.removeItem(key + "-tasks");
  localStorage.removeItem(key + "-image");
  localStorage.removeItem(key + "-reminder");

  showMessage("Deleted successfully 🗑️");
  createPlanner();
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

function saveMood(mood) {
  localStorage.setItem(selectedDay + "-mood", mood);
  document.getElementById("selectedMood").innerText = "Today mood: " + mood;
}

function loadMood() {
  const mood = localStorage.getItem(selectedDay + "-mood");
  if (mood) {
    document.getElementById("selectedMood").innerText = "Today mood: " + mood;
  }
}

function exportDayPDF() {
  window.print();
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("darkMode", "true");
  } else {
    localStorage.setItem("darkMode", "false");
  }
}

function goBack() {
  localStorage.setItem("goToDays", "true");
  window.location.href = "index.html";
}

if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
}


function editTask(key, index) {
  const tasks = getTasks(key);

  const popup = document.createElement("div");
  popup.className = "edit-popup";

  popup.innerHTML = `
    <div class="edit-box">
      <h3>Edit Task ✏️</h3>
      <input type="text" id="editInput" value="${tasks[index].text}">
      <div>
        <button onclick="saveEditedTask('${key}', ${index})">Save</button>
        <button onclick="this.closest('.edit-popup').remove()">Cancel</button>
      </div>
    </div>
  `;

  document.body.appendChild(popup);
}
function saveEditedTask(key, index) {
  const tasks = getTasks(key);
  const input = document.getElementById("editInput");

  if (input.value.trim() === "") {
    showMessage("Task cannot be empty");
    return;
  }

  tasks[index].text = input.value.trim();
  saveTasks(key, tasks);

  document.querySelector(".edit-popup").remove();
  loadTasks(key);
}

function openImageFull(src) {
  const overlay = document.createElement("div");
  overlay.className = "image-overlay";
  overlay.innerHTML = `
    <button class="close-image" onclick="this.parentElement.remove()">×</button>
    <img src="${src}">
  `;
  document.body.appendChild(overlay);
}
createPlanner();
loadMood();