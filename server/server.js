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

app.post('/convert', function(request, response){
    var csvStream = fs.createReadStream('./server/marriott-data.csv');
    var jsonStream = fs.createWriteStream('./server/marriott-data.json');

    var csvConverter = new Converter({constructResult:false, toArrayString:true});

    csvConverter.on('end_parsed', function(){
        console.log('CSV Data successfully converted!');

        response.send('CSV Data successfully converted!');
    });

    csvStream.pipe(csvConverter).pipe(jsonStream);
});

app.get('/breaks', function(request, response){
    fs.readFile('./server/marriott-data.json', function(err, data){
        if (err){
            response.status(500).send('Error reading eBreaks data');
        }
        else {
            response.send(JSON.parse(data));
        }
    });
});

// Start the server
app.listen(port, function(){
   console.log('Marriott Breaks Server started listening on port ' + port);
});