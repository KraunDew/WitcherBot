require("dotenv").config()
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://witcherbot-c04d0-default-rtdb.firebaseio.com"
});

const db = admin.firestore();
module.exports = db;

const app = require("./server/express")
require("./server/bot/index")

app.listen(app.get("port"), () => {
    console.log(`Server listening on port ${app.get("port")}`)
})