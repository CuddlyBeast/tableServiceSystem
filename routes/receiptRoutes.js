const { provideReceipt } = require("../controllers/receiptController"); 
const express = require("express");
const { authenticateUser } = require("../middleware/authenticationMiddleware");

const router = express.Router();

router.get("/order/receipt/:id", authenticateUser, provideReceipt);

module.exports = router;