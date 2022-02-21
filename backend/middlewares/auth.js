const asyncHandler = require("../middlewares/catchAsyncHandler");
const User = require("../models/User");
const CustomErrorHandler = require("../utils/CustomErrorHandler");
const jwt = require("jsonwebtoken");

// Is user Authenticate
exports.isAuthenticate = asyncHandler(async (req, res, next) => {
    const {
        token
    } = req.cookies;
    if (!token) {
        return next(new CustomErrorHandler("Login first to access this resource", 401))
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decode.id);
    next();
});

// Authorize Role Permision
exports.authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new CustomErrorHandler(`Role ${req.user.role} is not allowed to access this resource`));
        }
        next();
    }
}