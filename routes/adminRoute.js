const express = require('express');
const router = express.Router();
const upload = require('../services/multer');
const {addEmployee,dashboard,addEmployeeForm,viewEmployee,editEmployeeForm,editEmployee} = require('../controllers/adminController');

router.get('/dashboard',dashboard);
router.get('/addEmployee',addEmployeeForm);
router.get('/viewEmployee/:id',viewEmployee);
router.get('/editEmployee/:id',editEmployeeForm);
router.post('/editEmployee/:id',upload.single('avatar'),editEmployee);
router.post('/addEmployee',upload.single('avatar'),addEmployee);

module.exports = router;