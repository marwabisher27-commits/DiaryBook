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
}

function logout() {
  localStorage.removeItem("loggedIn");
  location.reload();
}

function openDay(dayName) {
  localStorage.setItem("selectedDay", dayName);
  alert("Next step: open planner for " + dayName);
}