const AppError = require('../utils/AppError');
const CONSTS = require('./../HTTP_RESPONSE_CODES');

const handleCastErrorDB = (err) => {
    const message = `invalid ${err.path}: ${err.value}!`;
    return new AppError(message, CONSTS.HTTP_BAD_REQUEST);
};

const handleDuplicateFieldDB = (err) => {
    console.log(`handleDuplicateFieldDB::error -> ${JSON.stringify(err)}`);
    const value = err.keyValue.name;
    console.log(`handleDuplicateFieldDB::value -> <${value}>`);
    const message = `duplicate field value ${value}, please use another value!`;
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
    console.log(`globalerrorHandler::error -> ${err}`);
    console.log(`globalerrorHandler::errorCode -> ${err.code}`);
    err.statusCode = err.statusCode || CONSTS.HTTP_INTERNAL_SERVER_ERROR;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = JSON.parse(JSON.stringify(err));
        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldDB(error);
        if (error.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        sendErrorProduction(error, res);
    }
};

module.exports = globalerrorHandler;
