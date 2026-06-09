import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyC0mfdioS8eWFcMJs3QrA9EtVfDS2YS6yw",
  authDomain: "diarybook-66e64.firebaseapp.com",
  projectId: "diarybook-66e64",
  storageBucket: "diarybook-66e64.firebasestorage.app",
  messagingSenderId: "795103658821",
  appId: "1:795103658821:web:a2fbb9abb806ef6096b42c"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export async function requestFirebasePermission() {
  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    return null;
  }

  const token = await getToken(messaging, {
    vapidKey: "BGO19k2WnSwoIXMu1US-uk5_egIB0P8j8INe5OzDL0uOq_dnLpCQh_sd75zSOJ1PwUNv15zKmJGlYIaASFUDkBE"
  });

  localStorage.setItem("firebaseToken", token);
  console.log("Firebase token:", token);

  return token;
}
window.requestFirebasePermission = requestFirebasePermission;