const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    designation:{type:String},
    email: {type:String,required:true},
    isManager:{type:Boolean,required:true},
    password:{type:String,required:true},
    DOJ:{type:Date,default:Date.now()},
    skills:[{type:String}],
    salary:{type:Number}

    // resetToken:String,
    // resetTokenExpiration:Date
})

module.exports = mongoose.model("User", userSchema);
