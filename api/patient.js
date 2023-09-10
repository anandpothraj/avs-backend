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

// @route GET /api/patients/fetch/appointments/:id
// @desc This route is used to fetch all the appointments
// @payload ( "userId" )
// @response  ( appointments, message )
// @access Private
const fetchAppointments = async (req, res) => {
  try {
    const userId = req.params.id;

    // Fetch all appointments for the given user
    const appointments = await Appointment.find({ user: userId });

    if (appointments.length === 0) {
      return res.status(200).json({
        message: "No appointments found for the user.",
      });
    }
    return res.status(200).json(appointments);
  } catch (error) {
    console.log(`Error while fetching appointments: ${error}`);
    return res.status(500).json({
      message: "There was some problem processing the request. Please try again later.",
    });
  }
}

// @route PUT /api/patients/edit/appointment
// @desc This route is used to edit an appointment
// @payload ( "id", "userId", "vaccineName", "doseNo" )
// @response  ( appointment, message )
// @access Private
const editAppointment = async (req, res) => {
  try {
      let reqBody = req.body;
      let requiredFields = [ "id", "userId", "vaccineName", "doseNo" ];
      const invalidFields = requiredFields.filter((field) => !isFieldPresentInRequest(reqBody, field));
      if (invalidFields.length > 0) {
          return res.status(400).json({
              message: `Error - Missing fields: ${invalidFields.join(", ")}`,
          });
      }

      const { id, userId, vaccineName, doseNo } = reqBody;

      const appointment = await Appointment.findById(id);
      if(appointment){
          appointment.vaccineName = vaccineName;
          appointment.doseNo = doseNo;

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

          const updatedAppointment = await appointment.save();

          if(updatedAppointment){
              res.status(200).json({
                  message: "Appointment updated successfully!"
              })
          }
          else{
              res.status(400).json({
                  message:"Error Occured While updating vaccine!",
              })
          }
      }
      else{
          res.status(404).json({
              message:"Appointment with this ID is not found!",
          })
      }
  }
  catch (error) {
      console.log(`Error while editing appointment: ${error}`);
      return res.status(500).json({
          message: "There was some problem processing the request. Please try again later.",
      });
  };
};

// @route DELETE /api/patients/remove/appointment/:id
// @desc This route is used to delete an appointment
// @response (message)
// @access Private
const deleteAppointment = async (req, res) => {
  try {
      const appointment = await Appointment.findById(req.params.id);
      if (!appointment) {
          return res.status(404).json({
          message: "Appointment with this ID is not found!",
          });
      }
      const deletedAppointment = await appointment.deleteOne();
      if (deletedAppointment) {
          return res.status(202).json({
          message: "Appointment deleted successfully!",
          });
      } 
      else {
          return res.status(400).json({
          message: "Error occurred while deleting appointment!",
          });
      }
  } 
  catch (error) {
    console.error(`Error while deleting appointment: ${error}`);
    return res.status(500).json({
      message: "There was some problem processing the request. Please try again later.",
    });
  }
};

module.exports = { bookAppointment, fetchAppointments, editAppointment, deleteAppointment };