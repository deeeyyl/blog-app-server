const express = require("express");
const { registerUser, loginUser, getProfile, makeAdmin } = require("../controllers/userController");
const { verify, verifyAdmin } = require("../auth");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", verify, getProfile);

router.put("/make-admin/:id", verify, verifyAdmin, makeAdmin);

module.exports = router;