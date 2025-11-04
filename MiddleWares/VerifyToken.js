const jwt = require("jsonwebtoken")
const AdminsSchema = require("../Models/AdminsSchema")
require("dotenv").config()

const secretKey = process.env.Token

const verifyToken = async (req, res, next) => {
    const token = req.headers.token
    if (!token) {
        return res.status(404).json({ message: "token required" })
    }
    try {
        const decode = jwt.verify(token, secretKey)
        const findAdmin = await AdminsSchema.findById(decode.adminId)
        if (!findAdmin) {
            return res.status(404).json({ message: "no admin found" })
        }
        req.adminId = decode.adminId
        next()
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = verifyToken