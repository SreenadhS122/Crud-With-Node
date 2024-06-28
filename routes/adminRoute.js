const express = require('express');
const router = express.Router();
const upload = require('../services/multer');
const auth = require('../services/authenticate');
const {addEmployee,dashboard,addEmployeeForm,viewEmployee,editEmployeeForm,editEmployee,employeeProfilePic,employeeList,pagination, searchEmployee, deleteEmployee, makeAdmin, adminProfile} = require('../controllers/adminController');

router.get('/dashboard',auth,dashboard);
router.get('/addEmployee',auth,addEmployeeForm);
router.get('/viewEmployee/:id',auth,viewEmployee);
router.get('/editEmployee/:id',auth,editEmployeeForm);
router.post('/editEmployee/:id',editEmployee);
router.post('/addEmployee',addEmployee);
router.post('/employee/profilePic/:id',upload.single('avatar'),employeeProfilePic);
router.get('/employeeList/:limit',auth,employeeList);
router.get('/pagination/:limit/:page',auth,pagination);
router.post('/searchEmployee',searchEmployee);
router.get('/deleteEmployee/:id',auth,deleteEmployee);
router.get('/makeAdmin/:id',auth,makeAdmin);
router.get('/profile/:id',auth,adminProfile);

module.exports = router;