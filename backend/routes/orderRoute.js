const express = require("express");
const router = express.Router();

const {
    newOrder,
    getSingleOrder,
    myOrders,
    AllOrders,
    updateOrder,
    deleteOrder
} = require("../controllers/orderController");

const {
    isAuthenticate, authorizeRole
} = require("../middlewares/auth")




router.post('/order/new', isAuthenticate, newOrder);

router.get('/order/:id', isAuthenticate, getSingleOrder);
router.get('/orders/me', isAuthenticate, myOrders);



// ========ADMIN ROUTES=======
router.get('/admin/orders', isAuthenticate, AllOrders);

router.route('/admin/order/:id')
.put(isAuthenticate, authorizeRole("admin"), updateOrder)
.delete(isAuthenticate, authorizeRole("admin"), deleteOrder);


module.exports = router;