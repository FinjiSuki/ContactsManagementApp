const express = require("express")
const router = express.Router()
const {registerUser,loginrUser,currentUserInfo,loginGet,registerMe, logoutMe} = require("../controllers/userController")
const validateToken = require("../middleware/validateTokenHandler")

router.route("/register").get(registerMe).post(registerUser)

router.route("/login").get(loginGet).post(loginrUser)

router.get("/profile", validateToken, currentUserInfo)

router.get("/logout", logoutMe)

module.exports = router