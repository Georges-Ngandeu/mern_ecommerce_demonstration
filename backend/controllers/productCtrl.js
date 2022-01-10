
const {ErrorHandler, catchAsyncError} = require('../errorHandler')
const Product = require('../models/product')
const ApiFeatures = require('../apiFeatures')

//Create a product => /api/v1/admin/product
/*
|------------------------------------------------------------------
|Algorithmic Thinking
|------------------------------------------------------------------
|1) add the user id to the request body 
|2) create a product with the body data
|3) return the created product
*/
const createProduct = catchAsyncError(async (req, res, next) => {
    req.body.user = req.user.id
    const product = await Product.create(req.body)
    return res.status(200).json({
        success: true,
        result: product
    })
})

//Get products => /api/v1/products?keyword=apple&category=Electronic
/*
|------------------------------------------------------------------
|Algorithmic Thinking
|------------------------------------------------------------------
|1) get the number of products
|2) get products with search filter and paginate criteria
|3) return the products list, the total number of products and the total products
|   with the seach and paginate criteria   
*/
const getProducts = catchAsyncError(async (req, res, next) => {
    const resPerPage = 4
    const productCount = await Product.countDocuments()

    let apiFeatures = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()

    let filteredProducts = await apiFeatures.query
    let filteredProductCount = filteredProducts.length


    apiFeatures = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .paginate(resPerPage)

    let products = await apiFeatures.query

    return res.status(200).json({
        success: true,
        productCount,
        resPerPage,
        products: products,
        filteredProductCount
    })
})

//Get a product => /api/v1/product/:id
/*
|------------------------------------------------------------------
|Algorithmic Thinking
|------------------------------------------------------------------
|1) get product id from request url
|2) product with given id exist ?
|       no: return an error 
|3) return the product
*/
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
/*
|------------------------------------------------------------------
|Algorithmic Thinking
|------------------------------------------------------------------
|1) get product id from request url
|2) product with given id exist ?
|       no: return an error 
|5) update product with request body data 
|6) return success message
*/
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

/*
|------------------------------------------------------------------
|Algorithmic Thinking
|------------------------------------------------------------------
|1) get product id from request url
|2) product with given id exist ?
|       no: return an error 
|3) delete the product 
|4) return success message
*/
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

//create a product review => /api/v1/review
/*
|------------------------------------------------------------------
|Algorithmic Thinking
|------------------------------------------------------------------
|1) get rating, comment and productId from request body
|2) define the review object
|3) product with productId exist ?
|       no: return an error 
|4) as the user reviewed the product ? 
|   no: store the review
|       update the number of review for the product
|   yes: update the user review comment 
|        update the user review rating 
|5)  update the average rating for the product
|6)  update the product
|7)  return success
*/
const createProductReview = catchAsyncError(async (req, res, next) => {
    const {rating, comment, productId} = req.body

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment: comment
    }

    const product = await Product.findById(productId)

    const isReviewed = product.reviews.find(rv => rv.user.toString() === req.user._id.toString())

    if(isReviewed){
        product.reviews.forEach(review => {
            if(review.user.toString() === req.user._id.toString()){
                review.comment = comment
                review.rating = rating
            }
        })
    } else {
        product.reviews.push(review)
        product.numberOfReviews = product.reviews.length
    }

    product.ratings = product.reviews.reduce((acc, item) => Number(item.rating) + acc, 0)/product.reviews.length

    await product.save({validateBeforeSave: false})

    res.status(200).json({
        success:true
    })
})

//Get product reviews => /api/v1/reviews
/*
|------------------------------------------------------------------
|Algorithmic Thinking
|------------------------------------------------------------------
|1) get the product id from request url query parameter
|2) product for the given id exist ?
|       no: return an error
|3) return the reviews of the product
*/
const getAllProductReviews = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.id)

    if(!product){
        return next(new ErrorHandler('Product not found', 404))
    }

    res.status(200).json({
        success:true,
        reviews: product.reviews
    })
})

//Delete product review => /api/v1/reviews
/*
|------------------------------------------------------------------
|Algorithmic Thinking
|------------------------------------------------------------------
|1) get the productId from request url query parameter
|2) product for the given id exist ?
|       no: return an error
|3) remove the review with given reviewId from the product reviews
|4) update the number of reviews
|5) update the ratings
|6) update the product
*/
const deleteProductReview = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId)

    if(!product){
        return next(new ErrorHandler('Product not found', 404))
    }

    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.reviewId.toString())
    const numberOfReviews = reviews.length
    const ratings = product.reviews.reduce((acc, item) => Number(item.rating) + acc, 0)/numberOfReviews

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numberOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success:true,
    })
})

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getAllProductReviews,
    deleteProductReview
}