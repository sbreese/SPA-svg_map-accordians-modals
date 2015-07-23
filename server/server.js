/* jshint node: true */

'use strict';

var express = require('express'), // Node Express Module
    path = require('path'), // Path Helper
    logger = require('morgan'), // HTTP Logger
    bodyParser = require('body-parser'), // Parse data from payloads
    Converter = require('csvtojson').Converter, // Used for converting csv to json
    fs = require('fs'); // File Stream

var port = 8000;

// Initialize the Express App
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// Send Index
app.get('/', function(request, response){
    response.sendfile(path.join(__dirname, '../public/index.html'));
});

app.get('/breaks', function(request, response){
    var csvStream = fs.createReadStream('./server/marriott-data.csv');
    var csvConverter = new Converter({});

    csvConverter.on('end_parsed', function(jsonData){
        response.send(jsonData);
    });

    csvStream.pipe(csvConverter);
});

// Start the server
app.listen(port, function(){
   console.log('Marriott Breaks Server started listening on port ' + port);
});