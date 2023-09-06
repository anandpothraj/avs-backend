const express = require('express');
const router = express.Router();
const { bookAppointment, fetchAppointments } = require('../api/patient');

router.route('/book/appointment').post(bookAppointment);
router.route('/fetch/appointments/:id').get(fetchAppointments);

module.exports = router;