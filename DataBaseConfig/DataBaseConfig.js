const mongoose = require("mongoose")
require("dotenv").config()

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.DbConnect)
        console.log("connected")
    } catch (error) {
        console.error(error);
    }
}

module.exports = dbConnect