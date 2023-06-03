const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const { isFieldPresentInRequest } = require('../utils/helper');

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

// @route POST /api/users/register/createuser
// @desc This route is used to create a new user
// @payload ("accountType", "aadhaar", "name", "email", "password", "secretCode", "phone", "age", "dob", "gender")
// @response  (token, user, message)
// @access Public
const createUser = async (req, res) => {
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

// @route POST /api/users/login/first
// @desc This route is used to check first step login credentials.
// @payload ("accountType", "aadhaar", "password")
// @response  (message)
// @access Public
const authLoginCred = async (req, res) => {
    try {
        let reqBody = req.body;
        let requiredFields = ["accountType", "aadhaar", "password"];
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

        const { accountType, aadhaar, password } = reqBody;

        const userExists = await User.findOne({ aadhaar, accountType });
        if (userExists) {
            if(userExists && (await userExists.matchPassword(password))){
                res.status(200).json({message:"Correct Aadhaar number and password"});
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

// @route POST /api/users/login/first
// @desc This route is used to check first step login credentials.
// @payload ("accountType", "aadhaar", "password")
// @response  (message)
// @access Public
const authSecretCode = async (req, res) => {
    try {
        let reqBody = req.body;
        let requiredFields = ["accountType", "aadhaar", "secretCode"];
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

        const { accountType, aadhaar, secretCode } = reqBody;

        const userExists = await User.findOne({ aadhaar, accountType });
        if (userExists) {
            if(userExists && userExists.secretCode == secretCode){
                console.log(userExists.secretCode);
                res.status(200).json({message:"Correct Secret code"});
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

module.exports = { checkUser, createUser, authLoginCred, authSecretCode }; 