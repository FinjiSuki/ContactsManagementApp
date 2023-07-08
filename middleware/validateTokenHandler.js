const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")


const validateToken = asyncHandler((req, res, next) => {
    let token;
    if (req.session.loginToken) {
        req.headers.Authorization = req.session.loginToken
    }
    let authHeader = req.headers.Authorization || req.headers.authorization
    if (authHeader) {
        if (authHeader.startsWith("Bearer")) {
            token = authHeader.split(" ")[1]
        } else {
            token = authHeader
        }
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                res.status(401)
                throw new Error("User is not authorized to access at this time. Either Token expired or Token is Invalid")
            }
            //console.log(decoded)
            req.user = decoded.userInfo;
            // console.log(req.user)
            next();
        })

        if (!token) {
            res.status(401)
            throw new Error("Either Token expired or Token is Invalid")
        }
    } else {
        res.status(401)
        throw new Error("Your Session Timed Out (or) Your Session Access Token is missing. Please Do Logging In Again.")
    }
})

module.exports = validateToken