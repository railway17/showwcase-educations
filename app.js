const express = require('express');
const  path = require('path');
const  cors = require('cors');
const  logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const config = require('./config/database');

require('./config/passport')(passport);
mongoose.connect(config.database, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });

let app = express();

app.use(cors());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(passport.initialize());


/**
 * Server Routes
 */

app.get('/', function(req, res) {
    res.send('Welcome to the API');
});

// Calling routes
let authentication = require('./routes/auth');

// Using routes
app.use('/api', authentication);

/**
 * End Server Routes
 */


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
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
