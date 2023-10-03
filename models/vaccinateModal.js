const mongoose = require('mongoose');

const vaccinateSchema = new mongoose.Schema(
    {
        certificateId : {
            type: Number,
            unique: true,
        },
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
        },
        remainingNoOfDose : {
            type: Number,
            required: true,
            trim: true,
        },
        nextDose : {
            type: String,
            required : false
        }
    },
    {
        timestamps: true,
    }
);

// Pre-save middleware to generate a unique 10-digit certificate ID
vaccinateSchema.pre('save', function(next) {
    if (this.isNew) {
        // Generate a 10-digit random integer
        const min = 1000000000;
        const max = 9999999999;
        this.certificateId = Math.floor(min + Math.random() * (max - min + 1));
    }
    next();
});

const Vaccinate = mongoose.model('Vaccinate', vaccinateSchema);
module.exports = Vaccinate;