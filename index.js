require("dotenv").config()
const app = require("./server/express")
require("./server/bot/index")

app.listen(app.get("port"), () => {
    console.log(`Server listening on port ${app.get("port")}`)
})