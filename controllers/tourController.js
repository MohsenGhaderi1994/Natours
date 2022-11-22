const Tour = require('../models/tourModel');
const CONSTS = require('../HTTP_RESPONSE_CODES');
const APIFeatures = require('./../utils/APIFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body);

    res.status(CONSTS.HTTP_CREATED).json({
        status: 'Success',
        data: { newTour }
    });
});

exports.getAllTours = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitField()
        .paginate();

    const tours = await features.query;

    res.status(CONSTS.HTTP_OK).json({
        status: 'Success',
        dataSize: tours.length,
        data: { tours }
    });
});

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAvergae,price';
    req.query.fields = 'name,price,ratingAverage,summary,difficulty';
    next();
};

exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
        return next(new AppError('No tour found!', CONSTS.HTTP_NOT_FOUND));
    }
    res.status(CONSTS.HTTP_OK).json({ status: 'Success', data: { tour } });
});

exports.updateTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!tour) {
        return next(new AppError('No tour found!', CONSTS.HTTP_NOT_FOUND));
    }

    res.status(CONSTS.HTTP_OK).json({ status: 'Success', data: tour });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.param.id);
    if (!tour) {
        return next(new AppError('No tour found!', CONSTS.HTTP_NOT_FOUND));
    }
    res.status(CONSTS.HTTP_NO_CONTENT).json({ status: 'Success' });
});
