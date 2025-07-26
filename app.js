require("dotenv").config()
require("./utilities/database")
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var employeeRouter = require('./routes/employee');
var categoryRouter = require('./routes/category');
var homeContentRouter = require('./routes/homeContent');
var latestJobsRouter = require('./routes/latestJobs');
var thumbnailRouter = require('./routes/thumbnail');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/employee', employeeRouter);
app.use('/category', categoryRouter);
app.use('/home-content', homeContentRouter);
app.use('/latest-jobs', latestJobsRouter);
app.use('/thumbnails', thumbnailRouter);

module.exports = app;
