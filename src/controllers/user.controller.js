const UserModel = require('../models/user.model.js');
const { generateToken } = require("../services/auth.service.js");
const bcrypt = require("bcrypt");

const registerUser = async (req, res, next) => {
  try {
    const {email, password, name} = req.body

    const existingUser = await UserModel.findOne({email: email})
    if(existingUser){
        return res.status(400).json({message: "User already exists"})
    }
const hashedPassword = await bcrypt.hash(password, 10);

const user = new UserModel({
    email: email,
    password: hashedPassword,
    name: name
});

  await user.save();

  return res.status(200).json({
    message: "User registered Successfully"
  });
  } catch (error) {
    next(error);
  }
};


const loginUser = async (req, res, next) => {
    try {
      const {email, password} = req.body

    const user = await UserModel.findOne({email: email})

    if(!user){
        return res.status(404).json({message: "User does not exist"})
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

const token = generateToken(user);

const resUser ={
    id: user._id,
    name: user.name,
    email: user.email
};

  return res.status(200).json({ message: 'logged In', user: resUser, token });
} catch (error) {
    next(error);
  }
};

module.exports = {loginUser, registerUser};