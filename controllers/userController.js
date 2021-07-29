const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

//Route Handler/Controller

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    Status: 'Success',
    Results: users.length,
    Data: {
      users: users,
    },
  });
});

exports.updateMe = async (req, res, next) => {
  //1. Create an error if user tries to change password
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('Canot change password here', 400));
  }

  // Filtering for only allowed fields (Fiels not allowed eliminated)
  const filteredBody = filterObj(req.body, 'name', 'email');

  //2.Update User Document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'Success',
    data: {
      user: updatedUser,
    },
  });
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'Success',
    data: null,
  });
});

exports.addUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'Route not yet created!',
  });
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'Route not yet created!',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'Route not yet created!',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'Route not yet created!',
  });
};
