// enforce strict/clean programming
"use strict"; 

function Rocket()
{
	// public:
	this.x;
	this.y;
	this.dir;
	this.from;

	// private:
	var lastX;
	var lastY;
	var timer;
	var lastUpdateAt;

	var VELOCITY = 0.05;
	var speed = 20; // update at 1000/speed interval.

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

	var calcDistance = function() {
		var deltaTime = getTimestamp() - lastUpdateAt;
		var distance = deltaTime*VELOCITY;
		return distance;
	}

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
	this.up = function()
	{
		var distance = calcDistance();
		this.y = lastY - distance; 
		lastY = this.y;
		lastUpdateAt = getTimestamp();
		//this.dir = 'up';
		//clearTimeout(timer);
		//timer = setTimeout(function() {that.up();}, 1000/speed); // 30 fps
	}

	this.down = function()
	{
		var distance = calcDistance();
		this.y = lastY + distance; 
		lastY = this.y;
		lastUpdateAt = getTimestamp()
		//this.dir = 'down';
		//clearTimeout(timer);
		//timer = setTimeout(function() {that.down();}, 1000/speed); // 30 fps
	}

	this.left = function()
	{
		var distance = calcDistance();
		this.x = lastX - distance; 
		lastX = this.x;
		lastUpdateAt = getTimestamp();
		//this.dir = 'left';
		//clearTimeout(timer);
		//timer = setTimeout(function() {that.left();}, 1000/speed); // 30 fps
	}

	this.right = function()
	{
		var distance = calcDistance();
		this.x = lastX + distance; 
		lastX = this.x;
		lastUpdateAt = getTimestamp();
		//this.dir = 'right';
		//clearTimeout(timer);
		////timer = setTimeout(function() {that.right();}, 1000/speed); // 30 fps
	}
	
	this.hit = function(ship)
	{
		if (this.x + 3 > ship.x && this.x - 3 < ship.x && 
				this.y + 3 > ship.y && this.y - 3 < ship.y) {
			return true;
		} else {
			return false;
		}
	}

	// c is the HTML canvas context for drawing.
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

function Ship()
{
	// public:
	this.x;
	this.y;
	this.dir;
	this.hitCount = 0;
	this.killCount = 0;


	// private:
	var shipTimer;
	var lastX;
	var lastY;
	var lastUpdateAt;
	var VELOCITY = 0.02;
	var speed = 20; // update at 1000/speed interval.

	// constructor
	var that = this;

	this.init = function(xx, yy, dd) {
		that.x = xx;
		this.y = yy;
		this.dir = dd;
		that.turn(dd);
	}

	var calcDistance = function() {
		var deltaTime = getTimestamp() - lastUpdateAt;
		var distance = deltaTime*VELOCITY;
		return distance;
	}

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
		//clearTimeout(shipTimer);
		//shipTimer = setTimeout(function() {that.up();}, 1000/speed); // 30 fps
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
		//clearTimeout(shipTimer);
		//shipTimer = setTimeout(function() {that.down();}, 1000/speed); // 30 fps
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
		//clearTimeout(shipTimer);
		//shipTimer = setTimeout(function() {that.left();}, 1000/speed); // 30 fps
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
		//clearTimeout(shipTimer);
		//shipTimer = setTimeout(function() {that.right();}, 1000/speed); // 30 fps
	}

	this.jumpTo = function(xx,yy)
	{
		this.x = xx;
		this.y = yy;
	}

	this.turn = function(dd)
	{
		lastX = this.x;
		lastY = this.y;
		lastUpdateAt = getTimestamp();
		if (dd == "up") {
			that.up();
		} else if (dd == "down") {
			that.down();
		} else if (dd == "left") {
			that.left();
		} else if (dd == "right") {
			that.right();
		} else {
			console.log("ship turn: unrecognize direction " + dd);
		}
	}

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

	this.hit = function()
	{
		this.hitCount++;
	}
	this.kill = function()
	{
		this.killCount++;
	}

	// c is the HTML canvas context for drawing.
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
global.Rocket = Rocket;

// Dynamically define the getTimestamp() function depending on
// platform.
if (typeof window === "undefined") {
	console.log("using process.hrtime()");
	var getTimestamp = function() { 
		var t = process.hrtime(); return t[0]*1e3 + t[1]*1.0/1e6
	} 
} else if (window.performance.now) {
	console.log("using window.performence.now()");
	var getTimestamp = function() { 
		return window.performance.now(); 
	};
} else if (window.performance.webkitNow) {
	console.log("using window.performence.webkitNow()");
    var getTimestamp = function() { 
		return window.performance.webkitNow(); 
	};
} else {
	console.log("using Date.now();");
	var getTimestamp = function() { 
		return new Date().now(); 
	};
}

