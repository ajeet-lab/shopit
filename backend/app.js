const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const path = require('path');

// BODY PARSER
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());

// ALL ROUTES CONFIG
const productRouter = require("./routes/productRoute.js");
const userRouter = require("./routes/userRoute");
const orderRouter = require("./routes/orderRoute");
const paymentRouter = require("./routes/paymentRoute");
app.use("/api/v1", productRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", orderRouter);
app.use("/api/v1", paymentRouter);


if(process.env.NODE_ENV === "PRODUCTION"){
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    app.get('*', (req, res)=>{
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'));
    });
}

// GLOBAL ERROR MIDDLEWARE
const errorMiddleware = require("./middlewares/error");
app.use(errorMiddleware);

module.exports = app;
