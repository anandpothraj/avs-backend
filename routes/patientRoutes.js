const express = require('express');
const router = express.Router();
const { bookAppointment } = require('../api/patient');

router.route('/book/appointment').post(bookAppointment);

module.exports = router;