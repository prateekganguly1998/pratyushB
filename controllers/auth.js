const mongoose=require('mongoose');
const User=require('../models/users');
const async=require('async');
const logger = require("../middleware/logger");
const bcrypt = require("bcrypt");
const _ = require('lodash');

exports.postLogin=(req,res,next)=>
{
    const email = req.body.email;
    const password=req.body.password;
    //console.log(number);
    // console.log(firebaseToken);
    User.findOne({ 'email': email })
        .then((user) => {
           // console.log(user);

            if (!user) {
                res.status(422);
                res.json({ errorMessage: "Invalid credentials" });
            }
            bcrypt.compare(password, user.password, function (
                err,
                result
            ) {
                if (result == true) {
                  let _user={...user['_doc']};
                  delete _user.password;
               return res.json({ message: "User logged in", user: _user });
            
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