const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        default: 0.0
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    ratings: {
        type: Number,
        default: 0.0
    },
    images: [{
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }],

    category: {
        type: String,
        required: [true, 'Please select category'],
        enum: {
            values: [
                "Electronics",
                "Laptops",
                "Cameras",
                "Accesseries",
                "Headphones",
                "Beauty/Healthy",
                "Sport",
                "Food",
                "Books",
                "Clothes/Shoes",
                "Outdoor",
                "Home"
            ],
            message: "Please select currect category for category"
        }
    },
    seller: {
        type: String,
        required: [true, "Please enter product seller"]
    },
    stock: {
        type: Number,
        required: [true, "Stock is required"],
        default: 0.0
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [{
        user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User",
            required: true
        },
        name: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true
        },
        comment: {
            type: String,
            required: true
        }
    }]

}, {
    timestamps: true
});

module.exports = mongoose.model("Product", productSchema);