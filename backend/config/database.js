const mongoose = require("mongoose");


const connectDB = async (db) => {
    try {
        await mongoose.connect(db);
        console.log("Database is connected");
    } catch (error) {
        console.log("error: ", error.message);
    }
}

module.exports = connectDB;