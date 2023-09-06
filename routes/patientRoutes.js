const express = require('express');
const router = express.Router();
const { bookAppointment, fetchAppointments, deleteAppointment } = require('../api/patient');

router.route('/book/appointment').post(bookAppointment);
router.route('/fetch/appointments/:id').get(fetchAppointments);
router.route('/remove/appointment/:id').delete(deleteAppointment);

module.exports = router;