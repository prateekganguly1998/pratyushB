var User = require("../models/users");
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const adminController=require('../controllers/admin');
const userController=require('../controllers/users');
const { validator } = require("../middleware/validator");


router.post('/add-user',validator,adminController.addUser);
router.post('/login',authController.postLogin);
router.get('/find',adminController.viewAllUsers);
module.exports=router;