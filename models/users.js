const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {type:String,required:true},
    typeOfUser:{type:String,required:true},
    password:{type:String,required:true},
    createdAt:{type:Date,default:Date.now()}

    // resetToken:String,
    // resetTokenExpiration:Date
})

module.exports = mongoose.model("User", userSchema);
