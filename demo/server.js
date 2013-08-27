require('./ship.js');

var express = require('express');
var http = require('http');
var sockjs = require('sockjs');
var sock = sockjs.createServer();

var ships = {};
var sockets = {};

function broadcast(msg) {
	console.log('Broadcast ' + msg);
	for (id in sockets) {
		sockets[id].write(msg);
	}
}

sock.on('connection', function(conn) {
	conn.on('data', function(msg) {
		try {
		command = msg.split(/\b\s+/);
		if (command[0] == "start") {
			ships[conn.id] = new Ship();
			s = ships[conn.id];
			s.init(250,250,"up");
			sockets[conn.id] = conn;
			conn.write('start ' + conn.id);
			for (id in ships) {
				if (id != conn.id) {
					// tell the new player info about all the other ships
					conn.write('new ' + id + ' ' + ships[id].getX() + ' ' + ships[id].getY() + ' ' + ships[id].getDir());
					console.log('new ' + id + ' ' + ships[id].getX() + ' ' + ships[id].getY() + ' ' + ships[id].getDir());
					// tell the existing player info about the new ship
					sockets[id].write('new ' + conn.id + ' ' + s.getX() + ' ' + s.getY() + ' ' + s.getDir());
					console.log('new ' + conn.id + ' ' + s.getX() + ' ' + s.getY() + ' ' + s.getDir());
				}
			}
		} else if (command[0] == "turn") {
			s = ships[conn.id];
			if (s === undefined) {
				console.log("error: unknown ship from " + conn.id);
			} else {
				s.turn(command[1]);
				//r = Math.floor((Math.random()*100)+1);
				//setTimeout(function() {
				broadcast('turn ' + conn.id + ' ' + command[1]);
				//	}, 100+r);
			}
		}
		} catch (e) { console.log(e.message); }
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
