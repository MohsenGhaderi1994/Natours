const User = require('../models/userModel');
const CONSTS = require('../HTTP_RESPONSE_CODES');
const catchAsync = require('./../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        PasswordConfirm: req.body.PasswordConfirm
    });

    res.status(CONSTS.HTTP_CREATED).json({
        status: 'success',
        data: {
            newUser
        }
    });
});
