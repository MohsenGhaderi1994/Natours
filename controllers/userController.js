const User = require('../models/userModel');
const CONSTS = require('../HTTP_RESPONSE_CODES');
const catchAsync = require('./../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    res.status(CONSTS.HTTP_OK).json({
        status: 'Success',
        dataSize: users.length,
        data: { users }
    });
});
