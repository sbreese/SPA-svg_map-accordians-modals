/* jshint node: true */
'use strict';

var express = require('express'),
    router = express.Router(),
    breaksParser = require('../util/breaksParser'), // Utility for parsing the CSV data to JSON
    fs = require('fs'); // File Stream

// Reads the JSON file and sends the data to the callback
function readJsonData(callback){
    fs.readFile(breaksParser.fileNames.json, function(err, data){
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
    breaksParser.parseBreaksData(function(err){
        if (err){
            response.status(500).send('Error converting eBreaks data');
        }
        else {
            response.send('CSV Data successfully converted!');
        }
    });
});

// /breaks GET
router.get('/', function(request, response){
    // Check if JSON file exists. If not, convert the csv first
    fs.stat(breaksParser.fileNames.json, function(err, stat){
        if (!err){
            // No error, file exists. Read and send
            readJsonData(sendJsonData);
        }
        else if (err.code === 'ENOENT') {
            // File doesn't exist. Convert and send
            breaksParser.parseBreaksData(function(){
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