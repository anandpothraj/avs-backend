const express = require('express');
const router = express.Router();
const { fetchVaccines, addVaccine, editVaccine, deleteVaccine } = require('../api/doctor');

router.route('/add/vaccine').post(addVaccine);
router.route('/fetch/vaccines').get(fetchVaccines);
router.route('/edit/vaccine/:id').put(editVaccine);
router.route('/remove/vaccine/:id').delete(deleteVaccine);

module.exports = router;