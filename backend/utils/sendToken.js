const sendToken = async (user, statusCode, res) => {
    const token = await user.generateToken();
    const options = {
        expires: new Date(Date.now() + process.env.COOKIES_EXPIRE_TIME * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    return res.status(statusCode).cookie("token", token, options).json({
        success: true,
        token,
        user
    });
};

module.exports = sendToken;