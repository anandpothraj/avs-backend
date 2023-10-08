const nodemailer = require('nodemailer');
const config = require('../config/default.json');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.nodemailer.username,
      pass: config.nodemailer.password
    },
});

module.exports = transporter;