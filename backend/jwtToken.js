//create token and save to cookie
/*
|------------------------------------------------------------------
|Algorithmic Thinking
|------------------------------------------------------------------
|1) generate the user token
|2) set cookie options
|3) store token in cookie with cookie options
|4) return token and user 
*/
const sendToken = (user, statusCode, res) => {
    const token = user.getJwtToken()
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true 
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        user
    })
}

module.exports = sendToken