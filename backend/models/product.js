const mongoose = require('mongoose')

//product schema
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter product name'],
        maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please enter product price'],
        trim: true,
        maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please enter product description']
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, 'Please select category for this product'],
        enum: {
            values: ['Electronic', 'Dress', 'Laptop', 'Headphone', 'Food', 'Books', 'Clothes'],
            message: 'Please select correct category for product'
        }
    },
    seller : {
        type: String,
        required: [true, 'Please enter product seller'],
    },
    stock : {
        type: Number,
        required: [true, 'Please enter product stock'],
        maxlength: [5, 'Product stock cannot exceed 5 characters'],
        default: 0
    },
    numOfReviews : {
        type: Number,
        default: 0
    },
    reviews : [
        {
            name: {
                type: String,
                required: true
            },
            rating: {
                type: String,
                required: true
            },
            comment: {
                type: String,
                required: true
            },
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true
            },
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product