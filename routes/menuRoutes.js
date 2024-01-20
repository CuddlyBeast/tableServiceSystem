const express = require("express");
const { viewMenu } = require("../controllers/menuController");

const router = express.Router();

router.get("/menu", viewMenu);

module.exports = router;