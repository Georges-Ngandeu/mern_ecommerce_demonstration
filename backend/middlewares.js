const jwt = require('jsonwebtoken')
const {catchAsyncError, ErrorHandler} = require('./errorHandler')
const User = require('./models/user')

const dotenv = require('dotenv')
dotenv.config({
    path: 'backend/config.env'
})

const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500

    if(process.env.NODE_ENV.trim() === 'DEVELOPMENT'.trim()){
        res.status(err.statusCode).json({
            success: false,
            error: err,
            errorMessage: err.message,
            stack: err.stack
        })
    }

    if(process.env.NODE_ENV.trim() === 'PRODUCTION'.trim()){
        let error = {...err}
        error.message = err.message

        if(err.name === 'CastError'){
            const message = `Resource not found. Invalid ${err.path} `
            error = new ErrorHandler(message, 400)
        }
 
        if(err.name === 'ValidationError'){
            const message = Object.values(err.errors).map(value => value.message)
            error = new ErrorHandler(message, 400)
        }

        if(err.code === 11000){
            const message = `Duplicate ${Object.keys(err.keyValue)} entered`
            error = new ErrorHandler(message, 400)
        }

        
        if(err.name === 'JsonWebTokenError'){
            const message = 'JSON Web Token is invalid. Try again!!!'
            error = new ErrorHandler(message, 400)
        }

         
        if(err.name === 'TokenExpiredError'){
            const message = 'JSON Web Token is expired. Try again!!!'
            error = new ErrorHandler(message, 400)
        }

        res.status(err.statusCode).json({
            success: false,
            error: error.message || 'Internal server error'
        })
    }
}

const isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
    const {token} = req.cookies

    if(!token){
        return next(new ErrorHandler('Login first to access this resource', 401))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById(decoded.id)

    next()
})

const authorizeRoles = ( ...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resource`, 403))   
        }

        next()
    }
}

module.exports = {
    errorMiddleware: errorMiddleware,
    isAuthenticatedUser: isAuthenticatedUser,
    authorizeRoles: authorizeRoles
} 