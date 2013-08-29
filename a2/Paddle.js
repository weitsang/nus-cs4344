/*
 * Paddle.js
 * Implementation of the paddle objects in Pong.
 * Assignment 2 for CS4344, AY2013/14.
 * Modified from Davin Choo's AY2012/13 version.
 *
 * Changes from AY2012/13:
 *  - nothing major
 *
 * Usage: 
 *   require('paddle.js') in both server and client.
 */

// enforce strict/clean programming
"use strict"; 

function Paddle(yPos){
	// Private variables
	var that;	// pointer to "this"

	// Public variables
	this.x;		// x-coordinate of paddle's position 
	this.y;		// y-coordinate of paddle's position

	// Constructor
	var that = this; // Unused in Paddle for now.
	this.x = Pong.WIDTH/2;
	this.y = yPos - Paddle.HEIGHT/2;
}

// Static variables
Paddle.WIDTH = 60;
Paddle.HEIGHT = 16;
Paddle.R1 = 5;
Paddle.R2 = 10;
Paddle.R3 = 25;

/*
 * public method: move(newx)
 *
 * Move the paddle to new x-position, newx.  Check for
 * boundary conditions.
 */
Paddle.prototype.move = function(newx) {
	if (newx < Paddle.WIDTH/2)
		this.x = Paddle.WIDTH/2;
	else if (newx > Pong.WIDTH - Paddle.WIDTH/2)
		this.x = Pong.WIDTH - Paddle.WIDTH/2;
	else
		this.x = newx;
}

// For node.js require
global.Paddle = Paddle;

// vim:ts=4:sw=4:expandtab
