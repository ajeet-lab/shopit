const asyncHandler = require("../middlewares/catchAsyncHandler");
const Order = require('../models/Order');
const Product = require('../models/Product');
const CustomErrorHandler = require("../utils/CustomErrorHandler");


// New Order => /api/v1/order/new
exports.newOrder = asyncHandler(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    res.status(201).json({
        success: true,
        order
    });
});


// Get Single Order => /api/v1/order/:id
exports.getSingleOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
        return next(new CustomErrorHandler("Order not found this Id..", 404));
    }

    res.status(200).json({
        success: true,
        order
    });
});

// Get all my orders => /api/v1/orders/me
exports.myOrders = (async (req, res, next) => {
    const orders = await Order.find({
        user: req.user._id
    });
    if (!orders) {
        return next(new CustomErrorHandler("orders not found this Id..", 404));
    }

    res.status(200).json({
        success: true,
        orders
    });
});


// Get all order --Admin => /api/v1/admin/orders
exports.AllOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find({});
    if (!orders) {
        return next(new CustomErrorHandler("orders not found", 404));
    };

    let totalAmount = 0;
    orders.forEach(order => totalAmount += order.totalPrice);

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    });
})

// update order --Admin => /api/v1/admin/order/:id
exports.updateOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new CustomErrorHandler("Order not found this Id..", 404));
    }

    if (order.orderStatus === "Delivered") {
        return next(new CustomErrorHandler("This order already delivered", 404));
    }

    order.orderItems.forEach(async order=>{
        await updateStock(order.product, order.quantity);
    });

    order.orderStatus = req.body.orderStatus;
    order.deliveredAt = Date.now();

    res.status(200).json({
        success: true
    });

});

// Update Product stock after order delivered
async function updateStock(id, quantity){
    let product = await Product.findById(id);
    product.stock = product.stock - quantity;
    await product.save();
}

// delete order --Admin => /api/v1/admin/order/:id
exports.deleteOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new CustomErrorHandler("Order not found this Id..", 404));
    };

    await order.remove();
    res.status(200).json({
        success: true,
        message: "Order deleted successfully.."
    });
});