const User = require('../models/userModel');
const CONSTS = require('../HTTP_RESPONSE_CODES');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/AppError');

const signToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_IN
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        PasswordConfirm: req.body.PasswordConfirm
    });

    token = signToken(newUser._id);

    res.status(CONSTS.HTTP_CREATED).json({
        status: 'success',
        data: {
            newUser
        },
        token
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    //1) input validation
    if (!email || !password) {
        return next(
            new AppError(
                'Please provide email and password!',
                CONSTS.HTTP_BAD_REQUEST
            )
        );
    }

    //2) check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(
            new AppError(
                'Incorrect email or password!',
                CONSTS.HTTP_UNATHORIZED
            )
        );
    }

    //3) generate token and return it
    const token = signToken(user._id);
    res.status(CONSTS.HTTP_OK).json({
        status: 'success',
        token
    });
});
