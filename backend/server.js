const express  = require('express')
const cookieParser = require('cookie-parser')
const app = express()
const router = express.Router()

const connectDatabase = require('./database')
const {errorMiddleware, isAuthenticatedUser, authorizeRoles} = require('./middlewares')
const {createProduct, getProducts, getProduct, updateProduct, deleteProduct} = require('./controllers/productCtrl')
const {registerUser, logIn, logOut, forgotPassword, resetPassword} = require('./controllers/userCtrl')

app.use(express.json())
app.use(cookieParser())
app.use('/api/v1', router)
app.use(errorMiddleware)

/* products routes */
router.route('/products').get(authorizeRoles('admin'), getProducts)
    
router.route('/admin/product').post(isAuthenticatedUser, authorizeRoles('admin'), createProduct)
    
router.route('/product/:id').get(getProduct)

router.route('/admin/product/:id').put(isAuthenticatedUser, authorizeRoles('admin'), updateProduct)

router.route('/admin/product/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct)

/*user routes*/
router.route('/register').post(registerUser)
router.route('/login').post(logIn)
router.route('/logout').get(logOut)
router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').put(resetPassword)

connectDatabase()
    
const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`)
})

/* handle uncaugth exceptions */
process.on('uncaughtException', err => {
    console.log(`ERROR: ${err.stack}`)
    console.log('Shutting down the server due to uncaught exception')
    server.close(() => {
        process.exit(1)
    })
})

/* handle unhandledRejection exceptions */
process.on('unhandledRejection', err => {
    console.log(`ERROR: ${err.message}`)
    console.log('Shutting down the server due to unhandled Promise Rejection')
    server.close(() => {
        process.exit(1)
    })
})

