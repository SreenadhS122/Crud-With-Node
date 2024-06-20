const express = require('express');
const router = express.Router();
const {registerPage,register} = require('../controllers/employeeController');

router.get("/register",registerPage);
router.post("/register",register);

module.exports = router;