const express = require('express');
const router = express.Router();
const { checkUser, createUser } = require('../api/users');

router.route('/register/checkuser').post(checkUser);
router.route('/register/createuser').post(createUser);

module.exports = router;