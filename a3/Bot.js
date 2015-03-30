// enforce strict/clean programming
"use strict"; 

var LIB_PATH = "./";
require(LIB_PATH + "Config.js");
require(LIB_PATH + "Ship.js");
require(LIB_PATH + "Player.js");

function Bot() {
	var sock;
	var ships = {};
	//var rockets = {};
	var myShip;
	var myId;

    /*
     * private method: sendToServer(msg)
     *
     * The method takes in a JSON structure and send it
     * to the server, after converting the structure into
     * a string.
     */
    var sendToServer = function (msg) {
      sock.send(JSON.stringify(msg));
    }

	this.run = function() {
      var WebSocket = require('ws');
	  sock = new WebSocket('ws://localhost:4344/space/websocket');
	  sock.on("message",  function(e, flags) {
          var message = JSON.parse(e);
          switch (message.type) {
              case "join": 
                  myId = message.id;
                  ships[myId] = new Ship();
                  myShip = ships[myId];
                  myShip.init(Config.WIDTH/2, Config.HEIGHT/2,"up");
                  setInterval(function() {simulate();}, 250); // 30 fps
                  break;
              case "new":
                  var id = message.id;
                  ships[id] = new Ship();
                  var x = parseInt(message.x);
                  var y = parseInt(message.y);
                  ships[id].init(x, y, message.dir);
                  break;
              case "turn":
                  var id = message.id;
                  if (ships[id] === undefined) {
                      console.log("turn error: undefined ship " + id);
                  } else {
                      ships[id].jumpTo(message.x, message.y);
                      ships[id].turn(message.dir);
                  }
                  break;
              case "fire":
                  var id = message.ship;
                  if (ships[id] === undefined) {
                      console.log("fire error: undefined ship " + id);
                  }
                  //var r = new Rocket();
                  //r.init(message.x, message.y, message.dir, id);
                  //rockets[message.rocket] = r;
                  break;
              case "hit":
                  var id = message.ship;
                  if (ships[id] === undefined) {
                      console.log("hit error: undefined ship " + id);
                  } else {
                      ships[id].hit();
                  }
                  break;
              case "delete":
                  var id = message.id;
                  if (ships[id] === undefined) {
                      console.log("error: undefined ship " + id);
                  } else {
                      delete ships[id];
                  }
              default:
                  console.log("error: undefined command " + message.type);
            }
        });


        // Bot auto-joins
		setTimeout(function() {sendToServer({type:"join"});}, 500);
    }

	var simulate = function() {
        // randomly move the ship:
        // - with 0.1 probability, turn
        //   - equal prob to turn in each dir
        // - with 0.1 probability, fire
        myShip.moveOneStep();
        var dice = Math.random();
        var dir;
        if (dice < 0.1) {
            // turn
            dice = Math.random();
            if (dice < 0.25) {
                dir = "right";
            } else if (dice < 0.5) {
                dir = "left";
            } else if (dice < 0.75) {
                dir = "up";
            } else {
                dir = "down";
            }
            myShip.turn(dir);
            sendToServer({
                type:"turn", 
                x: myShip.x, 
                y: myShip.y, 
                dir: dir});
        } 
        dice = Math.random();
        if (dice < 0.1) {
            // fire with 0.1 probability
            sendToServer({
                type:"fire",
                id: myId, 
                x: myShip.x, 
                y: myShip.y, 
                dir: myShip.dir});
        }
	}
}

var numberOfBots;
if (process.argv[2] == undefined) {
    numberOfBots = 1;
} else {
    numberOfBots = parseInt(process.argv[2]);
}
for (var i = 0; i < numberOfBots; i++) {
    var b = new Bot();
    b.run()
}
// vim:ts=4:sw=4:expandtab
