const express = require("express");
const router = express.Router();
const User = require('../models/userModel');
const { isFieldPresentInRequest } = require('../utils/helper');
const generateToken = require('../utils/generateToken');

// @route POST /api/users/register/checkuser
// @desc This route is used to check if the user already exists for same aadhaar number and accountType
// @payload ("aadhaar","accountType")
// @response  (token, user, message)
// @access Public
router.post("/register/checkuser", async (req, res) => {
    try {
        let reqBody = req.body;
        let requiredFields = ["aadhaar", "accountType"];
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

        const { aadhaar, accountType } = reqBody;

        const userExists = await User.findOne({ aadhaar, accountType });

        if (userExists) {
            return res.status(409).json({
                message: "User already exists",
            });
        }
        else{
            return res.status(200).json({
                message:"New user",
            })
        }
    } 
    catch (error) {
        console.log(`Error while registering user: ${error}`);
        return res.status(500).json({
            message: "There was some problem processing the request. Please try again later.",
        });
    }
});

// @route POST /api/users/register/createuser
// @desc This route is used to create a new user
// @payload ("accountType", "aadhaar", "name", "email", "password", "secretCode", "phone", "age", "dob", "gender")
// @response  (token, user, message)
// @access Public
router.post("/register/createuser", async (req, res) => {
    try {
        let reqBody = req.body;
        let requiredFields = ["accountType", "aadhaar", "name", "email", "password", "secretCode", "phone", "age", "dob", "gender"];
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

        const { accountType, aadhaar, name, email, password, secretCode, phone, age, dob, gender } = reqBody;

        const user = await User.create({
            accountType, name, email, password,secretCode, phone, age, dob, gender, aadhaar
        });

        if(user){
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
                    gender:user.gender,
                    token:generateToken(user._id),
                })
            }else{
                res.status(500).json({
                    msg:"Error Occured During Register",
                })
            }
        }
    } 
    catch (error) {
        console.log(`Error while registering user: ${error}`);
        return res.status(500).json({
            message: "There was some problem processing the request. Please try again later.",
        });
    }
});

module.exports = router;