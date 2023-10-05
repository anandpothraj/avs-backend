const express = require('express');
const router = express.Router();
const { fetchVaccinationInfo } = require('../api/inspector');

router.route('/fetch/vaccinations/info').get(fetchVaccinationInfo);
module.exports = router;