const mongoose = require('mongoose');

const vaccinateSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        vaccineName: {
            type: String,
            required: true,
            trim: true,
        },
        doseNo: {
            type: Number,
            required: true,
        },
        doctorId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        hospitalName : {
            type: String,
            required: true,
            trim: true,
        },
        pincode : {
            type: Number,
            required: true,
            trim: true,
        },
        fullyVaccinated : {
            type: Boolean,
            required: true,
            trim: true,
        }
    },
    {
        timestamps: true,
    }
);

const Vaccinate = mongoose.model('Vaccinate', vaccinateSchema);
module.exports = Vaccinate;