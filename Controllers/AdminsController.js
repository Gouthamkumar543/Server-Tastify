const adminsSchema = require("../Models/AdminsSchema")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const secretKey = process.env.Token

const adminSignUp = async (req, res) => {
    const { username, email, password } = req.body
    try {
        const adminExists = await adminsSchema.findOne({ email })
        if (adminExists) {
            return res.status(404).json({ message: "admin already exists" })
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const newAdmin = new adminsSchema({
            username,
            email,
            password: hashPassword
        })
        await newAdmin.save()
        res.status(201).json({ message: "admin added sucessfully" })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" })
    }
}

const adminLogIn = async (req, res) => {
    const { email, password } = req.body
    try {
        const findAdmin = await adminsSchema.findOne({ email })
        if (!findAdmin || !(await bcrypt.compare(password, findAdmin.password))) {
            return res.status(401).json({ message: "Invalid crendentials" })
        }
        const token = jwt.sign({ adminId: findAdmin._id }, secretKey, { expiresIn: "24h" })
        const adminId = findAdmin._id
        res.status(200).json({ message: "Login sucessfull", token, adminId })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" })
    }
}

const getData = async (req, res) => {
    try {
        const data = await adminsSchema.find().populate("restaurants")
        if (!data) {
            return res.status(404).json({ message: "No data found" })
        }
        res.status(200).json({ data })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" })
    }
}

const singleAdmin = async (req, res) => {
    const adminId = req.params.id
    try {
        const singleAdmin = await adminsSchema.findById(adminId)
        if (!singleAdmin) {
            return res.status(404).json({ message: "No admin found with the id" })
        }
        const restaurantId = singleAdmin.restaurants[0]._id
        res.status(200).json({ singleAdmin, restaurantId })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" })
    }
}

const deleteAdmin = async (req, res) => {
    const adminId = req.params.id
    if (!adminId) {
        return res.status(400).json({ message: "Id required" })
    }
    try {
        const deletedAdmin = await adminsSchema.findByIdAndDelete(adminId)
        if (!deletedAdmin) {
            return res.status(404).json({ message: "No Admin found" })
        }
        res.status(200).json({ message: "admin deleted sucessfully" })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" })
    }
}

const updateAdmin = async (req, res) => {
    const { email, password, username } = req.body
    const adminId = req.params.id
    if (!adminId) {
        return res.status(400).json({ message: "Id required" })
    }
    try {
        const hashPassword = await bcrypt.hash(password, 10)
        const updatedAdmin = await adminsSchema.findByIdAndUpdate(adminId, { username, email, password: hashPassword }, { new: true })
        if (!updatedAdmin) {
            return res.status(404).json({ message: "No item found" })
        }
        res.status(201).json({ message: "admin updated sucessfully" })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = { adminSignUp, adminLogIn, getData, deleteAdmin, singleAdmin, updateAdmin }