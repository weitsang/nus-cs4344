require('./ship.js');

var express = require('express');
var http = require('http');
var sockjs = require('sockjs');
var sock = sockjs.createServer();

sock.on('connection', function(conn) {
    ship = new Ship();
	conn.write('state ' + ship.getX() + ' ' + ship.getY());
    console.log('connected ');
	conn.on('data', function(msg) {
		if (msg == 'up') {
			ship.up();
		} else if (msg == 'down') {
			ship.down();
		} else if (msg == 'right') {
			ship.right();
		} else if (msg == 'left') {
			ship.left();
		}
		r = Math.floor((Math.random()*100)+1);
		setTimeout(function() {
			conn.write('state ' + ship.getX() + ' ' + ship.getY() + ' ' + ship.getDir());
			}, 400+r);
	});
	conn.on('close', function() {
		  console.log("close")
	});
});

var app = express();
var httpServer = http.createServer(app);
sock.installHandlers(httpServer, {prefix:'/demo0'});
httpServer.listen(4344, '0.0.0.0');

app.use(express.static(__dirname));
