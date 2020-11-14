const mongoose=require('mongoose');
const User=require('../models/users');
const async=require('async');
const logger = require("../middleware/logger");
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;
const { validationResult } = require("express-validator");
const users = require('../models/users');

exports.addUser=(req,res,next)=>
{
    const name=req.body.name;
    const isManager=req.body.isManager;
    const email=req.body.email;
    const DOJ=req.body.DOJ;
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
                DOJ:DOJ,
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
  
exports.viewAllUsers=(req,res,next)=>
{
    const minSalary=req.query.minSalary;
    const maxSalary=req.query.maxSalary;
    const keyword=req.query.keyword;
    let query=[{ $match :{} }];
    if(keyword!==undefined)
    {
        query=  [{
            $match: {
            name: {
            $regex: keyword,
            $options: "i"
            }
        }
    }]
   
    }

    User.aggregate(query).then(result=>
        {
            let newArray=result;
            if(minSalary&&maxSalary)
            {
             newArray =  result.filter(user=>
                    {
                        if(user.salary<=maxSalary&&user.salary>=minSalary)
                        {
                            return user;
                        }
                    })
            }

            return res.json({users:newArray});
        }).catch(err=>
            {
                console.log(err);
                logger.error(`Error in handling request`);
                return res.json({errorMessage:err});
            })

}


exports.updateUser=(req,res,next)=>
{
    const userId=req.params.userId;
    const updatedUserData=req.body.user;
    
    User.findOneAndUpdate({_id:userId},updatedUserData,{new:true})
    .then(result=>
        {
            console.log(result);
            return res.json(result);
        })
    .catch(err=>
        {
            console.log(err);
            return res.json({errorMessage:err});
        })
}

exports.deleteUser=(req,res,next)=>
{
    const userId=req.params.userId;
    User.remove({_id:userId}).then(result=>
        {
            return res.json(result);
        }).catch(err=>
            {
                console.log(err);
                return res.json({errorMessage:err});

            })
}