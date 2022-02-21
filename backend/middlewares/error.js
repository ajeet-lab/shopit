const CustomErrorHandler = require("../utils/CustomErrorHandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";


    if (process.env.NODE_ENV === "DEVELOPMENT") {
        return res.status(err.statusCode).json({
            success: false,
            error: err,
            errMessage: err.message,
            stack: err.stack
        });
    }

    if (process.env.NODE_ENV === "PRODUCTION") {
        let error = {
            ...err
        };
        error.message = err.message;

        // Wrong Object mongodb id
        if (err.name === "CastError") {
            const message = `Resource not found. invalid ${err.path}`;
            error = new CustomErrorHandler(message, 400);
        }

        // Validation error handle
        if (err.name === "ValidationError") {
            const message = Object.values(err.errors).map(value => value);
            error = new CustomErrorHandler(message, 400);
        }


        return res.status(err.statusCode).json({
            success: false,
            message: error.message
        });
    }


}