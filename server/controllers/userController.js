const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" }
  );
};

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
        username,
        email,
        password,
        isAdmin: req.body.isAdmin || false
    });
    res.status(201).json({
        _id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user)
    });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.makeAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // user id from URL

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isAdmin = true; // promote to admin
    await user.save();

    res.json({ message: `${user.username} is now an admin`, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};