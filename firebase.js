import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";
import { getDatabase, ref, push, set, get, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyC0mfdioS8eWFcMJs3QrA9EtVfDS2YS6yw",
  authDomain: "diarybook-66e64.firebaseapp.com",
  databaseURL: "https://diarybook-66e64-default-rtdb.firebaseio.com",
  projectId: "diarybook-66e64",
  storageBucket: "diarybook-66e64.firebasestorage.app",
  messagingSenderId: "795103658821",
  appId: "1:795103658821:web:a2fbb9abb806ef6096b42c"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const database = getDatabase(app);

window.requestFirebasePermission = async function () {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  const token = await getToken(messaging, {
    vapidKey: "BGO19k2WnSwoIXMu1US-uk5_egIB0P8j8INe5OzDL0uOq_dnLpCQh_sd75zSOJ1PwUNv15zKmJGlYIaASFUDkBE"
  });

  return token;
};

window.saveReminderToFirebase = async function (reminderData) {
  const remindersRef = ref(database, "reminders");
  const newReminderRef = push(remindersRef);
  await set(newReminderRef, reminderData);
};

window.saveTasksToFirebase = async function (key, tasks) {
  await set(ref(database, "tasks/" + key), tasks);
};

window.getTasksFromFirebase = async function (key) {
  const snapshot = await get(ref(database, "tasks/" + key));
  return snapshot.exists() ? snapshot.val() : [];
};

window.deleteTasksFromFirebase = async function (key) {
  await remove(ref(database, "tasks/" + key));
};