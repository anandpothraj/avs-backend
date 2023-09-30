const pdf = require('html-pdf-node');
const nodemailer = require('nodemailer');
const User = require('../models/userModel');
const config = require('../config/default.json');
const Vaccinate = require('../models/vaccinateModal');
const certificateTemplate = require('../document/index');
const Appointment = require('../models/appointmentModel');
const { isFieldPresentInRequest } = require('../utils/helper');

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.nodemailer.username,
    pass: config.nodemailer.password
  },
});

// @route POST /api/patients/book/appointment
// @desc This route is used to create a new appointment and send the appointment details to the user via email
// @payload ( "vaccineName", "doseNo", "userId" )
// @response  ( appointment, message )
// @access Private
const bookAppointment = async (req, res) => {
  try {
    let reqBody = req.body;
    let requiredFields = ["vaccineName", "doseNo", "userId", "maxDose"];
    if(parseInt(reqBody.maxDose) - parseInt(reqBody.doseNo) > 0){
      requiredFields.push("nextDose");
    }
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

    const { userId, vaccineName, doseNo, maxDose, nextDose } = reqBody;

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
      status : "active",
      maxDose : maxDose,
      nextDose : nextDose,
      vaccineName: vaccineName
    });

    // Save the appointment to the database
    const appointment = await newAppointment.save();

    if (appointment) {
      res.status(201).json({
        appointment: appointment,
        message: "Appointment booked successfully!",
      });
    } 
    else {
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

// @route POST /api/patients/send/appointment/email
// @desc This route is used to send the appointment details to the user via email
// @payload ( "patientName", "patientEmail", "vaccineName", "doseNo", "appointmentId" )
// @response  ( message )
// @access Private
const emailAppointmentDetails = async (req, res) => {
  try {
    let reqBody = req.body;
    let requiredFields = [ "patientName", "patientEmail", "vaccineName", "doseNo", "appointmentId", "operationType" ];
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

    const { patientName, patientEmail, vaccineName, doseNo, appointmentId, operationType } = reqBody;

    var mailOptions = {
      from: config.nodemailer.username, // Use environment variables for email addresses
      to: patientEmail,
      subject: `Appointment for ${vaccineName} Dose no ${doseNo} has been ${operationType} successfully!`,
      text: `
        Patient ${patientName}, your appointment for ${vaccineName} Dose no ${doseNo} is successfully booked. Please vaccinate yourself by visiting your nearest hospital.
        Please carry your aadhaar details with you. Your Appointment Number is ${appointmentId}, and note that if you don't vaccinate within 48 hours, the appointment will automatically expire. Thank you!
      `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("There was a problem while sending the message: ", error);
        return res.status(201).json({
          error : error,
          message: `Unable to send appointments details to patient!`,
        });
      } 
      else {
        res.status(201).json({
          appointment: appointment,
          message: "Email of appointment details sent successfully!",
        });
      }
    });


  } catch (error) {
    console.log(`Error while sending appointment details: ${error}`);
    return res.status(500).json({
      message: "There was some problem processing the request. Please try again later.",
    });
  }
}

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
        appointments : [],
        message: "No appointments found for the user."
      });
    }
    return res.status(200).json({
      appointments : appointments
    });
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
      let requiredFields = [ "id", "userId", "vaccineName", "doseNo", "maxDose" ];
      if(parseInt(reqBody.maxDose) - parseInt(reqBody.doseNo) > 0){
        requiredFields.push("nextDose");
      }
      const invalidFields = requiredFields.filter((field) => !isFieldPresentInRequest(reqBody, field));
      if (invalidFields.length > 0) {
        return res.status(400).json({
          message: `Error - Missing fields: ${invalidFields.join(", ")}`,
        });
      }

      const { id, userId, vaccineName, doseNo, maxDose, nextDose } = reqBody;

      const appointment = await Appointment.findById(id);
      if(appointment){
          appointment.vaccineName = vaccineName;
          appointment.doseNo = doseNo;
          appointment.maxDose = maxDose;
          appointment.nextDose = nextDose;

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

// @route GET /api/patients/fetch/vaccinations/:id
// @desc This route is used to fetch all the vaccinations status
// @payload ( "userId" )
// @response  ( vaccinations, message )
// @access Private
const fetchVaccinations = async (req, res) => {
  try {
    const patientId = req.params.id;

    // Fetch all vaccinations for the given user
    const vaccinations = await Vaccinate.find({ patientId : patientId });

    if (vaccinations.length === 0) {
      return res.status(200).json({
        vaccinations : [],
        message: "No vaccinations found for the user."
      });
    }
    return res.status(200).json({
      vaccinations : vaccinations
    });
  } catch (error) {
    console.log(`Error while fetching vaccinations: ${error}`);
    return res.status(500).json({
      message: "There was some problem processing the request. Please try again later.",
    });
  }
}

// @route GET /api/patients/fetch/vaccination/info/:id
// @desc This route is used to fetch all the vaccination details using vaccination id. 
// @payload ( "vaccinationId" )
// @response  ( vaccination details, message )
// @access Private
const fetchVaccinationInfo = async (req, res) => {
  try {
    const vaccinationId = req.params.id;

    // Fetch the vaccination details for the given user id.
    const vaccination = await Vaccinate.findOne({ _id: vaccinationId });

    if (!vaccination) {
      res.status(404).json({
        message:"Vaccinations with this ID is not found!",
      })
    }
    
    if(vaccination){
      const doctor = await User.findOne({ _id : vaccination.doctorId });
      if(doctor){
        res.status(200).json({
          doctorName: doctor.name,
          doseNo: vaccination.doseNo,
          pincode: vaccination.pincode,
          doctorAadhaar: doctor.aadhaar,
          nextDose: vaccination.nextDose,
          vaccinatedOn: vaccination.createdAt,
          vaccineName: vaccination.vaccineName,
          hospitalName: vaccination.hospitalName,
          fullyVaccinated: vaccination.fullyVaccinated,
          remainingNoOfDose: vaccination.remainingNoOfDose,
        });
      }

      if(!doctor){
        res.status(404).json({
          message:"Error while fetching vaccination details!",
        })
      }
    }
  } catch (error) {
    console.log(`Error while fetching vaccination details: ${error}`);
    return res.status(500).json({
      message: "There was some problem processing the request. Please try again later.",
    });
  }
};

// This function is used to send buffer pdf to send vaccination certificate
const sendEmailWithAttachment = async (recipientEmail, vaccineName, doseNo, fileName, pdfBuffer) => {
  const mailOptions = {
    from: config.nodemailer.username,
    to: recipientEmail,
    subject: `Vaccination Certificate for ${vaccineName} Dose No ${doseNo}`,
    text: 'Please find your PDF certificate attached.',
    attachments: [
      {
        filename: fileName,
        content: pdfBuffer, // The PDF buffer
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent with PDF attachment.');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Define the sendErrorResponse function
function sendErrorResponse(res, message) {
  res.status(500).json({ error: message });
}

// This function is used to generate pdf from html template
function generatePdf(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const htmlTemplate = certificateTemplate(query);
      const pdfOptions = { format: 'Letter' };
      let file = { content: htmlTemplate };

      const pdfBuffer = await pdf.generatePdf(file, pdfOptions);
      resolve(pdfBuffer);
    } catch (err) {
      console.error(`Error generating PDF: ${err}`);
      reject(err);
    }
  });
}

// @route GET /api/patients/fetch/certificate?{pdfDetails}
// @desc This route is used to create vaccination certificate using query params and download to 
// @payload ( "vaccinationDetails" )
// @response ( pdf, message )
// @access Private
const fetchPdf = async (req, res) => {
  try {
    const query = req.query;

    if (query) {
      const buffer = await generatePdf(query);

      const fileName = `${query.vaccineName}_0${query.doseNo}.pdf`;

      res
        .status(200)
        .header('Content-Type', 'application/pdf')
        .header('Content-Disposition', `inline; filename="${fileName}"`)
        .send(buffer);
    }
  } catch (error) {
    console.error(`Error while generating vaccination certificate: ${error}`);
    sendErrorResponse(
      res,
      'There was some problem processing the request. Please try again later.'
    );
  }
};

// @route GET /api/patients/send/certificate/email?{pdfDetails}
// @desc This route is used to create vaccination certificate using query params and send to patient email
// @payload ( "vaccinationDetails" )
// @response ( message )
// @access Private
const sendPdf = async (req, res) => {
  try {
    const query = req.query;

    if (query) {
      const fileName = `${query.vaccineName}_0${query.doseNo}.pdf`;
      const buffer = await generatePdf(query);

      if(!buffer){
        res.status(500).json({
          message:"Unable to send Certificate to email!",
        })
      }

      if(buffer){
        await sendEmailWithAttachment(query.patientEmail , query.vaccineName, query.doseNo, fileName, buffer);
      }

      res.status(200).json({
        message: "Certificate sent successfully to email!",
      });
        
    }
  } catch (error) {
    console.error(`Error while generating vaccination certificate: ${error}`);
    sendErrorResponse(
      res,
      'There was some problem processing the request. Please try again later.'
    );
  }
};

module.exports = { bookAppointment, fetchAppointments, editAppointment, deleteAppointment, fetchVaccinations, fetchVaccinationInfo, fetchPdf, sendPdf, emailAppointmentDetails };