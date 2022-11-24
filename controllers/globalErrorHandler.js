const AppError = require('../utils/AppError');
const CONSTS = require('./../HTTP_RESPONSE_CODES');

const handleCastErrorDB = (err) => {
    const message = `invalid ${err.path}: ${err.value}!`;
    return new AppError(message, CONSTS.HTTP_BAD_REQUEST);
};

const handleDuplicateFieldDB = (err) => {
    console.log(`handleDuplicateFieldDB::error -> ${JSON.stringify(err)}`);
    const value = err.keyValue;
    console.log(`handleDuplicateFieldDB::value -> <${JSON.stringify(value)}>`);
    const message = `duplicate field value ${JSON.stringify(
        value
    )}, please use another value!`;
    return new AppError(message, CONSTS.HTTP_BAD_REQUEST);
};

const handleValidationErrorDB = (err) => {
    console.log(`handleValidationErrorDB::error -> ${JSON.stringify(err)}`);
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data! ${errors.join('. ')}`;
    return new AppError(message, CONSTS.HTTP_BAD_REQUEST);
};

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorProduction = (err, res) => {
    console.log(`sendErrorProduction::errorstatus -> ${err.status}`);
    console.log(`sendErrorProduction::errormessage -> ${err.message}`);
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        console.log('ERROR', err);

        res.status(CONSTS.HTTP_INTERNAL_SERVER_ERROR).json({
            status: 'error',
            message: 'Something went wrong!'
        });
    }
};

const globalerrorHandler = (err, req, res, next) => {
    console.log(`globalerrorHandler::error -> ${JSON.stringify(err)}`);
    console.log(`globalerrorHandler::errormessage -> ${err.message}`);
    err.statusCode = err.statusCode || CONSTS.HTTP_INTERNAL_SERVER_ERROR;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = JSON.parse(JSON.stringify(err));
        error.message = err.message;
        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldDB(error);
        if (error.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        sendErrorProduction(error, res);
    }
};

module.exports = globalerrorHandler;
