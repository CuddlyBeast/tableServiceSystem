const express = require("express");
const { authenticateUser } = require("../middleware/authenticationMiddleware");
const { confirmOrder } = require("../controllers/paymentController");


const router = express.Router();

router.put("/order/payment/:id", authenticateUser, confirmOrder);

module.exports = router;