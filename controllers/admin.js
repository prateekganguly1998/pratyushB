const mongoose=require('mongoose');
const User=require('../models/users');
const async=require('async');
const logger = require("../middleware/logger");
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;
const { validationResult } = require("express-validator");

exports.addUser=(req,res,next)=>
{
    const name=req.body.name;
    const isManager=req.body.isManager;
    const email=req.body.email;
    const salary=req.body.salary;
    const skills=req.body.skills;
    const designation=req.body.designation;
    const password=req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error(errors.array());
        return res.status(200).json({
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                name: name,
                isManager:isManager
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
                DOJ:Date.now(),
                salary:salary,
                designation:designation,
                skills:skills,
                isManager:isManager
            });
            return user
            .save()
            .then((result) => {
                res.json({ message: "User added to employee database" });
            })
            .catch((err) => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
        });
    });
 
}
  