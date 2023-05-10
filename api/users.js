const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const { isFieldPresentInRequest } = require("../utils/helper");

// @route POST /api/users/login/first
// @desc This route is used to complete the first stage login
// @payload ("aadhaar","password")
// @response  (token, user, message)
// @access Public
router.post("/login/first", (req, res)  => {
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
        User.findOne({ aadhaar })
            .then((user) => {
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
            })
            .catch((error) => {
                console.log(`Error while login user: ${error}`);
                return res.status(500).json({
                    message:
                    "There was some problem processing the request. Please try again later.",
                });
            });
    } catch (e) {
        console.log(`Error while login user: ${e}`);
        return res.status(500).json({
        message:
            "There was some problem processing the request. Please try again later.",
        });
    }
});