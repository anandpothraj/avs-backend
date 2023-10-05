const User = require("../models/userModel");
const Vaccinate = require("../models/vaccinateModal");

// @route GET /api/inspectors/fetch/vaccinations/info?{query}
// @desc This route is used to fetch vaccinations info using patient aadhaar, vaccine name, dose no
// @payload ( "aadhaar", "vaccineName" (optional), "doseNo" (optional) )
// @response (vaccination details, patient details, message)
// @access Private
const fetchVaccinationInfo = async (req, res) => {
    try {
        const aadhaar = req.query.aadhaar;
        const vaccineName = req.query.vaccineName;
        const doseNo = req.query.doseNo;
    
        // Fetch the patient details
        const patient = await User.findOne({ aadhaar: aadhaar });
    
        if (!patient) {
            return res.status(404).json({
            message: "Patient Not Found, Please enter a valid aadhaar number!",
            });
        }
  
        const patientId = patient._id;
        const query = { patientId };
        if (vaccineName) query.vaccineName = vaccineName;
        if (doseNo) query.doseNo = doseNo;
    
        const vaccinations = await Vaccinate.find(query);
    
        if (vaccinations.length > 0) {
            return res.status(200).json({
            vaccinations: vaccinations,
            patientInfo: {
                name: patient.name,
                age: patient.age,
                gender: patient.gender,
                aadhaar: patient.aadhaar,
            },
            });
        } else {
            return res.status(200).json({
            vaccinations: [],
            patientInfo: {
                name: patient.name,
                age: patient.age,
                gender: patient.gender,
                aadhaar: patient.aadhaar,
            },
            message: "No vaccinations found!",
            });
        }
    } catch (error) {
      console.error(`Error while fetching vaccination details: ${error}`);
      return res.status(500).json({
        message: "There was some problem processing the request. Please try again later.",
      });
    }
  };

module.exports = { fetchVaccinationInfo };