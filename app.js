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
var userinterfaceRouter = require('./routes/userinterface')
var restaurantpicturesRouter =require('./routes/restaurantpictures')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/statecity', stateCityRouter);
app.use('/restaurant', restaurantRouter);
app.use('/category',categoryRouter);
app.use('/subcategory',subcategoryRouter);
app.use('/food',foodRouter);
app.use('/timing',timingRouter);
app.use('/admin',adminRouter);
app.use('/userinterface',userinterfaceRouter)
app.use('/restaurantpictures',restaurantpicturesRouter)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
