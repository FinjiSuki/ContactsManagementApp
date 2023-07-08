const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:[true, "Please provide an username"]
    },
    email:{
        type:String,
        required:[true, "Please provide an email address"],
        unique:[true,"Email address already got registered"]
    },
    password:{
        type:String,
        required:[true, "Please provide a proper password"]
    }
},{
    timestamps:true
})

module.exports = mongoose.model("Users",userSchema)