const asyncHandler = require('express-async-handler')
const path = require("path")


const showError = (req,res)=>{
    // console.log(req.session.errorInfo)
    const filePath = path.join(__dirname,'..', 'views', 'errorDesc');
    // console.log(filePath)
    res.render(filePath, req.session.errorInfo)
    // res.json({message:"You're seeing me from error demo page"})
}


module.exports = {showError}