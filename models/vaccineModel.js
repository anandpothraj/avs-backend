const mongoose = require('mongoose');

const VaccineSchema = mongoose.Schema(
    {
        vaccineName: {
            type:String,
            required:true,
            trim:true,
        },
        noOfDose: {
            type:Number,
            required:true,
        },
        timeGap: {
            type:String,
        },
        minAge: {
            type: Number,
            required:true
        },
        addedBy:{
            type:String,
            required:true,
            trim:true,
        },
        addedOn:{
            type:Date,
            required:true,
            trim:true,
        }
    },
    {
        timestamps:true,
    }
);

const Vaccine = mongoose.model("Vaccine", VaccineSchema);

module.exports = Vaccine;    