const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    vaccineName: {
      type: String,
      required: true,
      trim: true,
    },
    doseNo: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    maxDose : {
      type: Number,
      required: true,
    },
    status : {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

appointmentSchema.index({ createdAt: 1 }, { expireAfterSeconds: 48 * 60 * 60 });

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;