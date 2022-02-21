if(process.env.NODE_ENV !== "PRODUCTION"){
  require("dotenv").config({ path: "backend/config/config.env" });
}
const server = require("./app");
const connectDB = require("./config/database");
const cloudinary = require("cloudinary");

process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.message}`);
  process.exit(1);
});

// Connecting to databse
connectDB(process.env.MONGODB_URI);

// Cloundinary config
cloudinary.config({
  cloud_name: "ecommerce-shop",
  api_key: "154364746155674",
  api_secret: "sxp4RyTam114cMUrkw89oaUpubE",
});

const ser = server.listen(process.env.PORT, () =>
  console.log("Server Started")
);

process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err.message}`);
  ser.close(() => {
    process.exit(1);
  });
});
