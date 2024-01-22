const express = require("express");
const { authenticateUser } = require("../middleware/authenticationMiddleware");
const { confirmOrder } = require("../controllers/paymentController");


const router = express.Router();

router.post("/order/payment", authenticateUser, confirmOrder);

module.exports = router;