const mongoose = require("mongoose")


const contactSchema = mongoose.Schema({
    createdUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required:[true,"Logged In User's Id is necessary to create contacts"],
        ref:"User"
    },
    name:{
        type:String,
        required:[true,"Please add the name of the contact"]
    },
    email:{
        type:String,
        required:[true,"Please add the email address of the contact"]
    },
    phone:{
        type:String,
        required:[true,"Please add the phone number for the contact"]
    },
    profilePhoto:{
        type:String,
        default:null
    }
},
{
    timestamps: true
})

module.exports = mongoose.model("Contact", contactSchema)