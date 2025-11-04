const productsSchema = require("../Models/ProductsSchema")
const multer = require("multer")
const ReastaurantsSchema = require("../Models/ReastaurantsSchema")
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

const productsDetails = async (req, res) => {
    const { name, price, description, rating } = req.body
    const resturantId = req.params.id
    const file = req.file
    try {
        const findRestaurant = await ReastaurantsSchema.findById(resturantId)
        if (!findRestaurant) {
            return res.status(404).json({ message: "Restaurant not found" })
        }
        const image = await cloudinary.uploader.upload(file.path)
        const newProduct = new productsSchema({
            name,
            price,
            description,
            rating,
            image: image.secure_url
        })
        const savedProduct = await newProduct.save()
        findRestaurant.products.push(savedProduct)
        await findRestaurant.save()
        res.status(201).json({ message: "product added sucessfully" })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" })
    }
}

const getData = async (req, res) => {
    try {
        const data = await productsSchema.find()
        res.status(200).json({ data })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" })
    }
}
const singleProduct = async (req, res) => {
    const productId = req.params.id
    try {
        const singleProduct = await productsSchema.findById(productId)
        if (!singleProduct) {
            return res.status(404).json({ message: "product not found" })
        }
        res.status(200).json({ singleProduct })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" })
    }
}

const deleteProduct = async (req, res) => {
    const productId = req.params.id
    if (!productId) {
        return res.status(404).json({ message: "Id required" })
    }
    try {
        await productsSchema.findByIdAndDelete(productId)
        res.status(200).json({ message: "deleted sucessfully" })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" })
    }
}

const updateProduct = async (req, res) => {
    const { name, price, description, rating } = req.body
    const file = req.file
    const productId = req.params.id
    if (!productId) {
        return res.status(404).json({ message: "Id required" })
    }
    try {
        const image = await cloudinary.uploader.upload(file.path)
        await productsSchema.findByIdAndUpdate(productId, { name, price, description, rating, image: image.secure_url }, { new: true })
        res.status(201).json({ message: "updated sucessfully" })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = { uploads, productsDetails, getData, singleProduct, deleteProduct, updateProduct }