const express = require("express");
const router = express.Router();

const {
    processPayment,
    sendStripeApi
} = require("../controllers/paymentController");

const {
    isAuthenticate
} = require("../middlewares/auth")


router.post('/payment/process', isAuthenticate, processPayment);
router.get('/stripeapi', isAuthenticate, sendStripeApi);

module.exports = router;