/* jshint node: true */
'use strict';

var express = require('express'),
    path = require('path'),
    router = express.Router();

router.get('/', function(request, response){
    response.sendFile(path.join(__dirname, '../data/marriott-data-schema.jsonld'));
});

module.exports = router;