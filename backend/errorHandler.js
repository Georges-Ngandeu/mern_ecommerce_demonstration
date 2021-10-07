const dotenv = require('dotenv')
dotenv.config({
    path: 'backend/config.env'
})

class ErrorHandler extends Error {
    constructor(message, statusCode){
        super(message)
        this.statusCode = statusCode

        Error.captureStackTrace(this, this.constructor)
    }
}

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

        res.status(err.statusCode).json({
            success: false,
            error: error.message || 'Internal server error'
        })
    }
}

const catchAsyncError = func => (req, res, next) => {
    Promise.resolve(func(req, res, next)).catch(next)
}

module.exports = {
    errorMiddleware: errorMiddleware,
    ErrorHandler: ErrorHandler,
    catchAsyncError: catchAsyncError
} 