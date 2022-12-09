//* ** ********************************* *****
//* ** all error handling should go here *****
//* ** ********************************* *****


const AppError = require('../models/app-error');
const AppResponse = require('../models/app-response');
const config = require('../config/index');

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

exports.handleNotfoundError = (req, res, next) => {
    next(new AppError(`Can\'t find ${req.originalUrl}`, 404));
};
const handleDuplicateFieldsDB = (err) => {
    const value = err.message.match(/(["'])(\\?.)*?\1/)[0];

    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);

    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleJWTError = () =>
    new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
    new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err, req, res) => {
    const data={
        message: err.message,
        stack: err.stack,
        err,
    };
    new AppResponse(res,data,err.statusCode).send()
};
const sendErrorProd = (err, req, res) => {
    let statusCode = 500;
    let data = {};
    // can be sent to the user
    if (err.isOperational) {
        statusCode = err.statusCode;
        data = {
            message: err.message,
        }
    } else {
        statusCode=500;
        data = {
            message: `Something Went Wrong!`,
        }
    }
    new AppResponse(res,data,statusCode).send()
    
};


exports.handleErrors = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    let error = { ...err };
    error.message = err.message;

    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    if (config.IS_DEV) {
        sendErrorDev(error, req, res);
    } else {
        sendErrorProd(error, req, res);
    }
};

