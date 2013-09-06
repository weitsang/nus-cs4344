/*=====================================================
  Declared as literal object (All variables are static)	  
  =====================================================*/
var Pong = {
	HEIGHT : 400,				// height of Pong game window
	WIDTH : 400,				// width of Pong game window
	PORT : 4344,				// port of Pong game
	FRAME_RATE : 25,			// frame rate of Pong game
	SERVER_NAME : "localhost"	// server name of Pong game
	//SERVER_NAME : "172.28.179.28"	// server name of Pong game
}

// For node.js require
global.Pong = Pong;

// vim:ts=4
