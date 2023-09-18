const express = require('express');
const router = express.Router();
const { bookAppointment, fetchAppointments, deleteAppointment, editAppointment, fetchVaccinations } = require('../api/patient');

router.route('/book/appointment').post(bookAppointment);
router.route('/edit/appointment').put(editAppointment);
router.route('/fetch/appointments/:id').get(fetchAppointments);
router.route('/fetch/vaccinations/:id').get(fetchVaccinations);
router.route('/remove/appointment/:id').delete(deleteAppointment);

module.exports = router;