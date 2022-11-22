const CONSTS = require('./../HTTP_RESPONSE_CODES');
const sendErrorDev = (req, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorProduction = (req, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || CONSTS.HTTP_INTERNAL_SERVER_ERROR;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        sendErrorProduction(err, res);
    }
};
