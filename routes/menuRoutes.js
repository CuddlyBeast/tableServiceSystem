const express = require("express");
const { viewMenu, viewItem } = require("../controllers/menuController");

const router = express.Router();

router.get("/menu", viewMenu);
router.get("/menu/:id", viewItem);

module.exports = router;