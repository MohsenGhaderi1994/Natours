const Tour = require('../models/tourModel');
const CONSTS = require('../HTTP_RESPONSE_CODES');
exports.createTour = async (req, res) => {
    /* we call the save method on the document
  const newTour = new Tour({})
  newTour.save();
  */
    try {
        const newTour = await Tour.create(req.body);

        res.status(CONSTS.HTTP_CREATED).json({
            status: 'Success',
            data: { newTour }
        });
    } catch (err) {
        res.status(CONSTS.HTTP_BAD_REQUEST).json({
            status: 'fail',
            message: err
        });
    }
};

exports.getAllTours = async (req, res) => {
    try {
        const tours = await Tour.find();
        res.status(CONSTS.HTTP_OK).json({ status: 'Success', data: { tours } });
    } catch (err) {
        res.status(CONSTS.HTTP_NOT_FOUND).json({
            status: 'fail',
            message: err
        });
    }
};

exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(CONSTS.HTTP_OK).json({ status: 'Success', data: { tour } });
    } catch (err) {
        res.status(CONSTS.HTTP_NOT_FOUND).json({
            status: 'fail',
            message: err
        });
    }
};

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(CONSTS.HTTP_OK).json({ status: 'Success', data: tour });
    } catch (err) {
        res.status(CONSTS.HTTP_NOT_FOUND).json({
            status: 'fail',
            message: err
        });
    }
};

exports.deleteTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndDelete(req.param.id);
        res.status(CONSTS.HTTP_NO_CONTENT).json({ status: 'Success' });
    } catch (err) {
        res.status(CONSTS.HTTP_NOT_FOUND).json({
            status: 'fail',
            message: err
        });
    }
};
