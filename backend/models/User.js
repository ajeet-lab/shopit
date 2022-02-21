const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        maxlength: [30, "Max length is 30 charactor"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    phone: {
        type: Number,
        required: [true, "Mobile Node. is required"],
        maxlength: [10, "Max length is 10"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Min length is 6"]
    },
    avatar: {
        public_id: {
            type: String,
            required: [true, "Avatar is required"],
        },
        url: {
            type: String,
            required: [true, "Avatar url is required"],
        }
    },
    role: {
        type: String,
        required: [true, "Role is Required"],
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date

}, {
    timestamps: true
});

// Password encript
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateToken = async function(){
    return await jwt.sign({id: this._id}, process.env.JWT_SECRET, {expiresIn: process.env.EXPIRE_IN});
}

module.exports = mongoose.model("User", userSchema);