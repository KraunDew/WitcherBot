require("dotenv").config();
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL,
});
const db = admin.firestore();

module.exports = db;

const app = require("./server/express");
app.listen(app.get("port"), () => {
  console.log(`Server listening on port ${app.get("port")}`);
});

require("./server/bot/index");
