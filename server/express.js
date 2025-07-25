const express = require('express');
const session = require('express-session');
const {engine} = require('express-handlebars');
const passport = require('./passport')
const BotClient = require('./bot/index.js')
const path = require('node:path')
const app = express();

app
.set("port", process.env.PORT || 3000)
.use(express.static("public"))
.use(session({
    secret: "ilovewitcherbot",
    resave: false,
    saveUninitialized: false
}))
.use(passport.initialize())
.use(passport.session())
.set("views", path.join(__dirname, "../views"))
.set("view engine", ".hbs")
.engine(".hbs", engine({extname: ".hbs"}))
.use((req, res, next) => {
    req.botClient = BotClient;
    next();
})
.use("/", require('../routes/routes.js'))

module.exports = app;