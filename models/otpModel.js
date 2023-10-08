const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  aadhaar: {
    type: Number,
    required: true,
    unique: true,
  },
  otp: {
    type: Number,
    required: true,
  }
},
{
    timestamps: true,
});

otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 120 });

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;