/* jshint node: true */
'use strict';

var express = require('express'),
    router = express.Router(),
    Converter = require('csvtojson').Converter, // Used for converting csv to json
    fs = require('fs'), // File Stream
    path = require('path');

var fileNames = {
    csv: path.join(__dirname, '../data/marriott-data.csv'),
    json: path.join(__dirname, '../data/marriott-data.json')
};

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

// Reads the JSON file and sends the data to the callback
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

// /breaks/convert POST
router.post('/convert', function(request, response){
    convertData(function(){
        response.send('CSV Data successfully converted!');
    });
});

// /breaks GET
router.get('/', function(request, response){
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

module.exports = router;