function Client() {
	var sock;
	var ships = {};
	var myship;

	this.run = function() {
		sock = new SockJS('http://localhost:4344/demo0');
		sock.onmessage = function(e) {
			console.log(e.data);
			command = e.data.split(/\b\s+/);
			if (command[0] == "start") {
				id = command[1];
				ships[id] = new Ship();
				myship = ships[id];
				myship.init(250,250,"up");
			} else if (command[0] == "new") {
				id = command[1];
				ships[id] = new Ship();
				ships[id].init(parseInt(command[2]),parseInt(command[3]),command[4]);
				for (id in ships) console.log(id);
			} else if (command[0] == "turn") {
				id = command[1];
				if (ships[id] === undefined) {
					console.log("error: undefined ship " + id);
				} else {
					dir = command[2];
					ships[id].turn(dir);
				}
			} else {
					console.log("error: undefined command " + command[0]);
			}
		};

		setInterval(function() {render();}, 1000/30); // 30 fps

		c = document.getElementById("canvas");
		c.height = 500;
		c.width= 500;

		document.addEventListener("keydown", function(e) {
			if (e.keyCode == 37) { 
				sock.send("turn left");
			} else if (e.keyCode == 38) { 
				sock.send("turn up");
			} else if (e.keyCode == 39) {
				sock.send("turn right");
			} else if (e.keyCode == 40) {
				sock.send("turn down");
			} else if (e.keyCode == 32) {
				sock.send("start");
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
		for (i in ships) {
			ships[i].draw(context);
		}
	}
}

var c = new Client();
c.run()
