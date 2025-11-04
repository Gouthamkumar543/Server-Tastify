const express = require("express")
const router = express.Router()
const { getData, singleAdmin, adminSignUp, adminLogIn, deleteAdmin, updateAdmin } = require("../Controllers/AdminsController")

router.get("/", getData)
router.get("/:id", singleAdmin)
router.post("/signup", adminSignUp)
router.post("/login", adminLogIn)
router.delete("/:id", deleteAdmin)
router.put("/:id", updateAdmin)

module.exports = router