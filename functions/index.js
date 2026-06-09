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

  const updates = {};

  snap.forEach(child => {
    const id = child.key;
    const r = child.val();

    if (!r.token) return;

    if (r.oneDayReminderTime && now >= r.oneDayReminderTime && !r.beforeOneDaySent) {
      admin.messaging().send({
        token: r.token,
        notification: {
          title: "Diary Reminder 🔔",
          body: `${r.day} at ${r.time} - reminder before 1 day`
        }
      });

      updates[`reminders/${id}/beforeOneDaySent`] = true;
    }

    if (r.oneHourReminderTime && now >= r.oneHourReminderTime && !r.beforeOneHourSent) {
      admin.messaging().send({
        token: r.token,
        notification: {
          title: "Diary Reminder 🔔",
          body: `${r.day} at ${r.time} - reminder before 1 hour`
        }
      });

      updates[`reminders/${id}/beforeOneHourSent`] = true;
    }
  });

  await db.ref().update(updates);
});