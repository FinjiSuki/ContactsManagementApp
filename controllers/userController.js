const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const path = require("path")
const flash = require("connect-flash")


const registerMe = asyncHandler((req, res) => {

    const filePath = path.join(__dirname, '..', 'views', 'register.html');
    res.sendFile(filePath);
})

//@desc User Registration functionality
//@route /api/user/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400)
        throw new Error("Fill all the required fields.")
    }

    const userMail = await User.findOne({ email })
    if (userMail) {
        res.status(400)
        throw new Error("This Email Address is already registered with us.")
    }

    //Hashing user Password
    const hashedPass = await bcrypt.hash(password, 10)
    // console.log("Hashed Password: ",hashedPass) //printing password to check hashed output

    const newUser = await User.create({
        username,
        email,
        password: hashedPass
    })

    console.log(`User Registration was successful ${newUser}`)
    if (newUser) {
        // console.log("Resource Created Successfully.")

        req.flash('Registration Successful', `Welcome ${username}, your registration is successful. Proceed with Login!`);
        res.status(201);
        res.redirect('/user/login');
        // // res.json({response:"Hola! Your REGISTER route is working ideally.",newUserDetails:newUser})
        // // const filePath = path.join(__dirname,'..', 'views', 'login.html');
    } else {
        res.status(400)
        throw new Error("Data Validation Alert. Your Registration Data Is Not Valid.")
        // res.json({response:"Data Validatio n Alert. Your Registration Data Is Not Valid.",newUserDetails:newUser})
    }
})

const loginGet = asyncHandler((req, res) => {
    const filePath = path.join(__dirname, '..', 'views', 'login');
    res.render(filePath, { message: req.flash('Registration Successful') });
})


//@desc User Login functionality
//@route /api/user/login
//@access public
const loginrUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    //console.log(email," ",password)
    if (!email || !password) {
        res.status(400)
        throw new Error("All fields are mandatory!")
    }

    const userDetail = await User.findOne({ email })
    if (userDetail && (await bcrypt.compare(password, userDetail.password))) {
        const accessToken = jwt.sign({
            userInfo: {
                username: userDetail.username,
                email: userDetail.email,
                id: userDetail.id
            }
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" })
        // res.status(200).json({jwtAccessToken:accessToken})

        req.session.loginToken = accessToken;
        req.session.userLoggedIn = userDetail;
        // console.log("Logged In user details: "+req.session.userLoggedIn._id)
        res.redirect('/user/profile')
    } else {
        res.status(401)
        throw new Error("This Email Address OR Password is incorrect. Please check the details you entered.")
    }
    // res.json({response:"Hola! Your LOGIN route is working as exprected."})
})

//@desc Current Logged In User functionality
//@route /api/user/currentUser
//@access private
const currentUserInfo = asyncHandler(async (req, res) => {
    //console.log(req.user)
    const loggedInUser = req.session.userLoggedIn;
    // res.json({response:"Hola! Your CURRENT_USER route is working fine.",loggedInUserDetails:loggedInUser})
    const filePath = path.join(__dirname, '..', 'views', 'profile');
    res.render(filePath, loggedInUser);
})

const logoutMe = asyncHandler(async (req, res) => {
    req.session.loginToken = null;
    req.session.userLoggedIn = null;
    req.user = null;

    res.redirect('/user/login');
})

module.exports = { registerUser, loginrUser, currentUserInfo, loginGet, registerMe, logoutMe }