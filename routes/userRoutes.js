const express = require('express');
const router = express.Router();
const { checkUser, createUser, authLoginCred, authSecretCode } = require('../api/users');

router.route('/login/step1').post(authLoginCred);
router.route('/login/step2').post(authSecretCode);
router.route('/register/checkuser').get(checkUser);
router.route('/register/createuser').post(createUser);

module.exports = router;