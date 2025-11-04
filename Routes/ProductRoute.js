const express = require("express")
const { productsDetails, singleProduct, getData, deleteProduct, updateProduct } = require("../Controllers/ProductsController")
const { uploads } = require("../Controllers/RestaurantsController")
const router = express.Router()

router.get("/", getData)
router.get("/:id", singleProduct)
router.post("/:id", uploads.single("image"), productsDetails)
router.delete("/:id", deleteProduct)
router.put("/:id", uploads.single("image"), updateProduct)

module.exports = router