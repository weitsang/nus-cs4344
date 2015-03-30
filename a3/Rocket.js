/*
 * Rocket.js
 * Implementation of a rocket in Space Battle.
 * Assignment 3 for CS4344, AY2014/15.
 *
 * Usage: 
 *    require(LIB_PATH + "Rocket.js");
 */

"use strict"; 
function Rocket()
{
	// public:
	this.x;    // current location of the rocket
	this.y;
	this.dir;  // direction of the rocket
	this.from; // ship ID of the ship that shoots this rocket

	// private:
	var lastX;  // last updated position and time
	var lastY;
	var lastUpdateAt;

	var VELOCITY = 0.05;  // velocity of the rocket in pixels per ms

	// constructor
	var that = this;
	this.init = function(xx, yy, dd, from) {
		this.x = xx;
		this.y = yy;
		this.dir = dd;
		this.from = from;
		lastX = this.x;
		lastY = this.y;
		lastUpdateAt = getTimestamp();
		if (dd == "up") {
			this.up();
		} else if (dd == "down") {
			this.down();
		} else if (dd == "left") {
			this.left();
		} else if (dd == "right") {
			this.right();
		} else {
			console.log("unrecognize direction " + dd);
		}
	}

    /*
     * private method: calcDistance()
     *
     * How far this rocket has moved since the last update.
     */
	var calcDistance = function() {
		var deltaTime = getTimestamp() - lastUpdateAt;
		var distance = deltaTime*VELOCITY;
		return distance;
	}

    /*
     * public methods: moveOneStep
     *
     * Move the rocket by a distance according to velocity and dir.
     */
	this.moveOneStep = function()
	{
		if (this.dir == "up") {
			this.up();
		} else if (this.dir == "down") {
			this.down();
		} else if (this.dir == "left") {
			this.left();
		} else if (this.dir == "right") {
			this.right();
		}
	}

    /*
     * public methods: up()/down()/left()/right()
     *
     * Move the rocket according to the velocity.
     */
	this.up = function()
	{
		var distance = calcDistance();
		this.y = lastY - distance; 
		lastY = this.y;
		lastUpdateAt = getTimestamp();
	}

	this.down = function()
	{
		var distance = calcDistance();
		this.y = lastY + distance; 
		lastY = this.y;
		lastUpdateAt = getTimestamp()
	}

	this.left = function()
	{
		var distance = calcDistance();
		this.x = lastX - distance; 
		lastX = this.x;
		lastUpdateAt = getTimestamp();
	}

	this.right = function()
	{
		var distance = calcDistance();
		this.x = lastX + distance; 
		lastX = this.x;
		lastUpdateAt = getTimestamp();
	}
	
    /*
     * public methods: hasHit
     *
     * Check if this rocket has hit the given ship.  
     */
	this.hasHit = function(ship)
	{
		if (this.x + 3 > ship.x && this.x - 3 < ship.x && 
				this.y + 3 > ship.y && this.y - 3 < ship.y) {
			return true;
		} else {
			return false;
		}
	}

    /*
     * public methods: draw
     *
     * Render the rocket.  
	 * c is the HTML canvas context for drawing.
     * if isSelf is true, then this rocket is fired from this
     * player.  Render the rocket in yellow.
     */
	this.draw = function(c, isSelf)
	{
		try {
			var rx = Math.round(this.x);
			var ry = Math.round(this.y);
			if (isSelf == true)
				c.fillStyle = "#ff0";
			else
				c.fillStyle = "#eee";
			c.beginPath();
			c.arc(rx,ry,2,0,2*Math.PI);
			c.closePath();
			c.fill();
		} catch (e) {
			console.log(e.message);
		}
	}
}


global.Rocket = Rocket;

// Dynamically define the getTimestamp() function depending on
// platform.
if (typeof window === "undefined") {
	var getTimestamp = function() { 
		var t = process.hrtime(); return t[0]*1e3 + t[1]*1.0/1e6
	} 
} else if (window.performance.now) {
	var getTimestamp = function() { 
		return window.performance.now(); 
	};
} else if (window.performance.webkitNow) {
    var getTimestamp = function() { 
		return window.performance.webkitNow(); 
	};
} else {
	var getTimestamp = function() { 
		return new Date().now(); 
	};
}

// vim:ts=4:sw=4:expandtab
