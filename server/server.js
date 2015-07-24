/* jshint node: true */

'use strict';

var express = require('express'), // Node Express Module
    path = require('path'), // Path Helper
    logger = require('morgan'), // HTTP Logger
    bodyParser = require('body-parser'), // Parse data from payloads
    Converter = require('csvtojson').Converter, // Used for converting csv to json
    fs = require('fs'); // File Stream

var port = 8000;
var fileNames = {
    csv: './server/marriott-data.csv',
    json: './server/marriott-data.json'
};

// Initialize the Express App
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// Send Index
app.get('/', function(request, response){
    response.sendfile(path.join(__dirname, '../public/index.html'));
});

// Convert CSV file to JSON file
function convertData(callback){
    var csvStream = fs.createReadStream(fileNames.csv);
    var jsonStream = fs.createWriteStream(fileNames.json);

    var csvConverter = new Converter({constructResult:false, toArrayString:true});

    csvConverter.on('end_parsed', function(){
        console.log('CSV Data successfully converted!');
        callback();
    });

    csvStream.pipe(csvConverter).pipe(jsonStream);
}

function readJsonData(callback){
    fs.readFile(fileNames.json, function(err, data){
        if (err){
            callback(err, null);
        }
        else {
            callback(null, data);
        }
    });
}

app.post('/convert', function(request, response){
    convertData(function(){
        response.send('CSV Data successfully converted!');
    });
});

app.get('/breaks', function(request, response){
    // Check if JSON file exists. If not, convert the csv first
    fs.stat(fileNames.json, function(err, stat){
        if (!err){
            // No error, file exists. Read and send
            readJsonData(sendJsonData);
        }
        else if (err.code === 'ENOENT') {
            // File doesn't exist. Convert and send
            convertData(function(){
                readJsonData(sendJsonData);
            });
        }
        else {
            // Unknown error
            response.status(500).send('Error reading eBreaks data: ' + err.code);
        }

    });

    function sendJsonData(err, data){
        if (err){
            response.status(500).send('Error reading eBreaks data');
        }
        else {
            response.send(JSON.parse(data));
        }
    }

});

// Start the server
app.listen(port, function(){
   console.log('Marriott Breaks Server started listening on port ' + port);
});