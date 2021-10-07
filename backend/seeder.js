const Product = require('./models/product')
const dotenv = require('dotenv')
const connectDatabase = require('./database')
const products = require('./data')

dotenv.config({
    path: 'backend/config.env'
})

connectDatabase()

const seedProducts = async () => {
    try {
        await Product.deleteMany()
        console.log("Products are deleted")
        await Product.insertMany(products)
        console.log("Products are added")
        process.exit()
    } catch (error) {
        console.log(error)
        process.exit()
    }
}

seedProducts()