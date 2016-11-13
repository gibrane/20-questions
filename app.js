//from http://stackoverflow.com/a/31144924/5434744
function requireHTTPS(req, res, next) {
    //
    // The 'x-forwarded-proto' check is for Heroku
    //
    if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
};
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');
var index = require('./routes/index');
//var users = require('./routes/users');
var questions = require('./routes/questions');
var fbTest = require('./routes/fbtest');
var api = require('./routes/api');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
console.log("working");
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(requireHTTPS);
app.use('/', index);
app.use('/questions', questions);
//app.use('/fbtest', fbTest);
app.use('/api', api)
    // catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;