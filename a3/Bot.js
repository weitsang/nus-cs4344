/*
 * Bot.js
 * Implementation of the bots in Space Battle.
 * Assignment 3 for CS4344, AY2014/15.
 *
 * Usage: 
 *   node Bot.js <n>
 *
 * where <n> is the number of bots.  The default server can scale
 * <n> up to at least 500 on my laptop.  If argument <n> is not 
 * provided, only one Bot will be created.
 */
"use strict"; 

var LIB_PATH = "./";
require(LIB_PATH + "Config.js");
require(LIB_PATH + "Ship.js");
require(LIB_PATH + "Rocket.js");

function Bot() {
    var sock;
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

    /*
     * private method: gameLoop()
     *
     * The method simulates a bot, which randomly turns 
     * (with 0.1 probability) to a random direction 
     * (with equal probability), and randomly fires
     * (with 0.1 probability).
     */
    var gameLoop = function() {
        myShip.moveOneStep();
        var dice = Math.random();
        var dir;
        if (dice < 0.1) {
            // turn with 0.1 probability
            dice = Math.random();
            // pick a dir with equal probability
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
                x: myShip.x, 
                y: myShip.y, 
                dir: myShip.dir});
        }
    }

    /*
     * priviledge method: run()
     *
     * The method is called to initialize and run a bot.
     * It connects to the server via WebSocket (so, run
     * "node MMOServer.js" first) and set up various 
     * callbacks.
     *
     */
    this.run = function() {
        var WebSocket = require('ws');
        sock = new WebSocket('ws://' + Config.SERVER_NAME + 
              ':' + Config.PORT + '/space/websocket');

        sock.on("message",  function(e, flags) {
            var message = JSON.parse(e);
            switch (message.type) {
                case "join": 
                    // Server has agreed to allow this client to join.
                    myId = message.id;
                    myShip = new Ship();
                    myShip.init(message.x, message.y, message.dir);
                    
                    // For bots, we simulate their movement 4 steps a second.
                    setInterval(function() {gameLoop();}, 250); 
                    break;
                case "new":
                case "turn":
                case "fire":
                case "hit":
                case "delete":
                    // A bot does not really care about these action
                    // since nothing is rendered.
                    break;
                default:
                    console.log("error: undefined command " + message.type);
            }
        });

        sock.on("open",  function() {
            // Ask to join the server when the socket is open.
            sendToServer({type:"join"});
        });
    }
}

// By default, create one bot.  If the number of
// bots is given as command line argument, use that
// number instead.
var numberOfBots;
if (process.argv[2] == undefined) {
    numberOfBots = 1;
} else {
    numberOfBots = parseInt(process.argv[2]);
}
// Create the bots.  We space out the creation
// to give the server some breathing space.
for (var i = 0; i < numberOfBots; i++) {
    setTimeout(function() {
        var b = new Bot(); b.run();}, i*200);
}

// vim:ts=4:sw=4:expandtab
