const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");

admin.initializeApp({
  databaseURL: "https://diarybook-66e64-default-rtdb.firebaseio.com"
});

exports.checkReminders = onSchedule("every 5 minutes", async () => {
  const db = admin.database();
  const snap = await db.ref("reminders").once("value");

  if (!snap.exists()) return;

  const now = Date.now();

  for (const child of Object.entries(snap.val())) {
    const id = child[0];
    const r = child[1];

    if (!r.token) continue;

    if (r.oneDayReminderTime && now >= r.oneDayReminderTime && r.beforeOneDaySent !== true) {
      await admin.messaging().send({
        token: r.token,
        notification: {
          title: "Diary Reminder 🔔",
          body: `${r.day} at ${r.time} - reminder before 1 day`
        }
      });

      await db.ref(`reminders/${id}/beforeOneDaySent`).set(true);
    }

    if (r.oneHourReminderTime && now >= r.oneHourReminderTime && r.beforeOneHourSent !== true) {
      await admin.messaging().send({
        token: r.token,
        notification: {
          title: "Diary Reminder 🔔",
          body: `${r.day} at ${r.time} - reminder before 1 hour`
        }
      });

      await db.ref(`reminders/${id}/beforeOneHourSent`).set(true);
    }
  }
});