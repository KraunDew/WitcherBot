const express = require("express");
const session = require("express-session");
const { engine } = require("express-handlebars");
const passport = require("./passport");
const BotClient = require("./bot/index.js");
const path = require("node:path");
const app = express();

app
  .use(express.json())
  .set("port", process.env.PORT || 3000)
  .use(express.static("public"))
  .use(express.urlencoded({ extended: true }))
  .use(
    session({
      secret: process.env.COOKIKE_KEY,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000*60*60*24*7, // 1 week
      }
    })
  )
  .use(passport.initialize())
  .use(passport.session())
  .set("views", path.join(__dirname, "../views"))
  .set("view engine", ".hbs")
  .engine(".hbs", engine({ extname: ".hbs" }))
  .use((req, res, next) => {
    req.botClient = BotClient;
    next();
  })
  .use("/", require("../routes/routes.js"));

module.exports = app;
