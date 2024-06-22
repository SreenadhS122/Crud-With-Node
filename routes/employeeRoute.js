const express = require('express');
const router = express.Router();
const {registerPage,register,otpVerification,editEmployeeForm,editEmployee} = require('../controllers/employeeController');
const upload = require('../services/multer');

router.get('/register',registerPage);
router.post('/register',upload.single('avatar'),register);
router.post('/otp',otpVerification);
router.get('/editEmployee/:id',editEmployeeForm);
router.post('/editEmployee/:id',upload.single('avatar'),editEmployee)

module.exports = router;