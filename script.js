const correctUsername = "marwa";
const correctPassword = "1234";

window.onload = function () {
  if (localStorage.getItem("goToDays") === "true") {
    localStorage.removeItem("goToDays");
    showDaysPage();
  }
};

function login() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  if (username === correctUsername && password === correctPassword) {
    showDaysPage();
  } else {
    document.getElementById("errorMsg").innerText = "Wrong username or password";
  }
}

function showDaysPage() {
  document.getElementById("loginPage").classList.add("hidden");
  document.getElementById("daysPage").classList.remove("hidden");

  createWeekDays();
}

function createWeekDays() {
  const daysContainer = document.querySelector(".days");
  daysContainer.innerHTML = "";

  const today = new Date();
  const currentDayIndex = today.getDay();

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - currentDayIndex);

  const dayNames = [
    "Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday"
  ];

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);

    const btn = document.createElement("button");
    btn.className = "day-btn";

    if (i === currentDayIndex) {
      btn.classList.add("today");
    }

    const formattedDate =
      date.getDate().toString().padStart(2, "0") + "/" +
      (date.getMonth() + 1).toString().padStart(2, "0") + "/" +
      date.getFullYear();

    btn.innerHTML = `<div>${dayNames[i]}<span>${formattedDate}</span></div>`;

    btn.onclick = function () {
      openDay(dayNames[i]);
    };

    daysContainer.appendChild(btn);
  }
}

function logout() {
  document.getElementById("daysPage").classList.add("hidden");
  document.getElementById("loginPage").classList.remove("hidden");

  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
}

function openDay(dayName) {
  localStorage.setItem("selectedDay", dayName);
  window.location.href = "planner.html";
}
function openMonthCalendar() {
  window.location.href = "month.html";
}
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("darkMode", "true");
  } else {
    localStorage.setItem("darkMode", "false");
  }
}

if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
}
function searchNotes() {
  const word = document.getElementById("searchInput").value.toLowerCase();
  const resultsBox = document.getElementById("searchResults");
  resultsBox.innerHTML = "";

  if (word.trim() === "") return;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    if (key.includes("-note")) {
      const note = localStorage.getItem(key);

      if (note.toLowerCase().includes(word)) {
        const item = document.createElement("div");
        item.className = "search-result";
        item.innerText = key.replace("-note", "") + " : " + note;
        resultsBox.appendChild(item);
      }
    }
  }
}