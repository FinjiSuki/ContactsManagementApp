const express = require("express")
const router = express.Router();
const { showError } = require("../controllers/errorController");

// router.route("/register").get(registerMe).post(registerUser)

// router.route("/login").get(loginGet).post(loginrUser)

router.route("/").get(showError)

module.exports = router