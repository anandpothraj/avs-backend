const Vaccine = require('../models/vaccineModal');
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
    } catch (error) {
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
        let requiredFields = ["vaccineName", "noOfDose", "minAge", "timeGap", "addedBy", "addedOn"];
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

module.exports = { fetchVaccines, addVaccine }; 