/*
 * PongClient.js
 * A skeleton client for two-player Pong game.
 * Assignment 2 for CS4344, AY2013/14.
 * Modified from Davin Choo's AY2012/13 version.
 *
 * Changes from AY2012/13:
 *  - migrate from socket.io to sockjs
 *
 * Usage: 
 *    Include in HTML body onload to run on a web page.
 *    <body onload="loadScript('', 'PongClient.js')">
 */

// enforce strict/clean programming
"use strict"; 

function PongClient() {
    // private variables
    var socket;         // socket used to connect to server 
    var playArea;       // HTML5 canvas game window 
    var ball;           // ball object in game 
    var myPaddle;       // player's paddle in game 
    var opponentPaddle; // opponent paddle in game
    var delay;          // delay simulated on current client 
    var prevVx = 0;     // previous velocity (for accelorometer)
    var lastUpdatePaddleAt = 0; // timestamp of last recv update
    var lastUpdateVelocityAt = 0; // timestamp of last recv update

    /*
     * private method: showMessage(location, msg)
     *
     * Display a text message on the web page.  The 
     * parameter location indicates the class ID of
     * the HTML element, and msg indicates the message.
     *
     * The new message replaces any existing message
     * being shown.
     */
    var showMessage = function(location, msg) {
        document.getElementById(location).innerHTML = msg; 
    }

    /*
     * private method: appendMessage(location, msg)
     *
     * Display a text message on the web page.  The 
     * parameter location indicates the class ID of
     * the HTML element, and msg indicates the message.
     *
     * The new message is displayed ON TOP of any 
     * existing messages.  A timestamp prefix is added
     * to the message displayed.
     */
    var appendMessage = function(location, msg) {
        var prev_msgs = document.getElementById(location).innerHTML;
        document.getElementById(location).innerHTML = "[" + new Date().toString() + "] " + msg + "<br />" + prev_msgs;
    }

    /*
     * private method: sendToServer(msg)
     *
     * The method takes in a JSON structure and send it
     * to the server, after converting the structure into
     * a string.
     */
    var sendToServer = function (msg) {
        var date = new Date();
        var currentTime = date.getTime();
        msg["timestamp"] = currentTime;
        socket.send(JSON.stringify(msg));
    }

    /*
     * private method: initNetwork(msg)
     *
     * Connects to the server and initialize the various
     * callbacks.
     */
    var initNetwork = function() {
        // Attempts to connect to game server
        try {
            socket = new SockJS("http://" + Pong.SERVER_NAME + ":" + Pong.PORT + "/pong");
            socket.onmessage = function (e) {
                var message = JSON.parse(e.data);
                switch (message.type) {
                case "message": 
                    appendMessage("serverMsg", message.content);
                    break;
                case "update": 
                    var t = message.timestamp;
                    if (t < lastUpdatePaddleAt)
                        break;
                    lastUpdatePaddleAt = t;
                    // ball.x = message.ballX;
                    // ball.y = message.ballY;
                    // Stop updating own's paddle based on server's state
                    // since we are short-circuting the paddle movement.
                    // myPaddle.x = message.myPaddleX;
                    myPaddle.y = message.myPaddleY;
                    opponentPaddle.x = message.opponentPaddleX;
                    opponentPaddle.y = message.opponentPaddleY;
                    break;
                case "updateVelocity": 
                    var t = message.timestamp;
                    if (t < lastUpdateVelocityAt)
                        break;
                    lastUpdateVelocityAt = t;
                    ball.vx = message.ballVX;
                    ball.vy = message.ballVY;
                    // Periodically resync ball position to prevent error
                    // in calculation to propagate.
                    ball.x = message.ballX;
                    ball.y = message.ballY;
                    break;
                case "outOfBound": 
                    ball.reset();
                    myPaddle.reset();
                    opponentPaddle.reset();
                    break;
                default: 
                    appendMessage("serverMsg", "unhandled meesage type " + message.type);
                }
            }
        } catch (e) {
            console.log("Failed to connect to " + "http://" + Pong.SERVER_NAME + ":" + Pong.PORT);
        }
    }

    /*
     * private method: initGUI
     *
     * Initialize a play area and add events.
     */
    var initGUI = function() {

        while(document.readyState !== "complete") {console.log("loading...");};

        // Sets up the canvas element
        playArea = document.getElementById("playArea");
        playArea.height = Pong.HEIGHT;
        playArea.width = Pong.WIDTH;

        // Add event handlers
        playArea.addEventListener("mousemove", function(e) {
            onMouseMove(e);
            }, false);
        playArea.addEventListener("touchmove", function(e) {
            onTouchMove(e);
            }, false);
        playArea.addEventListener("click", function(e) {
            onMouseClick(e);
            }, false);
        playArea.addEventListener("touchend", function(e) {
            onTouchEnd(e);
            }, false);
        document.addEventListener("keydown", function(e) {
            onKeyPress(e);
            }, false);
        window.addEventListener("devicemotion", function(e) {
            onDeviceMotion(e);
            }, false);
        window.ondevicemotion = function(e) {
            onDeviceMotion(e);
            }
    }

    /*
     * private method: onMouseMove
     *
     * When we detect a mouse movement, translate the mouse
     * coordinate to play area coordinate and send the new
     * mouse x-coordinate to the server.
     */
    var onMouseMove = function(e) {
        var canvasMinX = playArea.offsetLeft;
        var canvasMaxX = canvasMinX + playArea.width;
        var canvasMinY = playArea.offsetTop;
        var canvasMaxY = canvasMinX + playArea.height;
        var newMouseX = e.pageX - canvasMinX;
        var newMouseY = e.pageY - canvasMinY;

        // Short circuiting the paddle movement, with a 
        // local lag of 100ms. 
        setTimeout(function() {myPaddle.x = newMouseX;}, 100);
 
        // Send event to server
        sendToServer({type:"move", x: newMouseX});
    }

    /*
     * private method: onMouseClick
     *
     * Starts the game if the game has not started.
     * (we check if a game has started by checking if
     * the ball is moving).
     */
    var onMouseClick = function(e) {
        if (!ball.isMoving()) {
            //Send event to server
            sendToServer({type:"start"});
        }
    }

    /*
     * private method: onTouchEnd
     *
     * Touch version of "mouse click" callback above.
     */
    var onTouchEnd = function(e) {
        if (!ball.isMoving()) {
            sendToServer({type:"start"});
        }
    }

    /*
     * private method: onTouchMove
     *
     * Touch version of "mouse move" callback above.
     */
    var onTouchMove = function(e) {
        var t = e.touches[0];
        var canvasMinX = playArea.offsetLeft;
        var canvasMaxX = canvasMinX + playArea.width;
        var canvasMinY = playArea.offsetTop;
        var canvasMaxY = canvasMinX + playArea.height;
        var newMouseX = t.pageX - canvasMinX;
        var newMouseY = t.pageY - canvasMinY;

        // Send event to server
        sendToServer({type:"move", x:newMouseX});
    }
    /*
     * private method: onDeviceMotion
     *
     * Get the device acceleration and use that to change the 
     * velocity of the paddle.
     */
    var onDeviceMotion = function(e) {
        var vx = e.accelerationIncludingGravity.x;
        if (vx - prevVx > 0.1 || prevVx - vx > 0.1) {
            prevVx = vx;
            // Send event to server if the accelerometer reading 
            // changes significantly.
            sendToServer({type: "accelerate", vx: vx});
        }
    }

    var onKeyPress = function(e) {
        /*
        keyCode represents keyboard button
        38: up arrow
        40: down arrow
        37: left arrow
        39: right arrow
        */
        switch(e.keyCode) {
            case 38: { // Up
                delay += 50;
                // Send event to server
                sendToServer({type:"delay", delay:delay});
                showMessage("delay", "Delay to Server: " + delay + " ms");
                break;
            }
            case 40: { // Down
                if (delay >= 50) {
                    delay -= 50;
                    // Send event to server
                    sendToServer({type:"delay", delay:delay});
                    showMessage("delay", "Delay to Server: " + delay + " ms");
                }
                break;
            }
        }
    }
    
    var gameLoop = function() {
        ball.updatePosition();
        if (myPaddle.y < Paddle.HEIGHT) {
            // my paddle is on top
            ball.checkForBounce(myPaddle, opponentPaddle);
        } else {
            // my paddle is at the bottom
            ball.checkForBounce(opponentPaddle, myPaddle);
        }
        render();
    }

    /*
     * private method: render
     *
     * Draw the play area.  Called periodically at a rate
     * equals to the frame rate.
     */
    var render = function() {
        // Get context
        var context = playArea.getContext("2d");

        // Clears the playArea
        context.clearRect(0, 0, playArea.width, playArea.height);

        // Draw playArea border
        context.fillStyle = "#000000";
        context.fillRect(0, 0, playArea.width, playArea.height);

        // Draw the ball
        context.fillStyle = "#ffffff";
        context.beginPath();
        context.arc(ball.x, ball.y, Ball.WIDTH/2, 0, Math.PI*2, true);
        context.closePath();
        context.fill();

        // Draw both paddles
        context.fillStyle = "#ffff00";
        context.fillRect(myPaddle.x - Paddle.WIDTH/2, 
            myPaddle.y - Paddle.HEIGHT/2,
            Paddle.WIDTH, Paddle.HEIGHT);
        context.fillRect(opponentPaddle.x - Paddle.WIDTH/2, 
            opponentPaddle.y - Paddle.HEIGHT/2,
            Paddle.WIDTH, Paddle.HEIGHT);
    }

    /*
     * priviledge method: start
     *
     * Create the ball and paddles objects, connects to
     * server, draws the GUI, and starts the rendering 
     * loop.
     */
    this.start = function() {
        // Initialize game objects
        ball = new Ball();

        // The following lines always put the player's paddle
        // at the bottom; opponent's paddle at the top.
        // But this could get overridden by the server later
        // (by the y coordinate of the paddle).
        myPaddle = new Paddle(Pong.HEIGHT);
        opponentPaddle = new Paddle(Paddle.HEIGHT);

        // Start off with no delay to the server
        delay = 0;

        // Initialize network and GUI
        initNetwork();
        initGUI();

        // Start drawing 
        setInterval(function() {gameLoop();}, 1000/Pong.FRAME_RATE);
    }
}

// This will auto run after this script is loaded

// Run Client. Give leeway of 0.5 second for libraries to load
var client = new PongClient();
setTimeout(function() {client.start();}, 500);

// vim:ts=4:sw=4:expandtab
