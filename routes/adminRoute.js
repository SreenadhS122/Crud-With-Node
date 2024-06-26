const express = require('express');
const router = express.Router();
const upload = require('../services/multer');
const {addEmployee,dashboard,addEmployeeForm,viewEmployee,editEmployeeForm,editEmployee,employeeProfilePic,employeeList,pagination} = require('../controllers/adminController');

router.get('/dashboard',dashboard);
router.get('/addEmployee',addEmployeeForm);
router.get('/viewEmployee/:id',viewEmployee);
router.get('/editEmployee/:id',editEmployeeForm);
router.post('/editEmployee/:id',editEmployee);
router.post('/addEmployee',addEmployee);
router.post('/employee/profilePic/:id',upload.single('avatar'),employeeProfilePic);
router.get('/employeeList/:limit',employeeList);
router.get('/pagination/:limit/:page',pagination)

module.exports = router;