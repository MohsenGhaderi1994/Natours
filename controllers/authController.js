const { promisify } = require('util');
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

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    //1) check that token is there
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
        console.log(`token is <${token}>`);
    } else {
        return next(
            new AppError(
                'You are not logged in. Please login to continue!',
                CONSTS.HTTP_UNATHORIZED
            )
        );
    }

    //2) verify the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(`decoded token is: ${JSON.stringify(decoded)}`);

    //3) check if user still exists
    const loadUser = await User.findById(decoded.id);
    if (!loadUser) {
        next(
            new AppError(
                'The user with the token does not exist!',
                CONSTS.HTTP_UNATHORIZED
            )
        );
    }

    //4) check for password change after that token was generated
    if (loadUser.changedPasswordAfterLogin(decoded.iat)) {
        return next(
            new AppError(
                'User changed password! please login again!',
                CONSTS.HTTP_UNATHORIZED
            )
        );
    }
    next();
});
