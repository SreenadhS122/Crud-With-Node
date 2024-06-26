const express = require('express');
const router = express.Router();
const {registerPage,register,otpVerification,editProfileForm,editProfile,profile,profilePic} = require('../controllers/employeeController');
const upload = require('../services/multer');

router.get('/register',registerPage);
router.post('/register',register);
router.post('/otp',otpVerification);
router.get('/editProfile/:id',editProfileForm);
router.post('/editProfile/:id',editProfile);
router.get('/:id',profile);
router.post('/profilePic/:id',upload.single("avatar"),profilePic);

module.exports = router;