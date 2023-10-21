const express = require('express');
const router = express.Router();
const { checkUser, createUser, authLoginCred, authOtp, getUserDetails, editUserDetails } = require('../api/users');

router.route('/login/step2').post(authOtp);
router.route('/login/step1').post(authLoginCred);
router.route('/register/checkuser').get(checkUser);
router.route('/edit/details').put(editUserDetails);
router.route('/register/createuser').post(createUser);
router.route('/fetch/details/:aadhaar').get(getUserDetails);

module.exports = router;