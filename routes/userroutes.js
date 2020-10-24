var User = require("../models/users");
const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");
const { validator } = require("../middleware/validator");
const isAuth=require('../middleware/isAuth');


router.post('/signup',validator,userController.postSignup);
router.post('/login',userController.postLogin);
module.exports=router;