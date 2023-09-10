const express = require('express');
const router = express.Router();
const { bookAppointment, fetchAppointments, deleteAppointment, editAppointment } = require('../api/patient');

router.route('/book/appointment').post(bookAppointment);
router.route('/edit/appointment').put(editAppointment);
router.route('/fetch/appointments/:id').get(fetchAppointments);
router.route('/remove/appointment/:id').delete(deleteAppointment);

module.exports = router;