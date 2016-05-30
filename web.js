var gzippo = require('gzippo');
var express = require('express');
var app = express();

app.use(express.logger('dev'));
app.use(gzippo.staticGzip("" + __dirname + "/dist"));
app.listen(process.env.PORT || 5000);

// var express = require('express');
//     var favicon = require('serve-favicon');
//     var logger = require('morgan');
//     var methodOverride = require('method-override');
//     var session = require('express-session');
//     var bodyParser = require('body-parser');
//     var multer = require('multer');
//     var errorHandler = require('errorhandler');
//     var path = require('path');

//     var app = express();

// app.set('port', process.env.PORT || 3000);
//     app.set('views', __dirname + '/views');
//     app.set('view engine', 'jade');
//     app.use(favicon(__dirname + '/public/favicon.ico'));
//     app.use(logger('dev'));
//     app.use(methodOverride());
//     app.use(session({ resave: true, saveUninitialized: true, 
//                       secret: 'uwotm8' }));

//     // parse application/json
//     app.use(bodyParser.json());                        

//     // parse application/x-www-form-urlencoded
//     app.use(bodyParser.urlencoded({ extended: true }));

//     // parse multipart/form-data
//     app.use(multer());

//     app.use(express.static(path.join(__dirname, '/dist')));