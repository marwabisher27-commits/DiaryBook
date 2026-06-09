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
    const dayKey = dayNames[i];
let hasData = false;

for (let j = 0; j < localStorage.length; j++) {
  const storageKey = localStorage.key(j);
  if (storageKey && storageKey.startsWith(dayKey + "-") &&
      (storageKey.includes("-tasks") || storageKey.includes("-image") || storageKey.includes("-reminder"))) {
    hasData = true;
    break;
  }
}
    btn.className = "day-btn";
if (hasData) {
  btn.classList.add("day-has-data");
}
    if (i === currentDayIndex) {
      btn.classList.add("today");
    }

    const formattedDate =
      date.getDate().toString().padStart(2, "0") + "/" +
      (date.getMonth() + 1).toString().padStart(2, "0") + "/" +
      date.getFullYear();

btn.innerHTML = `<div>${dayNames[i]} ${hasData ? "💗" : ""}<span>${formattedDate}</span></div>`;
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
    const keyword = document
        .getElementById("searchInput")
        .value
        .toLowerCase()
        .trim();

    const resultsBox = document.getElementById("searchResults");

    resultsBox.innerHTML = "";

    if (!keyword) return;

    for (let i = 0; i < localStorage.length; i++) {

        const key = localStorage.key(i);

        if (key.endsWith("-tasks")) {

            const tasks = JSON.parse(localStorage.getItem(key)) || [];

            tasks.forEach(task => {

                if (task.text.toLowerCase().includes(keyword)) {

                    resultsBox.innerHTML += `
                        <div class="search-result">
                            <b>${key.replace("-tasks","")}</b><br>
                            ${task.done ? "✅" : "⬜"} ${task.text}
                        </div>
                    `;
                }
            });
        }
    }

    if (resultsBox.innerHTML === "") {
        resultsBox.innerHTML = `
            <div class="search-result">
                No results found 😔
            </div>
        `;
    }
}
window.searchNotes = function () {
  const input = document.getElementById("searchInput");
  const resultsBox = document.getElementById("searchResults");

  const keyword = input.value.toLowerCase().trim();
  resultsBox.innerHTML = "";

  if (keyword === "") {
    resultsBox.innerHTML = `<div class="search-result">Write something to search 💗</div>`;
    return;
  }

  let found = false;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    if (key.endsWith("-tasks")) {
      const tasks = JSON.parse(localStorage.getItem(key)) || [];

      tasks.forEach(function (task) {
        if (task.text.toLowerCase().includes(keyword)) {
          found = true;

          resultsBox.innerHTML += `
            <div class="search-result">
              <b>${key.replace("-tasks", "")}</b><br>
              ${task.done ? "✅" : "⬜"} ${task.text}
            </div>
          `;
        }
      });
    }
  }

  if (!found) {
    resultsBox.innerHTML = `<div class="search-result">No results found 😔</div>`;
  }
};