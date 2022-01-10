const {ErrorHandler, catchAsyncError} = require('../errorHandler')
const User = require('../models/user')
const sendToken = require('../jwtToken')
const sendEmail = require('../sendEmail')
const crypto = require('crypto')
const cloudinary = require('cloudinary').v2 

//Register a user => /api/v1/register
/*
|------------------------------------------------------------------
|Algorithmic Thinking
|------------------------------------------------------------------
|1) get name, email and password from body request
|2) create the user with this data
|3) create a user token 
|4) store token to cookie 
|5) return the token and the user
*/
const registerUser = catchAsyncError(async (req, res, next) => {

    const result = await cloudinary.uploader.upload(req.body.avatar, {
        folder: 'avatars',
        width: 150,
        crop: 'scale',
        // public_id: `${Date.now()}`,
        // resource_type: "auto",
    })
    
    const {name, email, password } = req.body

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: result.public_id,
            url: result.secure_url
        }
    })

    sendToken(user, 200, res)
})

//login a user => /api/v1/login
/*
|------------------------------------------------------------------
|Algorithmic Thinking
|------------------------------------------------------------------
|1) get email and password from body request
|2) there is no email or password ?
|       yes: return an error
|3) the user with the given email exist ?
|       no: return an error
|4) does the user password matched ?
|       no: return an error 
|5) store token to cookie 
|6) return the token and the user
*/
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
/*
|------------------------------------------------------------------
|Algorithmic Thinking
|------------------------------------------------------------------
|1) delete the cookie from the response
|2) return the "Logged out message"
*/
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
/*
|------------------------------------------------------------------
|Algorithmic Thinking
|------------------------------------------------------------------
|1) get email from body request
|2) the user with the given email exist ?
|       no: return an error
|3) create a reset password token for the user
|4) create a user token 
|5) send a reset email to the user
*/
const forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({email: req.body.email})

    if(!user){
        return next(new ErrorHandler('User not found with this email', 404))
    }

    const resetToken = user.getResetPasswordToken()

    await user.save({validateBeforeSave: false})

    //const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`
    const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`

    const message = `Your password reset token is as follow:\n\n ${resetUrl}\n\nIf you have not requested this email, then ignore it.`

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

//reset password => /api/v1/password/reset/:token
/*
|------------------------------------------------------------------
|Algorithmic Thinking
|------------------------------------------------------------------
|1) get the reset password token from the url 
|2) the user with the given password reset token exist ?
|       no: return an error
|3) are the password and the confirm password the same ?
|       no: return an error
|4) update the user password 
|5) reset the user reset password token
|6) create token
|7) store token to cookie 
|8) return the token and the user
*/
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

//Get login user => /api/v1/me
/*
|------------------------------------------------------------------
|Algorithmic Thinking
|------------------------------------------------------------------
|1) get user id from request url
|2) the user with the given id exist ?
|       no: return an error
|3) return the user
*/
const getUserProfile = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        user: user
    })
}) 


//Update user password => /api/v1/me
/*
|------------------------------------------------------------------
|Algorithmic Thinking
|------------------------------------------------------------------
|1) get user id from request url
|2) the user with the given id exist ?
|       no: return an error
|3) is the oldPassword the same as the newPassword ?
|       no: return an error 
|5) update the user password 
|6) create token
|7) store token to cookie 
|8) return the token and the user
*/
const updatePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password')

    const isMatched = await user.comparePassword(req.body.oldPassword)

    if(!isMatched){
        return next(new ErrorHandler('Old password is incorrect', 400))
    }

    user.password = req.body.password

    await user.save()

    sendToken(user, 200, res)

}) 

//Update user profile => /api/v1/me/update
/*
|------------------------------------------------------------------
|Algorithmic Thinking
|------------------------------------------------------------------
|1) get user id from request url
|2) get user profile info from body request
|3) user with given id exist ?
|       no: return an error 
|5) update user profile info 
|6) return success message
*/
const updateUserProfile = catchAsyncError(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    if(req.body.avatar !== ''){
        const user = await User.findById(req.user.id)
        const image_id = user.avatar.public_id
        const res = await cloudinary.uploader.destroy(image_id)
    }

    const result = await cloudinary.uploader.upload(req.body.avatar, {
        folder: 'avatars',
        width: 150,
        crop: 'scale',
        // public_id: `${Date.now()}`,
        // resource_type: "auto",
    })

    newUserData.avatar = {
        public_id: result.public_id,
        url: result.secure_url
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
    })
}) 


//get all users => /api/v1/admin/users
/*
|------------------------------------------------------------------
|Algorithmic Thinking
|------------------------------------------------------------------
|1) get all users
|2) return all users
*/
const getAllUsers = catchAsyncError(async (req, res, next) => {

    const users = await User.find()

    res.status(200).json({
        success: true,
        users: users
    })
}) 


//get user details=> /api/v1/admin/user/:id
/*
|------------------------------------------------------------------
|Algorithmic Thinking
|------------------------------------------------------------------
|1) get user id from request url
|2) user with given id exist ?
|       no: return an error 
|3) return the user
*/
const getUserDetails = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.params.id)

    if(!user){
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 400))
    }

    res.status(200).json({
        success: true,
        user: user
    })
}) 

//Update user profile => /api/v1/admin/user/:id
/*
|------------------------------------------------------------------
|Algorithmic Thinking
|------------------------------------------------------------------
|1) get user id from request url
|2) get user profile info from body request
|3) user with given id exist ?
|       no: return an error 
|5) update user profile info 
|6) return success message
*/
const adminUpdateUserProfile = catchAsyncError(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
    })
}) 

//delete user => /api/v1/admin/user/:id
/*
|------------------------------------------------------------------
|Algorithmic Thinking
|------------------------------------------------------------------
|1) get user id from request url
|2) user with given id exist ?
|       no: return an error 
|3) delete the user 
|4) return success message
*/
const deleteUser = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.params.id)

    if(!user){
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 400))
    }

    await user.remove()

    res.status(200).json({
        success: true,
    })
}) 

module.exports = {
    registerUser: registerUser,
    logIn: logIn,   
    logOut: logOut,
    forgotPassword: forgotPassword,
    resetPassword: resetPassword,
    getUserProfile: getUserProfile,
    updatePassword: updatePassword,
    updateUserProfile: updateUserProfile,
    getAllUsers: getAllUsers,
    getUserDetails: getUserDetails,
    adminUpdateUserProfile: adminUpdateUserProfile,
    deleteUser: deleteUser   
}