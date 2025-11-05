const mongoose = require("mongoose")

const adminsSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String },
    restaurants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "restaurants"
    }]
})

module.exports = mongoose.model("admins", adminsSchema)