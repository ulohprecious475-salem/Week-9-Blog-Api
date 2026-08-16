const express = require("express");
const { validateRegister } = require("../validations/user.validation");
const { validateLogin } = require("../validations/user.validation");
const router = express.Router();

const { registerUser } = require("../controllers/user.controller");
const { loginUser } = require("../controllers/user.controller");
router.post('/sign-up', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);

module.exports = router;