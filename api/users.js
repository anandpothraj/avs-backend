const express = require("express");
const router = express.Router();
const User = require('../models/userModel');
const { isFieldPresentInRequest } = require('../utils/helper');

// @route POST /api/users/register/checkAadhaar
// @desc This route is used to check if user already exist for aadhaar number or not 
// @payload ("aadhaar")
// @response  (token, user, message)
// @access Public
router.post("/register/checkaadhaar", async (req, res) => {
    try {
        let reqBody = req.body;
        let requiredFields = ["aadhaar"];
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

        const { aadhaar } = reqBody;

        const aadhaarExists = await User.findOne({ aadhaar });

        if(aadhaarExists){
            res.status(403).json({
                message:"Aadhaar Already exist",
            })
        }
        else{
            res.json({message:"New Aadhaar"});
        }
    } 
    catch (e) {
        console.log(`Error while registering user: ${e}`);
        return res.status(500).json({message:"There was some problem processing the request. Please try again later."});
    }
});

router.post("/register/createuser", async (req, res) => {
    try {
        let reqBody = req.body;
        let requiredFields = ["accountType", "name", "aadhaar", "email", "password", "secretCode", "phone", "age", "dob", "gender"];
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
        const { accountType, name, aadhaar, email, password, secretCode, phone, age, dob, gender } = req.body;

        const user = await User.create({accountType, name, email, password,secretCode, phone, age, dob, gender, aadhaar});
    
        if(user) {
            res.status(201).json({
                _id:user._id,
                accountType:user.accountType,
                name:user.name,
                aadhaar:user.aadhaar,
                email:user.email,
                phone:user.phone,
                age:user.age,
                dob:user.dob,
                gender:user.gender
            })
        }else{
            res.status(400).json({message:"Error occured during register"})
        }

    } 
    catch (e) {
        console.log(`Error while registering user: ${e}`);
        return res.status(500).json({message:"There was some problem processing the request. Please try again later."});
    }
})

// @route POST /api/users/login/first
// @desc This route is used to complete the first stage login
// @payload ("aadhaar","password")
// @response  (token, user, message)
// @access Public
router.post("/login/first", async (req, res)  => {
    try {
        let reqBody = req.body;
        let requiredFields = ["aadhaar", "password"];
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
        const { aadhaar, password } = reqBody;
        const user = await User.findOne({ aadhaar });
        if (!user) {
            return res.status(400).json({
                message: "User does not exist.",
            });
        }
        else{
            if(user && ( user.matchPassword(password))){
                res.json({msg:"Correct Aadhaar number and password"});
            }
            else{
                res.status(400);
                res.json({
                    msg:"Invalid Credentials",
                })
            }
        }
    } 
    catch (e) {
        console.log(`Error while login user: ${e}`);
        return res.status(500).json({
        message:
            "There was some problem processing the request. Please try again later.",
        });
    }
});

module.exports = router;