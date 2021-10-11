
const {ErrorHandler, catchAsyncError} = require('../errorHandler')
const Product = require('../models/product')
const ApiFeatures = require('../apiFeatures')

//Create a product => /api/v1/admin/product
const createProduct = catchAsyncError(async (req, res, next) => {
    req.body.user = req.user.id
    const product = await Product.create(req.body)
    return res.status(200).json({
        success: true,
        result: product
    })
})

//Get products => /api/v1/products?keyword=apple&category=Electronic
const getProducts = catchAsyncError(async (req, res) => {
    const resPerPage = 2
    const productCount = await Product.countDocuments()
    const apiFeatures = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .paginate(resPerPage)

    const products = await apiFeatures.result
    return res.status(200).json({
        success: true,
        count: products.length,
        productCount,
        products: products
    })
})

//Get a product => /api/v1/product/:id
const getProduct = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id)
    if(!product){
        return next(new ErrorHandler('Product not found', 404))
    }

    return res.status(200).json({
        success: true,
        result: product
    })
})

//Update a product => /api/v1/admin/product/:id
const updateProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id)
    if(!product){
        return res.status(404).json({
            success: false,
            result: "Product not found"
        })
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    return res.status(200).json({
        success: true,
        result: product
    })
})

//Delete a product => /api/v1/admin/product/:id
const deleteProduct = catchAsyncError(async (req, res, next) => {
    const  product = await Product.findById(req.params.id)
    if(!product){
        return res.status(404).json({
            success: false,
            result: "Product not found"
        })
    }

    await Product.deleteOne()
        
    return res.status(200).json({
        success: true,
        result: "The product was deleted"
    })
})

module.exports = {
    createProduct: createProduct,
    getProducts: getProducts,
    getProduct: getProduct,
    updateProduct: updateProduct,
    deleteProduct: deleteProduct
}