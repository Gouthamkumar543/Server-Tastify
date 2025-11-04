const mongoose = require("mongoose")

const reastaurantsSchema = new mongoose.Schema({
    restaurantname: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String, required: true },
    image: { type: String, required: true },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "products"
    }]
})

module.exports = mongoose.model("restaurants", reastaurantsSchema)