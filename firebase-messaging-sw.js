importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyC0mfdioS8eWFcMJs3QrA9EtVfDS2YS6yw",
  authDomain: "diarybook-66e64.firebaseapp.com",
  projectId: "diarybook-66e64",
  storageBucket: "diarybook-66e64.firebasestorage.app",
  messagingSenderId: "795103658821",
  appId: "1:795103658821:web:a2fbb9abb806ef6096b42c"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  self.registration.showNotification("Diary Reminder 🔔", {
    body: payload.notification.body,
    icon: "images/cover.jpg"
  });
});