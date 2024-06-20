const express = require('express');
const router = express.Router();
const {homepage,login} = require('../controllers/loginController');

router.get('/',homepage);
router.post('/login',login);

module.exports = router;