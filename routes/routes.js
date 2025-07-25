const { Router } = require('express');
const passport = require('../server/passport.js')
const { auth } = require('../util/middleware/auth')
const router = Router()

router.get("/", (req, res) => {
    res.send("ok")
})

module.exports = router;