const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");

admin.initializeApp();

exports.checkReminders = onSchedule("every 30 minutes", async (event) => {
  console.log("Checking reminders...");
});