const ErrorResponse = require('../util/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @desc      Get all Users
// @route     GET /api/v1/auth/users
// @access    Private/ Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});
// @desc      Get Single User
// @route     GET /api/v1/auth/users/:id
// @access    Private/ Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse('user not found'), 500);
  }
  res.status(200).json({ success: true, data: user });
});

// @desc      Create User
// @route     POST /api/v1/auth/users
// @access    Private/ Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({ success: true, data: user });
});
// @desc      Update User
// @route     PUT /api/v1/auth/users/:id
// @access    Private/ Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: user });
});
// @desc      Delete User
// @route     DELETE /api/v1/auth/users/:id
// @access    Private/ Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, data: {} });
});
