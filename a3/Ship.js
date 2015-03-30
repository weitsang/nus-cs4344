/*
 * Ship.js
 * Implementation of a ship in Space Battle.
 * Assignment 3 for CS4344, AY2014/15.
 *
 * Usage: 
 *    require(LIB_PATH + "Ship.js");
 */
"use strict"; 
function Ship()
{
	// public:
	this.x;              // current location of ship
	this.y;
	this.dir;            // current direction of ship
	this.hitCount = 0;   // how many times this ship is hit
	this.killCount = 0;  // how many times this ship hits other

	// private:
	var lastX;           // To remember last position and last update time
	var lastY;
	var lastUpdateAt;

	var VELOCITY = 0.02;  // velocity of this ship (pixels per ms)

	// constructor
	var that = this;
	this.init = function(xx, yy, dd) {
		lastX = xx;
		lastY = yy;
		lastUpdateAt = getTimestamp();
        this.x = xx;
        this.y = yy;
		that.turn(dd);
	}

    /*
     * private method: calcDistance()
     *
     * How far this ship has moved since the last update.
     */
	var calcDistance = function() {
		var deltaTime = getTimestamp() - lastUpdateAt;
		var distance = deltaTime*VELOCITY;
		return distance;
	}

    /*
     * public methods: up()/down()/left()/right()
     *
     * Move the ship according to the velocity, wrap around
	 * the batthe field if needed.
     */
	this.up = function()
	{
		var distance = calcDistance();
		this.y = lastY - distance; 
		if (this.y < 0) { 
			this.y = this.y + Config.HEIGHT;
			lastY = this.y;
			lastUpdateAt = getTimestamp();
		}
		this.dir = 'up';
	}

	this.down = function()
	{
		var distance = calcDistance();
		this.y = lastY + distance; 
		if (this.y > Config.HEIGHT) { 
			this.y = this.y - Config.HEIGHT;
			lastY = this.y;
			lastUpdateAt = getTimestamp()
		}
		this.dir = 'down';
	}

	this.left = function()
	{
		var distance = calcDistance();
		this.x = lastX - distance; 
		if (this.x < 0) { 
			this.x = this.x + Config.WIDTH;
			lastX = this.x;
			lastUpdateAt = getTimestamp();
		}
		this.dir = 'left';
	}

	this.right = function()
	{
		var distance = calcDistance();
		this.x = lastX + distance; 
		if (this.x > Config.WIDTH) { 
			this.x = this.x - Config.WIDTH;
			lastX = this.x;
			lastUpdateAt = getTimestamp();
		}
		this.dir = 'right';
	}

    /*
     * public methods: jumpTo
     *
     * Teleport the ship to (x,y).  This could happen
	 * if the client's ship position is out of sync with
	 * the server. 
     */
	this.jumpTo = function(xx,yy)
	{
		lastX = that.x;
		lastY = that.y;
		lastUpdateAt = getTimestamp();
		that.x = xx;
		that.y = yy;
	}

    /*
     * public methods: turn
     *
     * Turn the ship to direction dd.
     */
	this.turn = function(dd)
	{
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
			console.log("ship turn: unrecognize direction " + dd);
		}
	}

    /*
     * public methods: moveOneStep
     *
     * Move the ship by one step, which turn out
	 * to be the same as "turning" in the same
	 * direction of the ship.
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
		} else {
			console.log("ship turn: unrecognize direction " + dd);
		}
	}

    /*
     * public methods: hit/kill()
     *
     * Keep track of hit count and kill count.
     */
	this.hit = function()
	{
		this.hitCount++;
	}
	this.kill = function()
	{
		this.killCount++;
	}

    /*
     * public methods: draw()
     *
     * Render this ship.  If isSelf is true, render
	 * in red.
     */
	this.draw = function(c, isSelf)
	{
		try {
			var rx = Math.round(this.x);
			var ry = Math.round(this.y);
			if (isSelf === true)  {
				c.fillStyle = "#f00";
			} else {
				c.fillStyle = "#eee";
			}
			c.beginPath();
			if (this.dir == "up") {
				c.moveTo(rx,ry-5);
				c.lineTo(rx-5,ry+5);
				c.lineTo(rx+5,ry+5);
			} else if (this.dir == "right") {
				c.moveTo(rx+5,ry);
				c.lineTo(rx-5,ry-5);
				c.lineTo(rx-5,ry+5);
			} else if (this.dir == "left") {
				c.moveTo(rx-5,ry);
				c.lineTo(rx+5,ry-5);
				c.lineTo(rx+5,ry+5);
			} else if (this.dir == "down") {
				c.moveTo(rx,ry+5);
				c.lineTo(rx-5,ry-5);
				c.lineTo(rx+5,ry-5);
			}
			c.closePath();
			c.fill();
		} catch (e) {
			console.log(e.message);
		}
	}
}

global.Ship = Ship;

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
