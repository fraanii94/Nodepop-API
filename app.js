
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwt_auth = require('./lib/jwt-verify');
var app = express();
var error_handler = require('./lib/error-handler');

// ********* Create connection to database *************
require('./lib/connection');

require('./models/Usuario');
require('./models/Anuncio');
require('./models/Token');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));

app.use('/api/v1/authenticate', require('./routes/api/v1/authenticate'));

app.use(jwt_auth);

app.use('/api/v1/usuarios', require('./routes/api/v1/usuarios'));
app.use('/api/v1/anuncios',require('./routes/api/v1/anuncios'));
app.use('/api/v1/tokens',require('./routes/api/v1/tokens'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res,next) {
    res.status(err.status || 500);
    var lang = req.query.lang || 'en';
    res.json({success:false,
              message: error_handler(lang,err.message),
              error: err
             });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res,next) {
  res.status(err.status || 500);
  var lang = req.query.lang || 'en';
  console.log(lang);
  res.json({success:false,
            message: error_handler(lang,err.message),
            error: err
          });
});



module.exports = app;
