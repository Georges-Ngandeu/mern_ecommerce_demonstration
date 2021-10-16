const {ErrorHandler, catchAsyncError} = require('../errorHandler')
const Order = require('../models/order')
const Product = require('../models/product')
const ApiFeatures = require('../apiFeatures')

//Create order => /api/v1/order
const createOrder = catchAsyncError(async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id
    })

    return res.status(200).json({
        success: true,
        order: order
    })
})

//Get an order from log in user => /api/v1/order/:id
const getSingleOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')
    
    if(!order){
        return next(new ErrorHandler('No order found with this ID', 404))
    }

    return res.status(200).json({
        success: true,
        order
    })
})

//Get all orders from log in user => /api/v1/orders/me
const getUserOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find({
        user: req.user.id
    })
   
    return res.status(200).json({
        success: true,
        orders
    })
})

//Get all orders in database => /api/v1/admin/orders
const getallOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find()

    let totalAmount = 0

    orders.forEach((order) => {
        totalAmount += order.totalPrice
    })

    return res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})

//Update an order => /api/v1/admin/order/:id
const updateOrder = catchAsyncError(async (req, res, next) => {
    let updateStock = async (id, quantity) => {
        const product = await Product.findById(id)
        product.stock = product.stock - quantity
        await product.save({validateBeforeSave: false})
    }

    const order = await Order.findById(req.params.id)
    
    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler('You have already delivered this order', 404))
    }

    order.orderItems.forEach(async item => {
        await updateStock(item.product, item.quantity)
    })

    order.orderStatus = req.body.status
    order.deliveredAt = Date.now()

    await order.save()

    return res.status(200).json({
        success: true
    })
})

//Delete an order from log in user => /api/v1/admin/order/:id
const deleteOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
    
    if(!order){
        return next(new ErrorHandler('No order found with this ID', 404))
    }

    await order.remove()

    return res.status(200).json({
        success: true,
    })
})

module.exports = {
    createOrder,
    getSingleOrder,
    getUserOrders,
    getallOrders,
    updateOrder,
    deleteOrder
}