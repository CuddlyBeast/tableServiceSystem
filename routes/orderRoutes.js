const express = require("express");
const { authenticateUser } = require("../middleware/authenticationMiddleware");
const { placeOrder, viewOrders } = require("../controllers/orderController");

const router = express.Router(); 

router.post("/order", authenticateUser, placeOrder);
router.get("/order/history", authenticateUser, viewOrders);


module.exports = router;