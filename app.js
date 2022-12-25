const express = require('express');
const path = require('path');
const morgan = require('morgan');
const errorHandler=require('./middlewares/error-handler');
const indexRouter = require('./routes/index');
const cors = require('cors');

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(errorHandler.handleNotfoundError);

// error handler
app.use(errorHandler.handleErrors);

module.exports = app;
