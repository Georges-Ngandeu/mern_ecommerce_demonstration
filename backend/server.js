const express  = require('express')
const cookieParser = require('cookie-parser')
const app = express()
const router = express.Router()

const connectDatabase = require('./database')
const {errorMiddleware, isAuthenticatedUser, authorizeRoles} = require('./middlewares')
const {createProduct, getProducts, deleteProductReview, getAllProductReviews, getProduct, updateProduct, deleteProduct, createProductReview} = require('./controllers/productCtrl')
const {createOrder, deleteOrder, getSingleOrder, getUserOrders, getallOrders, updateOrder} = require('./controllers/orderCtrl')
const {registerUser, deleteUser, adminUpdateUserProfile, getUserDetails, getAllUsers, updateUserProfile, updatePassword, logIn, logOut, forgotPassword, resetPassword, getUserProfile} = require('./controllers/userCtrl')

app.use(express.json())
app.use(cookieParser())
app.use('/api/v1', router)
app.use(errorMiddleware)

/* products routes */
router.route('/review').put(isAuthenticatedUser, createProductReview)
router.route('/reviews').get(getAllProductReviews)
router.route('/reviews').delete(deleteProductReview)
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
router.route('/me').get(isAuthenticatedUser, getUserProfile)
router.route('/password/update').put(isAuthenticatedUser, updatePassword)
router.route('/me/update').put(isAuthenticatedUser, updateUserProfile)

/*admin routes*/
router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles('admin'), getAllUsers)
router.route('/admin/user/:id').get(isAuthenticatedUser, authorizeRoles('admin'), getUserDetails)
router.route('/admin/user/:id').put(isAuthenticatedUser, authorizeRoles('admin'), adminUpdateUserProfile)
router.route('/admin/user/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser)

/*order routes*/
router.route('/order').post(isAuthenticatedUser, createOrder)
router.route('/order/:id').get(isAuthenticatedUser, getSingleOrder)
router.route('/orders/me').get(isAuthenticatedUser, getUserOrders)
router.route('/admin/orders').get(isAuthenticatedUser, authorizeRoles('admin'), getallOrders)
router.route('/admin/order/:id').put(isAuthenticatedUser, authorizeRoles('admin'), updateOrder)
router.route('/admin/order/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteOrder)

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

