const SALT_ROUNDS = 10;
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    accountType: {
        type: String,
        required: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    secretCode: {
        type: Number,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
        trim: true,
    },
    age: {
        type: Number,
        required: true,
        trim: true,
    },
    dob: {
        type: Date,
        required: true,
        trim: true,
    },
    gender: {
        type: String,
        required: true,
        trim: true,
    },
    aadhaar: {
        type: Number,
        required: true,
        trim: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
  
// Create a compound index on 'aadhaar' and 'accountType' fields
userSchema.index({ aadhaar: 1, accountType: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);
module.exports = User;   