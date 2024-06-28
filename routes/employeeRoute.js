const express = require('express');
const router = express.Router();
const auth = require('../services/authenticate');
const upload = require('../services/multer');
const {registerPage,register,otpVerification,editProfileForm,editProfile,profile,profilePic} = require('../controllers/employeeController');

router.get('/register',registerPage);
router.post('/register',register);
router.post('/otp',otpVerification);
router.get('/editProfile/:id',auth,editProfileForm);
router.post('/editProfile/:id',editProfile);
router.get('/:id',auth,profile);
router.post('/profilePic/:id',upload.single("avatar"),profilePic);

module.exports = router;