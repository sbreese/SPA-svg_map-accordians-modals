/* jshint node: true */
'use strict';

var express = require('express'),
    path = require('path'),
    router = express.Router();

router.get('/', function(request, response){
    response.sendfile(path.join(__dirname, '../public/index.html'));
});

module.exports = router;