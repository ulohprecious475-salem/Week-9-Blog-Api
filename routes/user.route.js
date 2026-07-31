const express = require("express");

const router = express.Router();

const { registerUser } = require("../controllers/user.controller");
const { loginUser } = require("../controllers/user.controller");
router.post('/sign-up', registerUser);
router.post('/login', loginUser);

module.exports = router;