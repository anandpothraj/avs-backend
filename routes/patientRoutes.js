const express = require('express');
const router = express.Router();
const { bookAppointment, fetchAppointments, deleteAppointment, editAppointment, fetchVaccinations, fetchVaccinationInfo, fetchPdf } = require('../api/patient');

router.route('/fetch/certificate').get(fetchPdf);
router.route('/edit/appointment').put(editAppointment);
router.route('/book/appointment').post(bookAppointment);
router.route('/fetch/appointments/:id').get(fetchAppointments);
router.route('/fetch/vaccinations/:id').get(fetchVaccinations);
router.route('/remove/appointment/:id').delete(deleteAppointment);
router.route('/fetch/vaccination/info/:id').get(fetchVaccinationInfo);
module.exports = router;