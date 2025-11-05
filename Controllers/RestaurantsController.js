const restaurantsSchema = require("../Models/ReastaurantsSchema")
const adminsSchema = require("../Models/AdminsSchema")
const multer = require("multer")
const cloudinary = require("cloudinary").v2
require("dotenv").config()

cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
})

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    }
})

const uploads = multer({ storage })

const reastaurantsDetails = async (req, res) => {
    const { restaurantname, location, category, type } = req.body
    const file = req.file
    try {
        const findAdmin = await adminsSchema.findById(req.adminId)
        if (!findAdmin) {
            return res.status(404).json({ message: "no admin found" })
        }
        const image = await cloudinary.uploader.upload(file.path)
        const newRestaurant = new restaurantsSchema({
            restaurantname,
            location,
            category,
            type,
            image: image.secure_url
        })
        const savedRestaurant = await newRestaurant.save()
        findAdmin.resturants.push(savedRestaurant)
        await findAdmin.save()
        res.status(201).json({ message: "Restaurant added sucessfully" })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" })
    }
}

const getData = async (req, res) => {
    try {
        const data = await restaurantsSchema.find().populate("products")
        res.status(200).json({ data })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" })
    }
}

const singleRestaurant = async (req, res) => {
    const resturantId = req.params.id
    try {
        const singleRestaurant = await restaurantsSchema.findById(resturantId)
        if (!singleRestaurant) {
            return res.status(404).json({ message: "no restaurant found" })
        }
        res.status(200).json({ singleRestaurant })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" })
    }
}


const deleteRestaurant = async (req, res) => {
    const resturantId = req.params.id
    if (!resturantId) {
        return res.status(400).json({ message: "Id required" })
    }
    try {
        const deletedRestaurant = await restaurantsSchema.findByIdAndDelete(resturantId)
        if (!deletedRestaurant) {
            return res.status(404).json({ message: "no restaurant found" })
        }
        await adminsSchema.updateMany(
            { restaurants: resturantId },
            { $pull: { restaurants: resturantId } }
        )
        res.status(200).json({ message: "deleted sucessfully" })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" })
    }
}

const updateRestaurant = async (req, res) => {
    const resturantId = req.params.id
    const { restaurantname, location, category, type } = req.body
    const file = req.file
    if (!resturantId) {
        return res.status(400).json({ message: "Id required" })
    }
    try {
        const image = await cloudinary.uploader.upload(file.path)
        const updatedRestaurant = await restaurantsSchema.findByIdAndUpdate(resturantId, { restaurantname, location, category, type, image: image.secure_url }, { new: true })
        if (!updatedRestaurant) {
            return res.status(404).json({ message: "No item found" })
        }
        res.status(201).json({ message: "updated sucessfully" })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = { uploads, reastaurantsDetails, getData, singleRestaurant, deleteRestaurant, updateRestaurant }