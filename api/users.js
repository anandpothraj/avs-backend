const OTP = require('../models/otpModel');
const User = require('../models/userModel');
const config = require('../config/default.json');
const generateOtp = require('../utils/generateOtp');
const transporter = require('../utils/transporter');
const generateToken = require('../utils/generateToken');
const { isFieldPresentInRequest } = require('../utils/helper');

// @desc This route is used to send the otp to the user with via email
// @payload ( "otp", "email", "title" )
// @response  ( message )
// @access Private
const sendOtpToEmail = async (otp, email, title) => {
    try {
        const mailOptions = {
            from: config.nodemailer.username,
            to: email,
            subject: title,
            text: `${title} is ${otp}. This OTP is valid for only 2 minutes. Please don't share it with anyone. Thank you!`,
        };
  
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
            console.error("Error while sending OTP:", error);
            // Handle the error, e.g., return an error response
            } else {
            console.log("OTP sent successfully.");
            // Handle success, e.g., log or return a success response
            }
        });
    } catch (error) {
      console.error("Error while sending OTP:", error);
      // Handle the error, e.g., return an error response
    }
  };

// @route GET /api/users/register/checkuser/:aadhaar/:accountType
// @desc This route is used to check if the user already exists for the given aadhaar number and accountType
// @response (message)
// @access Public
const checkUser = async (req, res) => {
    try {
        const { aadhaar, accountType } = req.query;
        if (aadhaar && accountType) {
            const userExists = await User.findOne({ aadhaar, accountType });
            if (userExists) {
                return res.status(409).json({
                    message: "User already exists",
                });
            } 
            else {
                return res.status(200).json({
                    message: "New user",
                });
            }
        }
        else{
            return res.status(400).json({
                message: `Error - Please fill all the fields.`,
            });
        }
    } catch (error) {
        console.log(`Error while checking user: ${error}`);
        return res.status(500).json({
            message: "There was some problem processing the request. Please try again later.",
        });
    }
}

// @route GET /api/users/fetch/details/:aadhaar
// @desc This route is used to fetch user details using aadhaar number
// @payload ("aadhaar")
// @response  (userdetails or message)
// @access Public
const getUserDetails = async (req, res) => {
    try {
        const aadhaar = req.params.aadhaar;
        if(aadhaar){
            const user = await User.findOne({ aadhaar });
            if(user){
                return res.status(200).json({user});
            }
            else{
                return res.status(404).json({
                    message : "Unable to fetch user details",
                })
            }
        }
    } 
    catch (error) {
        console.log(`Error while fetching user details: ${error}`);
        return res.status(500).json({
            message: "There was some problem processing the request. Please try again later.",
        });
    }
}

// @route PUT /api/users/edit/details
// @desc This route is used to edit a user details
// @payload ("aadhaar", "age", "dob", "email", "gender", "name", "phone")
// @response (message)
// @access Private
const editUserDetails = async (req, res) => {
    try {
        let reqBody = req.body;
        let requiredFields = ["aadhaar", "age", "dob", "email", "gender", "name", "phone"];
        const invalidFields = requiredFields.filter((field) => !isFieldPresentInRequest(reqBody, field));
        if (invalidFields.length > 0) {
            return res.status(400).json({
                message: `Error - Missing fields: ${invalidFields.join(", ")}`,
            });
        }

        const { aadhaar, age, dob, email, gender, name, phone } = reqBody;

        const user = await User.findOne({ aadhaar });
        if(user){
            user.age = age;
            user.dob = dob;
            user.email = email;
            user.gender = gender;
            user.name = name;
            user.phone = phone;

            const updatedUser = await user.save();
            if(updatedUser){
                res.status(200).json({
                    message: "User details updated successfully!"
                })
            }
            else{
                res.status(400).json({
                    message:"Error Occured While updating user details!",
                })
            }
        }
        else{
            res.status(404).json({
                message:"User not found!",
            })
        }
    }
    catch (error) {
        console.log(`Error while updating user details: ${error}`);
        return res.status(500).json({
            message: "There was some problem processing the request. Please try again later.",
        });
    };
};

// @route POST /api/users/register/createuser
// @desc This route is used to create a new user
// @payload ("accountType", "aadhaar", "name", "email", "password", "phone", "age", "dob", "gender")
// @response  (token, user, message)
// @access Public
const createUser = async (req, res) => {
    try {
        let reqBody = req.body;
        let requiredFields = ["accountType", "aadhaar", "name", "email", "password", "phone", "age", "dob", "gender"];
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

        const { accountType, aadhaar, name, email, password, phone, age, dob, gender } = reqBody;

        const user = await User.create({
            accountType, name, email, password, phone, age, dob, gender, aadhaar
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
            }
            else{
                res.status(400).json({
                    message:"Error Occured During Register",
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
}

// @route POST /api/users/login/step1
// @desc This route is used to check first step login credentials and send otp to user's email.
// @payload ("accountType", "aadhaar", "password", "title")
// @response  (message)
// @access Public
const authLoginCred = async (req, res) => {
    try {
        let reqBody = req.body;
        let requiredFields = ["accountType", "aadhaar", "password", "title"];
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

        const { accountType, aadhaar, password, title } = reqBody;

        const userExists = await User.findOne({ aadhaar, accountType });
        if (userExists) {
            if(userExists && (await userExists.matchPassword(password))){
                // Check if an OTP already exists for the given Aadhaar number
                const existingOtp = await OTP.findOne({ aadhaar });
                if (existingOtp) {
                    // Delete the existing OTP
                    await existingOtp.deleteOne();
                }
                const email = userExists.email;
                const otp = generateOtp();
                const newOtp = await OTP.create({aadhaar, otp});
                if (newOtp) {
                    // Send the OTP to the user's email
                    sendOtpToEmail(otp, email, title);

                    // Return a success response
                    return res.status(200).json({
                      message: "OTP sent successfully!",
                      email : email
                    });
                }
            }
            else{
                res.status(400);
                res.json({
                    message:"Invalid Credentials",
                })
            }
        } 
        else {
            return res.status(409).json({
                message: "User does not exist!",
            });
        }
    } 
    catch (error) {
        console.log(`Error while registering user: ${error}`);
        return res.status(500).json({
            message: "There was some problem processing the request. Please try again later.",
        });
    }
}

// @route POST /api/users/login/step2
// @desc This route is used to check second step login credentials.
// @payload ("accountType", "aadhaar", "otp")
// @response  (message)
// @access Public
const authOtp = async (req, res) => {
    try {
        let reqBody = req.body;
        let requiredFields = ["accountType", "aadhaar", "otp"];
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

        const { accountType, aadhaar, otp } = reqBody;

        const user = await User.findOne({ aadhaar, accountType });
        if (user) {
            const verified = await OTP.findOne({ aadhaar, otp })
            if(verified){
                await verified.deleteOne();
                res.status(200).json({
                    _id:user._id,
                    accountType:user.accountType,
                    name:user.name,
                    email:user.email,
                    phone:user.phone,
                    age:user.age,
                    dob:user.dob,
                    gender:user.gender,
                    aadhaar:user.aadhaar,
                    token:generateToken(user._id),
                });
            }
            else{
                res.status(400);
                res.json({
                    message:"Invalid OTP",
                })
            }
        } 
        else {
            return res.status(409).json({
                message: "User details doesnot matched!",
            });
        }
    } 
    catch (error) {
        console.log(`Error while registering user: ${error}`);
        return res.status(500).json({
            message: "There was some problem processing the request. Please try again later.",
        });
    }
}

module.exports = { checkUser, createUser, authLoginCred, authOtp, getUserDetails, editUserDetails }; 