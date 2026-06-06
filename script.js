const correctUsername = "marwa";
const correctPassword = "1234";

window.onload = function () {
  if (localStorage.getItem("loggedIn") === "true") {
    showDaysPage();
  }
};

function login() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  if (username === correctUsername && password === correctPassword) {
    localStorage.setItem("loggedIn", "true");
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

    btn.innerHTML = `${dayNames[i]}<br><span>${formattedDate}</span>`;
    btn.onclick = function () {
      openDay(dayNames[i]);
    };

    daysContainer.appendChild(btn);
  }
}

function logout() {
  localStorage.removeItem("loggedIn");
  location.reload();
}

function openDay(dayName) {
  localStorage.setItem("selectedDay", dayName);
  alert("Next step: open planner for " + dayName);
}