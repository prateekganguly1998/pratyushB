const mongoose=require('mongoose');
const User=require('../models/users');
const async=require('async');
const logger = require("../middleware/logger");
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;
const { validationResult } = require("express-validator");

exports.postSignup=(req,res,next)=>
{
    const name=req.body.name;
    const typeOfUser=req.body.typeOfUser;
    const email=req.body.email;
    const password=req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error(errors.array());
        return res.status(200).json({
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                name: name,
                typeOfUser:typeOfUser
            },
            validationErrors: errors.array(),
        });
    }
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
            if (err) {
                throw err;
            }
            
            const user = new User({
                name: name,
                email: email,
                password:hash,
               typeOfUser:typeOfUser
            });
            return user
            .save()
            .then((result) => {
                res.json({ message: "User signed up" });
            })
            .catch((err) => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
        });
    });
 
}
  

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
            req.session.isLoggedIn = true;
            req.session.user = user;
            console.log(req.session);
            return req.session.save((err) => {
                if (err) {
                    console.log(err);
                }
               return res.json({ message: "User logged in", user: user });
            });
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