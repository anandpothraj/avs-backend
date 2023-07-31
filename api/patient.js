const Appointment = require('../models/appointmentModel');
const { isFieldPresentInRequest } = require('../utils/helper');

// @route POST /api/patients/book/appointment
// @desc This route is used to create a new appointment
// @payload ( "vaccineName", "doseNo", "userId" )
// @response  ( appointment, message )
// @access Private
const bookAppointment = async (req, res) => {
  try {
    let reqBody = req.body;
    let requiredFields = ["vaccineName", "doseNo", "userId"];
    let invalidFields = [];

    requiredFields.forEach((field) => {
      if (!isFieldPresentInRequest(reqBody, field)) {
        invalidFields.push(field);
      }
    });

    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: `Error - Missing fields: ${invalidFields.join(", ")}`,
      });
    }

    const { userId, vaccineName, doseNo } = reqBody;

    const existingAppointment = await Appointment.findOne({
      user: userId,
      vaccineName: vaccineName,
      doseNo: doseNo,
    });

    if (existingAppointment) {
      return res.status(409).json({
        message: "An appointment with the same details already exists!",
      });
    }

    const newAppointment = new Appointment({
        user: userId,
        doseNo: doseNo,
        vaccineName: vaccineName,
    });

    // Save the appointment to the database
    const appointment = await newAppointment.save();

    if (appointment) {
      res.status(201).json({
        appointment: appointment,
        message: "Appointment booked successfully.",
      });
    } else {
      res.status(400).json({
        message: "Error Occurred During Booking New Appointment",
      });
    }
  } catch (error) {
    console.log(`Error while booking appointment: ${error}`);
    return res.status(500).json({
      message: "There was some problem processing the request. Please try again later.",
    });
  }
};

module.exports = { bookAppointment };