var express = require('express');
var fs = require("fs");
var app = express();

app.get('/', function(req, res) {
	console.log("Request to root.. " + new Date().getTime());
	res.send({
		hello: "world"
	})
});

var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);

});