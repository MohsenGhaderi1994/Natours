const User = require('../models/userModel');
const CONSTS = require('../HTTP_RESPONSE_CODES');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        PasswordConfirm: req.body.PasswordConfirm
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_IN
    });

    res.status(CONSTS.HTTP_CREATED).json({
        status: 'success',
        data: {
            newUser
        },
        token
    });
});
