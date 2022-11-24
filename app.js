const express = require('express');
const CONSTS = require('./HTTP_RESPONSE_CODES');
const AppError = require('./utils/AppError');
const morgan = require('morgan');
const globalErrorHandler = require('./controllers/globalErrorHandler');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Middlewares
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log(`timestamp attached to the req. new req is ${req.requestTime}`);
    next();
});

//Routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//other routes
app.all('*', (req, res, next) => {
    next(
        new AppError(
            `Cannot find reosurse ${req.originalUrl} on server side!`,
            CONSTS.HTTP_NOT_FOUND
        )
    );
});

//Global Error handler
app.use(globalErrorHandler);

module.exports = app;
