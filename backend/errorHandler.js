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

const catchAsyncError = func => (req, res, next) => {
    Promise.resolve(func(req, res, next)).catch(next)
}

module.exports = {
    ErrorHandler: ErrorHandler,
    catchAsyncError: catchAsyncError
} 