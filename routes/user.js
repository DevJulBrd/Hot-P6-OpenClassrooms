// Import express
const express = require('express');
const router = express.Router();

// Import controllers
const userCtrl = require('../controllers/user');

//Import middleware
const limiter = require('../middleware/rate-limit');


// Root signup
router.post('/signup', limiter, userCtrl.signup);
// Root login
router.post('/login', limiter, userCtrl.login);


module.exports = router;