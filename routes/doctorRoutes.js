const express = require('express');
const router = express.Router();
const { fetchVaccines, addVaccine } = require('../api/doctor');

router.route('/add/vaccine').post(addVaccine);
router.route('/fetch/vaccines').get(fetchVaccines);

module.exports = router;