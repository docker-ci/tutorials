var express = require('express');
var fs = require("fs");
var app = express();

app.get('/', function(req, res) {
	var hosts = fs.readFileSync("/etc/hosts");
	res.send('Hello Grumpy! <br> <img src="/public/grumpy.jpg" width="200"><hr><pre>' + hosts + "<pre>");
});

console.log(process.env);

var server = app.listen(3000, function() {

	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);

});