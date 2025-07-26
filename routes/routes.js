const { Router } = require("express");
const passport = require("../server/passport.js");
const { auth } = require("../util/middleware/auth");
const { user } = require("../server/bot/index.js");
const router = Router();

router.get("/", (req, res) => {
  res.send("ok");
});
router.get("/login", passport.authenticate("discord"), (req, res) => {
  res.redirect("/dashboard");
});
router.get("/dashboard", auth, (req, res) => {
  res.json({
    user: req.user,
    bot: {
      id: req.botClient.user.id,
      username: req.botClient.user.username,
      avatar: req.botClient.user.displayAvatarURL(),
      guilds: req.botClient.guilds.cache.map((g) => ({
        id: g.id,
        name: g.name,
        icon: g.iconURL(),
      })),
    },
  });
});

router.get("/dashboard/:id", auth, (req, res) => {
  let servidor = req.botClient.guilds.cache.get(req.params.id);
  let canales = servidor.channels.cache;
  res.render("dash", {
    user: req.user,
    servidor,
    canales,
  });
});

module.exports = router;
