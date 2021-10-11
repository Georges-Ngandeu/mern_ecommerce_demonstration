const {ErrorHandler, catchAsyncError} = require('../errorHandler')
const User = require('../models/user')
const sendToken = require('../jwtToken')
const sendEmail = require('../sendEmail')
const crypto = require('crypto')

//Register a user => /api/v1/register
const registerUser = catchAsyncError(async (req, res, next) => {
    const {name, email, password } = req.body
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: '',
            url:''
        }
    })

    sendToken(user, 200, res)
})

//login a user => /api/v1/login
const logIn = catchAsyncError(async (req, res, next) => {
    const {email, password } = req.body
    
    if(!email || !password){
        return next(new ErrorHandler('Please enter email and password', 400))
    }

    const user = await User.findOne({email}).select('+password')

    if(!user){
        return next(new ErrorHandler('Invalid email or password', 400))
    }

    const isPasswordMatched = await user.comparePassword(password)

    if(!isPasswordMatched){
        return next(new ErrorHandler('Invalid email or password', 400))
    }

    sendToken(user, 200, res)
})

//logout a user => /api/v1/logout
const logOut = catchAsyncError(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Logged out'
    })
}) 

//forgot password => /api/v1/password/forgot
const forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({email: req.body.email})

    if(!user){
        return next(new ErrorHandler('User not found with this email', 404))
    }

    const resetToken = user.getResetPasswordToken()

    await user.save({validateBeforeSave: false})

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`

    const message = `Your passwprd reset token is as follow:\n\n ${resetUrl}\n\nIf you have not requested this email, then ignore it.`

    try {
        await sendEmail({
            email: user.email,
            subject: 'ShopIt Password Recovery',
            message: message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined 
        user.resetPasswordExpire = undefined      
        
        await user.save({validateBeforeSave})
    }
})

const resetPassword = catchAsyncError(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()}
    })

    if(!user){
        return next(new ErrorHandler('Password reset token is invalid or has been expired', 400))
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler('Password does not match', 400))
    }

    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()

    sendToken(user, 200, res)

})

module.exports = {
    registerUser: registerUser,
    logIn: logIn,   
    logOut: logOut,
    forgotPassword: forgotPassword,
    resetPassword: resetPassword   
}