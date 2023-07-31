const Vaccine = require('../models/vaccineModel');
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

// @route DELETE /api/doctor/delete/vaccine/:id
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

module.exports = { fetchVaccines, addVaccine, editVaccine, deleteVaccine }; 