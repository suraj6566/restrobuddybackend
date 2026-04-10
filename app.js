var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var stateCityRouter = require('./routes/statecity');
var restaurantRouter = require('./routes/restaurant');
var categoryRouter = require('./routes/category');
var subcategoryRouter = require('./routes/subcategory');
var foodRouter = require('./routes/food');
var timingRouter = require('./routes/timing');
var adminRouter = require('./routes/admin');
var userinterfaceRouter = require('./routes/userinterface');
var restaurantpicturesRouter = require('./routes/restaurantpictures');
var apiRouter = require('./routes/api');

var app = express();

app.use(cors({
  origin: ["http://localhost:3000", "https://restrobuddy-seven.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.options('*', cors()); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ ROUTES
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/statecity', stateCityRouter);
app.use('/restaurant', restaurantRouter);
app.use('/category', categoryRouter);
app.use('/subcategory', subcategoryRouter);
app.use('/food', foodRouter);
app.use('/api', apiRouter);
app.use('/timing', timingRouter);
app.use('/admin', adminRouter);
app.use('/userinterface', userinterfaceRouter);
app.use('/restaurantpictures', restaurantpicturesRouter);

// ❌ 404 handler
app.use(function(req, res, next) {
  next(createError(404));
});

// ❌ error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({
    success: false,
    message: err.message
  });
});

module.exports = app;
