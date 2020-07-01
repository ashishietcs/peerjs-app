var fs = require('fs');
var http = require('http');
var https = require('https');
var path = require('path');
var os = require('os');
var ifaces = os.networkInterfaces();


var express = require('express');
var app = express();
var path = require('path');


app.use('/resources', express.static(path.join(__dirname, 'resources')))
// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(process.env.PORT || 8080);


