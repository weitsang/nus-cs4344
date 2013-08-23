function Client() {
	var sock;

	this.run = function() {
		sock = new SockJS('http://localhost:4344/demo0');
		sock.onmessage = function(e) {
			command = e.data.split(/\b\s+/);
			if (command[0] == "state") {
				ship.setX(parseInt(command[1]));
				ship.setY(parseInt(command[2]));
				ship.setDir(command[3]);
			}
			render();
		};

		c = document.getElementById("canvas");
		c.height = 500;
		c.width= 500;

		document.addEventListener("keydown", function(e) {
			if (e.keyCode == 37) { 
				sock.send("left");
			} else if (e.keyCode == 38) { 
				sock.send("up");
			} else if (e.keyCode == 39) {
				sock.send("right");
			} else if (e.keyCode == 40) {
				sock.send("down");
			}
		}, false);
	}

	var render = function() {
		// Get context
		var c = document.getElementById("canvas");
		var context = c.getContext("2d");

		// Clears the playArea
		context.clearRect(0, 0, 500, 500);

		context.fillStyle = "#000000";
		context.fillRect(0, 0, 500, 500);

		// Draw the ship
		ship.draw(context);
	}
}

var c = new Client();
var ship = new Ship();
c.run()
