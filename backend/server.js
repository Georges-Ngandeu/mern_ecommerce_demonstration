const express  = require('express')
const app = express()
const router = express.Router()

const Product = require('./models/product')
const connectDatabase = require('./database')
const ApiFeatures = require('./apiFeatures')
const {errorMiddleware, ErrorHandler, catchAsyncError} = require('./errorHandler')

/* handle uncaugth exceptions */
process.on('uncaughtException', err => {
    console.log(`ERROR: ${err.stack}`)
    console.log('Shutting down the server due to uncaught exception')
    server.close(() => {
        process.exit(1)
    })
})

/* products controllers */
//Create a product => /api/v1/admin/product
const createProduct = catchAsyncError(async (req, res, next) => {
    const product = await Product.create(req.body)
    return res.status(200).json({
        success: true,
        result: product
    })
})

//Get products => /api/v1/products?keyword=apple&category=Electronic
const getProducts = async (req, res) => {
    try {
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
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            result: "An error occured"
        })
    }
}

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
const updateProduct = async (req, res, next) => {
    try {
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

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            result: "An error occured"
        })
    }
}

//Delete a product => /api/v1/admin/product/:id
const deleteProduct = async (req, res, next) => {
    try {
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

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            result: "An error occured"
        })
    }
}

app.use(express.json());
app.use('/api/v1', router);
app.use(errorMiddleware);

/* products routes */
router.route('/products').get(getProducts)
    
router.route('/admin/product').post(createProduct)
    
router.route('/product/:id').get(getProduct)

router.route('/admin/product/:id').put(updateProduct)

router.route('/admin/product/:id').delete(deleteProduct)

connectDatabase()
    
const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`)
})

/* handle unhandledRejection exceptions */
process.on('unhandledRejection', err => {
    console.log(`ERROR: ${err.message}`)
    console.log('Shutting down the server due to unhandled Promise Rejection')
    server.close(() => {
        process.exit(1)
    })
})

