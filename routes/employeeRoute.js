const express = require('express');
const router = express.Router();
const {registerPage,register,otpVerification,editProfileForm,editProfile,profile} = require('../controllers/employeeController');
const upload = require('../services/multer');

router.get('/register',registerPage);
router.post('/register',upload.single('avatar'),register);
router.post('/otp',otpVerification);
router.get('/editProfile/:id',editProfileForm);
router.post('/editProfile/:id',upload.single('avatar'),editProfile);
router.get('/:id',profile);

module.exports = router;