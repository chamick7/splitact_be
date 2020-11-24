const express = require('express');
const router = express.Router();
const accountController = require('../Controllers/accountController');
const tokenAuth = require("../Middlewares/tokenAuth");


router.post('/',accountController.post_register);
router.post('/login',accountController.post_login);
router.post('/google',accountController.post_googleAuth);
router.post('/changepassword',tokenAuth,accountController.post_changePassword);
router.post('/test', (res,req) => {res.status(200).json({msg:"hello"})})
router.get('/auth',accountController.get_auth);
router.get('/me',tokenAuth,accountController.get_account);
router.get('/logout',accountController.get_logout);
router.get('/users',tokenAuth,accountController.get_users);
router.post('/forgotpw',accountController.post_forgetPW_sendToken);
router.get('/checktoken',accountController.get_forgetPW_recieveToken);
router.post('/resetpassword',accountController.post_forgetPW_resetPassword);




module.exports = router;