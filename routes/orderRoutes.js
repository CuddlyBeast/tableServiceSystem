const express = require("express");
const { authenticateUser } = require("../middleware/authenticationMiddleware");
const { placeOrder, viewOrders, deleteOrder } = require("../controllers/orderController");

const router = express.Router(); 

router.post("/order", authenticateUser, placeOrder);
router.get("/order/history", authenticateUser, viewOrders);
router.delete("/order/delete/:id", authenticateUser, deleteOrder);


module.exports = router;