const express = require('express');
const router = express.Router();
const { fetchVaccines, addVaccine, editVaccine, deleteVaccine, fetchAppointmentByAadhaar, fetchAppointmentByBookingId, vaccinatePatient } = require('../api/doctor');

router.route('/add/vaccine').post(addVaccine);
router.route('/fetch/vaccines').get(fetchVaccines);
router.route('/edit/vaccine/:id').put(editVaccine);
router.route('/remove/vaccine/:id').delete(deleteVaccine);
router.route('/vaccinate/patient').post(vaccinatePatient);
router.route('/fetch/appointments/:aadhaar').get(fetchAppointmentByAadhaar);
router.route('/fetch/appointment/:bookingId').get(fetchAppointmentByBookingId);

module.exports = router;