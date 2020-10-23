const express = require('express');
const router = express.Router();
const accountController = require('../Controllers/accountController');


router.post('/',accountController.post_register);
router.post('/login',accountController.post_login);
router.get('/auth',accountController.get_auth);
router.get('/logout',accountController.get_logout);



module.exports = router;