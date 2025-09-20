const { Router } = require("express");
const passport = require("../server/passport.js");
const { auth } = require("../util/middleware/auth");
const router = Router();
const db = require("../index");

router.get("/", (req, res) => {
  res.render("home", {
    title: "WitcherBot",
    user: req.user? req.user : null
  });
});

router.get("/login", passport.authenticate("discord", {failureRedirect: "/"}), (req, res) => {
  res.redirect("/dashboard");
});

router.post("/logout", (req, res) => {
  res.clearCookie("connect.sid").status(200).redirect("/").json({message: "Logout successful"})
});

router.get("/dashboard", auth, (req, res) => {
  const servers = [];
  const guilds =  req.user.guilds.filter(p => (p.permissions & 8) === 8);

  for(const key in guilds) {
    if(req.botClient.guilds.cache.get(guilds[key].id)){
      servers.push({
        status: true,
        id: req.botClient.guilds.cache.get(guilds[key].id).id,
        name: req.botClient.guilds.cache.get(guilds[key].id).name,
        icon: req.botClient.guilds.cache.get(guilds[key].id).icon,
      })
    } else {
      servers.push({
        status: false,
        id: guilds[key].id,
        name: guilds[key].name,
        icon: guilds[key].icon,
      })
    }
  }

  res.render("dash",{
    title: "WitcherBot || DashBoard",
    user: req.user,
    servers,
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
  res.render("server", {
    title: `WitcherBot || ${servidor.name}`,
    user: req.user,
    servidor,
    canales,
  });
});

router.post("/dashboard/:id/prefix", auth, async (req, res) => {
  let id = req.params.id;
  let {prefix} = req.body;
  await db.collection("guilds").doc(id).update({prefix: prefix});
  res.redirect(`/dashboard/${id}`);
});

module.exports = router;
