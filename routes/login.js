const express = require('express');
const router = express.Router();
const auth = require('../services/authenticate');
const {homepage,login} = require('../controllers/loginController');

router.get('/',auth,homepage);
router.post('/login',login);

module.exports = router;