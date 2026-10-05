const express = require("express");

const multer = require("multer");
const { validateRegister } = require("../validations/user.validation");
const { validateLogin } = require("../validations/user.validation");

const { registerUser } = require("../controllers/user.controller");
const { loginUser } = require("../controllers/user.controller");

const upload = require("../middlewares/upload");

const router = express.Router();


router.post('/upload', upload.single('image'), (req, res) => {

    const fileUrl = req.file.path;
    const fileName = req.file.filename;

    console.log(fileName);
    console.log(fileUrl);

    res.send('Hello, from upload');
});

router.post('/sign-up', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);

module.exports = router;