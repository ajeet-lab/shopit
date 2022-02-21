const asyncHandler = require('../middlewares/catchAsyncHandler')
const User = require('../models/User');
const CustomErrorHandler = require("../utils/CustomErrorHandler");
const sendToken = require('../utils/sendToken');
const cloudinary = require("cloudinary")

// Register User => /api/v1/register
exports.register = asyncHandler(async (req, res, next) => {

    const result =await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder: "avatars",
        width: 150,
        crop:'scale'
    });

    
    const {
        name,
        email,
        phone,
        password
    } = req.body;
    const user = await User.create({
        name,
        email,
        phone,
        password,
        avatar: {
            public_id: result.public_id,
            url: result.secure_url
        }
    });

    sendToken(user, 201, res);
});

// Login User => /api/v1/login
exports.login = asyncHandler(async (req, res, next) => {
    const {
        email,
        password
    } = req.body;
    const user = await User.findOne({
        email
    }).select("+password");
    if (!user) {
        return next(new CustomErrorHandler("Email or password is invailid", 404));
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return next(new CustomErrorHandler("Email or password is invailid", 404));
    }

    sendToken(user, 200, res);
});


// Get currently loggedin user Detail => /api/v1/me
exports.getUserProfile = asyncHandler(async(req, res, next)=>{
    const user = await User.findById(req.user._id);
    if(!user){
        return next(new CustomErrorHandler("User not found", 404))
    };
    res.status(200).json({
        success: true,
        user
    });
});

// Update password => /api/v1/password/update
exports.updatePassword = asyncHandler(async(req, res, next)=>{
    const {oldPassword, newPassword} = req.body
    const user = await User.findById(req.user._id);
    if(!user){
        return next(CustomErrorHandler("User not found", 404))
    };
    
    const isMatch = await user.comparePassword(oldPassword);
    console.log("match", isMatch)
    if(!isMatch){
        return next(new CustomErrorHandler("Old Password is invalid", 401));
    }
    user.password = newPassword;
    user.save();

    res.status(201).json({
        success: true,
        message: "Password change successfully..."
    })
});

// Update Profile => /api/v1/profile/update
exports.updateProfile = asyncHandler(async(req, res, next)=>{
    res.status(201).json({
        success: true,
        message: "Profile update successfully..."
    })
});

// Get all user --Admin => /api/v1/users
exports.getAllUser = asyncHandler(async(req, res, next)=>{
    const users = await User.find();
    if(!users){
        return next(new CustomErrorHandler("Users not found", 404))
    };
    res.status(200).json({
        success: true,
        users
    });
});

// Get specific user detail --Admin => /api/v1/user/:id
exports.getSpecificUser = asyncHandler(async(req, res, next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new CustomErrorHandler("Users not found", 404))
    };
    res.status(200).json({
        success: true,
        user
    });
});

// Update specific user detail --Admin => /api/v1/user/:id
exports.updateSpecificUser = asyncHandler(async(req, res, next)=>{
    let user = await User.findById(req.params.id);
    if(!user){
        return next(new CustomErrorHandler("Users not found", 404))
    };
   user = await User.findByIdAndUpdate(req.params.id, req.body, {returnDocument:"after", runValidators: true}
    )
    res.status(200).json({
        success: true,
        user
    });
});


// Delete specific user detail --Admin => /api/v1/user/:id
exports.deleteSpecificUser = asyncHandler(async(req, res, next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new CustomErrorHandler("Users not found", 404))
    };
    await user.remove();
    res.status(200).json({
        success: true,
        message: "User Deleted"
    });
});



// Logout User => /api/v1/logout
exports.logout = asyncHandler(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.status(200).json({
        success: true,
        message: "Logout successfully"
    })
});