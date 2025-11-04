const express = require("express")
const { getData, singleRestaurant, uploads, reastaurantsDetails, deleteRestaurant, updateRestaurant } = require("../Controllers/RestaurantsController")
const verifyToken = require("../MiddleWares/VerifyToken")
const router = express.Router()

router.get("/", getData)
router.get("/:id", singleRestaurant)
router.post("/", verifyToken, uploads.single("image"), reastaurantsDetails)
router.delete("/:id", deleteRestaurant)
router.put("/:id", uploads.single("image"), updateRestaurant)

module.exports = router