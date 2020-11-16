var User = require("../models/users");
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const adminController=require('../controllers/admin');
const userController=require('../controllers/users');
const { validator } = require("../middleware/validator");


router.post('/add-user',validator,adminController.addUser);
router.post('/login',authController.postLogin);
router.get('/findMany',adminController.viewAllUsers);
router.get('/user/:userId',userController.findUserById);
router.post('/update-user/:userId',adminController.updateUser);
router.post('/delete-user',adminController.deleteUser);
module.exports=router;