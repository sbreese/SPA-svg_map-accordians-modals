/* jshint node: true */
'use strict';

var express = require('express'), // Node Express Module
    path = require('path'), // Path Helper
    logger = require('morgan'), // HTTP Logger
    bodyParser = require('body-parser'); // Parse data from payloads


var port = 8000;

// Initialize the Express App
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// Setup Routes
app.use('/', require('./routes/index'));
app.use('/breaks', require('./routes/breaks'));
app.use('/schema', require('./routes/schema'));

// Start the server
app.listen(port, function(){
   console.log('Marriott Breaks Server started listening on port ' + port);
});