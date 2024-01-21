const express = require("express");
const { authenticateUser } = require("../middleware/authenticationMiddleware");
const { placeOrder } = require("../controllers/orderController");

const router = express.Router(); 

router.post("/order", authenticateUser, placeOrder);

module.exports = router;