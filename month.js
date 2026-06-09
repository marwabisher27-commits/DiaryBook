const monthCalendar = document.getElementById("monthCalendar");
const monthTitle = document.getElementById("monthTitle");

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

monthTitle.innerText = monthNames[month] + " " + year + " 🌸";

function createMonthCalendar() {
  monthCalendar.innerHTML = "";

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  weekDays.forEach(day => {
    const head = document.createElement("div");
    head.className = "calendar-head";
    head.innerText = day;
    monthCalendar.appendChild(head);
  });

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.className = "calendar-empty";
    monthCalendar.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const box = document.createElement("div");
    box.className = "calendar-day";

    if (day === today.getDate()) {
      box.classList.add("today-calendar");
    }

    box.innerText = day;

    box.onclick = function () {
      localStorage.setItem("selectedDay", day + "/" + (month + 1) + "/" + year);
      window.location.href = "planner.html";
    };

    monthCalendar.appendChild(box);
  }
}

function goBack() {
  localStorage.setItem("goToDays", "true");
  window.location.href = "index.html";
}

createMonthCalendar();