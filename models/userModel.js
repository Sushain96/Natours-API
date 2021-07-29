const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A USER MUST HAVE A NAME'],
    // maxlength: ['40', 'A name should not be exceeding 40 characters.'],
    // minlength: ['10', 'A name should  be atleast 100 characters.'],
    // // validate: [validator.isAlpha, 'Tour name is only characters '],
  },
  email: {
    type: String,
    required: [true, 'A USER MUST HAVE AN EMAIL'],
    unique: [true, 'Email already exists'],
    lowercase: true,
    validate: [validator.isEmail, 'please provide a valid email'],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'guide', 'lead-guide', 'admin'],
    },
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Kindly enter Password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Kindly confirm Password'],
    validate: {
      validator: function (val) {
        // this only works on CREATE and SAVE!!
        return val === this.password;
      },
      message: 'Passwords donot match',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  //Only run this function when passwords were modified.
  if (!this.isModified('password')) {
    return next();
  }
  // Hash the pssword with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // This points to the current Query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  //FALSE MEANS NOT CHANGED
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken });

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
