const express = require("express")
const cors = require("cors")
const dbConnect = require("./DataBaseConfig/DataBaseConfig")
const dbConnect = require("./DataBaseConfig/DataBaseConfig")
const adminsRouter = require("./Routes/AdminsRoute")
const restaurantRouter = require("./Routes/RestaurantsRoute")
const productRouter = require("./Routes/ProductRoute")
require("dotenv").config()

PORT = process.env.PORT

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

dbConnect()

app.use("/admins", adminsRouter)
app.use("/restaurants", restaurantRouter)
app.use("/products", productRouter)

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
})