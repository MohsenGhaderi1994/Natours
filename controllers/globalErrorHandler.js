const CONSTS = require('./../HTTP_RESPONSE_CODES');
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || CONSTS.HTTP_INTERNAL_SERVER_ERROR;
    err.status = err.status || 'error';
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
};
