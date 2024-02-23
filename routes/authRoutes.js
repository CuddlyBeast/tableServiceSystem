const express = require("express");
const { signUp, signIn, logout } = require("../controllers/authController");

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.get('/logout', logout);

module.exports = router;