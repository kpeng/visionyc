var express = require('express');

var server = express.createServer();
server.use(express.static(__dirname + '/static'));
server.listen(8080);
