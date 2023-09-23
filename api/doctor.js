const User = require('../models/userModel');
const Vaccine = require('../models/vaccineModel');
const Vaccinate = require('../models/vaccinateModal');
const Appointment = require('../models/appointmentModel');
const { isFieldPresentInRequest } = require('../utils/helper');

// @route GET /api/doctor/fetch/vaccines
// @desc This route is used to fetch the list of all vaccines
// @response (json)
// @access Private
const fetchVaccines = async (req, res) => {
    try {
        const vaccines = await Vaccine.find({});
        if (vaccines) {
            return res.status(200).json(vaccines);
        } 
        else {
            return res.status(404).json({
                message: "No vaccines found!",
            });
        }
    } 
    catch (error) {
        console.log(`Error while fetching users: ${error}`);
        return res.status(500).json({
            message: "There was some problem processing the request. Please try again later.",
        });
    }
}

// @route POST /api/doctor/add/vaccine
// @desc This route is used to add new vaccine
// @response (message)
// @access Private
const addVaccine = async (req, res) => {
    try {
        let reqBody = req.body;
        let requiredFields = ["vaccineName", "noOfDose", "minAge", "addedBy", "addedOn"];
        if(reqBody.noOfDose > 1){
            requiredFields.push("timeGap");
        }
        const invalidFields = requiredFields.filter((field) => !isFieldPresentInRequest(reqBody, field));
        if (invalidFields.length > 0) {
            return res.status(400).json({
                message: `Error - Missing fields: ${invalidFields.join(", ")}`,
            });
        }
        
        const { vaccineName, noOfDose, minAge, timeGap, addedBy, addedOn } = reqBody;

        const vaccineExists = await Vaccine.findOne({ vaccineName });
        if (vaccineExists) {
            return res.status(409).json({
                message: "Vaccine already exists",
            });
        } 
        else {
            const vaccine = await Vaccine.create({vaccineName, noOfDose, minAge, timeGap, addedBy, addedOn});
            if(vaccine) {
                res.status(201).json({
                    message: "Vaccine added successfully!"
                })
            }
            else{
                res.status(400).json({
                    message:"Error Occured While adding vaccine!",
                })
            }
        }
    }
    catch (error) {
        console.log(`Error while adding new vaccine: ${error}`);
        return res.status(500).json({
            message: "There was some problem processing the request. Please try again later.",
        });
    };
};

// @route PUT /api/doctor/edit/vaccine/:id
// @desc This route is used to edit a vaccine
// @response (message)
// @access Private
const editVaccine = async (req, res) => {
    try {
        let reqBody = req.body;
        let requiredFields = ["vaccineName", "noOfDose", "minAge", "addedBy", "addedOn"];
        if(reqBody.noOfDose > 1){
            requiredFields.push("timeGap");
        }
        const invalidFields = requiredFields.filter((field) => !isFieldPresentInRequest(reqBody, field));
        if (invalidFields.length > 0) {
            return res.status(400).json({
                message: `Error - Missing fields: ${invalidFields.join(", ")}`,
            });
        }

        const { vaccineName, noOfDose, minAge, timeGap, addedBy, addedOn } = reqBody;

        const vaccine = await Vaccine.findById(req.params.id);
        if(vaccine){
            vaccine.vaccineName = vaccineName;
            vaccine.noOfDose = noOfDose;
            vaccine.timeGap = timeGap;
            vaccine.minAge = minAge;
            vaccine.addedBy = addedBy;
            vaccine.addedOn = addedOn;

            const updatedVaccine = await vaccine.save();
            if(updatedVaccine){
                res.status(200).json({
                    message: "Vaccine updated successfully!"
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
                message:"Vaccine with this ID is not found!",
            })
        }
    }
    catch (error) {
        console.log(`Error while adding new vaccine: ${error}`);
        return res.status(500).json({
            message: "There was some problem processing the request. Please try again later.",
        });
    };
};

// @route DELETE /api/doctor/remove/vaccine/:id
// @desc This route is used to delete a vaccine
// @response (message)
// @access Private
const deleteVaccine = async (req, res) => {
    try {
        const vaccine = await Vaccine.findById(req.params.id);
        if (!vaccine) {
            return res.status(404).json({
            message: "Vaccine with this ID is not found!",
            });
        }
        const deletedVaccine = await vaccine.deleteOne();
        if (deletedVaccine) {
            return res.status(202).json({
            message: "Vaccine deleted successfully!",
            });
        } 
        else {
            return res.status(400).json({
            message: "Error occurred while deleting vaccine!",
            });
        }
    } 
    catch (error) {
      console.error(`Error while deleting vaccine: ${error}`);
      return res.status(500).json({
        message: "There was some problem processing the request. Please try again later.",
      });
    }
};

// @desc This API is used to fetch the appointments and user details using Aadhaar ID.
// @payload ( "appointment, userdetails" )
// @response  ( { user, appointment }, message )
// @access Private
const fetchAppointmentByAadhaar = async (req, res) => {
    try {
        const aadhaar = req.params.aadhaar;

        // Fetching user details using Aadhaar
        const userDetails = await User.findOne({ aadhaar });

        if (!userDetails) {
            return res.status(404).json({
                message: "No user found for the provided Aadhaar number.",
            });
        }

        // Fetching active appointments for the user
        const activeAppointments = await Appointment.find({
            user: userDetails._id,
            status: "active", // Filter appointments with status "active"
        });

        if (!activeAppointments || activeAppointments.length === 0) {
            return res.status(404).json({
                message: "No active appointments found for the provided Aadhaar number.",
            });
        }

        // Constructing the response
        const response = {
            user: {
                age: userDetails.age,
                name: userDetails.name,
                userId: userDetails._id,
                gender: userDetails.gender,
                aadhaar: userDetails.aadhaar
            },
            appointment: activeAppointments.map((appointment) => ({
                doseNo: appointment.doseNo,
                status: appointment.status,
                maxDose: appointment.maxDose,
                appointmentId: appointment._id,
                nextDose: appointment.nextDose,
                vaccineName: appointment.vaccineName,
            })),
        };

        return res.status(200).json(response);
    } catch (error) {
        console.error(`Error while fetching active appointments using user details: ${error}`);
        return res.status(500).json({
            message: "There was some problem processing the request. Please try again later.",
        });
    }
};

// @route GET /api/doctors/fetch/appointment/:bookingId
// @desc This route is used to fetch the appointment using booking id and return user detail along with appointment detail.
// @payload ( "bookingId" )
// @response  ( { user, appointment }, message )
// @access Private
const fetchAppointmentByBookingId = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;

        // Fetch the appointment for the provided booking id.
        const appointment = await Appointment.findById(bookingId);

        if (appointment && appointment.status === "deactive") {
            return res.status(409).json({
                message: "Patient is already vaccinated for the provided booking id.",
            });
        }

        if (!appointment) {
            return res.status(404).json({
                message: "No appointment found for the provided booking id.",
            });
        }

        // Fetch the user details from user id.
        const userDetails = await User.findById(appointment.user);

        if (!userDetails) {
            return res.status(404).json({
                message: "User details not found!",
            });
        }

        // Constructing the response
        const response = {
            user: {
                age: userDetails.age,
                name: userDetails.name,
                userId: userDetails._id,
                gender: userDetails.gender,
                aadhaar: userDetails.aadhaar
            },
            appointment: {
                doseNo: appointment.doseNo,
                status : appointment.status,
                maxDose: appointment.maxDose,
                appointmentId: appointment._id,
                nextDose : appointment.nextDose,
                vaccineName: appointment.vaccineName,
            },
        };

        return res.status(200).json(response);
        
    } catch (error) {
        console.error(`Error while fetching appointment and user details: ${error}`);
        return res.status(500).json({
            message: "There was some problem processing the request. Please try again later.",
        });
    }
};

// @route POST /api/doctor/vaccinate/patient
// @desc This route is used to vaccinate patient using user id.
// @response (message)
// @access Private
const vaccinatePatient = async (req, res) => {
    try {
        let reqBody = req.body;
        let requiredFields = [ "patientId", "doctorId", "vaccineName", "doseNo", "hospitalName", "pincode", "maxDose", "appointmentId"];
        if(parseInt(reqBody.maxDose) - parseInt(reqBody.doseNo) > 0){
            requiredFields.push("nextDose");
        }
        const invalidFields = requiredFields.filter((field) => !isFieldPresentInRequest(reqBody, field));
        if (invalidFields.length > 0) {
            return res.status(400).json({
                message: `Error - Missing fields: ${invalidFields.join(", ")}`,
            });
        }
        
        const { patientId, doctorId, vaccineName, doseNo, hospitalName, pincode, maxDose, appointmentId, nextDose } = reqBody;

        const alreadyVaccinated = await Vaccinate.findOne({
            patientId : patientId,
            vaccineName: vaccineName,
            doseNo: doseNo,
        });
      
        if (alreadyVaccinated) {
            return res.status(409).json({
                message: "Patient is already vaccinated with the same vaccine and dose number!",
            });
        }
      
        const newVaccinate = new Vaccinate({
            patientId : patientId,
            doctorId : doctorId, 
            vaccineName : vaccineName,
            doseNo : doseNo, 
            hospitalName : hospitalName, 
            pincode : pincode,
            fullyVaccinated : doseNo === maxDose ? true : false,
            remainingNoOfDose : maxDose - doseNo,
            nextDose : nextDose
        });
      
        // Save the vaccination to the database
        const vaccinate = await newVaccinate.save();
        
        if (vaccinate) {

            const appointment = await Appointment.findById(appointmentId);

            if(appointment){
                appointment.status = "deactive";

                const updatedAppointment = await appointment.save();
                if (updatedAppointment) {
                    res.status(201).json({
                        vaccinate: vaccinate,
                        message: "Patient vaccinated successfully...!",
                    });
                } 
                else {
                    return res.status(400).json({
                    message: "Error occurred while deleting appointment!",
                    });
                }
            } 
            else {
                res.status(400).json({
                message: "Error Occurred During vaccinating patient",
                });
            }
        }
        else {
            res.status(400).json({
                message: "Error!! Patient is not vaccined, Error Occurred During vaccinating patient",
            });
        }
    }
    catch (error) {
        console.log(`Error while vaccinating patient: ${error}`);
        return res.status(500).json({
            message: "There was some problem processing the request. Please try again later.",
        });
    };
};


module.exports = { fetchVaccines, addVaccine, editVaccine, deleteVaccine, fetchAppointmentByAadhaar, fetchAppointmentByBookingId, vaccinatePatient }; 