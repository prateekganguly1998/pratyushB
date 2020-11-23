const mongoose=require('mongoose');
const User=require('../models/users');
const async=require('async');
const logger = require("../middleware/logger");


exports.findUserById=(req,res,next)=>
{
    const userId=req.params.userId;
    User.findOne({_id:userId}).then(result=>
        {
            if(result)
            {
               console.log(result);
                return res.json({user:result});
            }
            return res.json({msg:`No user found by the _id : ${userId}`});
        }).catch(err=>
            {
                console.log(err);
                logger.error(`Error in finding user by Id : ${userId}`);
                return res.json({errorMessage:err});
            })
}