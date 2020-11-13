const mongoose=require('mongoose');
const User=require('../models/users');
const async=require('async');
const logger = require("../middleware/logger");
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;
const { validationResult } = require("express-validator");

exports.postLogin=(req,res,next)=>
{
    const email = req.body.email;
    const password=req.body.password;
    //console.log(number);
    // console.log(firebaseToken);
    User.findOne({ 'email': email })
        .then((user) => {
            console.log(user);

            if (!user) {
                res.status(422);
                res.json({ errorMessage: "Invalid credentials" });
            }
            bcrypt.compare(password, user.password, function (
                err,
                result
            ) {
                if (result == true) {
        
               return res.json({ message: "User logged in", user: user });
            
                } else {
                   return res.json({errorMessage:`Invalid credentials.`})
                }
            });
           
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}