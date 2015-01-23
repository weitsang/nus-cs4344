# Two-Player Pong
### A CS4344 Assignment

## Introduction
This folder contains the code for a two-player Pong game, implemented with Javascript and HTML5.  The server runs on ```node.js``` and serves data with ```express```.  Communication is done through ```sockjs```.  

Release v0.1 implements a "smart server, dumb client" architecture for the game, where the client simply receives state update from the server and render the states.  The game logic and simulation are only implemented on the server.  

## Installation and Execution
Install ```node.js```.  Then install `sockjs` and `express` with:
```
$ npm install
```

To run the server:
```
$ node PongServer.js
```

Connects to the server with a modern browser, at the URL ```http://server:port/Pong.html```

The ```server``` and ```port``` can be configured in ```Pong.js```.

A Bot is provided at the URL ```http://server:port/Bot.html```

