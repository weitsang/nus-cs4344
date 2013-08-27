if (typeof window === "undefined") {
	console.log("using process.hrtime()");
	var getTimestamp = function() { t = process.hrtime(); return t[0]*1e3 + t[1]*1.0/1e6} 
} else if (window.performance.now) {
	console.log("using window.performence.now()");
	var getTimestamp = function() { return window.performance.now(); };
} else if (window.performance.webkitNow) {
	console.log("using window.performence.webkitNow()");
    var getTimestamp = function() { return window.performance.webkitNow(); };
} else {
	console.log("using Date.now();");
	var getTimestamp = function() { return new Date().now(); };
}

function Ship()
{
	var x;
	var y;
	var dir;
	var shipTimer;
	var lastX;
	var lastY;
	var lastUpdateAt;
	var VELOCITY = 0.02;
	var speed = 20; // update at 1000/speed interval.

	// constructor
	var that = this;

	this.init = function(xx, yy, dd) {
		x = xx;
		y = yy;
		dir = dd;
		that.turn(dd);
	}

	var calcDistance = function() {
		deltaTime = getTimestamp() - lastUpdateAt;
		distance = deltaTime*VELOCITY;
		return distance;
	}

	this.up = function()
	{
		distance = calcDistance();
		y = lastY - distance; 
		if (y < 0) { 
			y = y + 500;
			lastY = y;
			lastUpdateAt = getTimestamp();
		}
		dir = 'up';
		clearTimeout(shipTimer);
		shipTimer = setTimeout(function() {that.up();}, 1000/speed); // 30 fps
	}
	this.down = function()
	{
		distance = calcDistance();
		y = lastY + distance; 
		if (y > 500) { 
			y = y - 500;
			lastY = y;
			lastUpdateAt = getTimestamp()
		}
		dir = 'down';
		clearTimeout(shipTimer);
		shipTimer = setTimeout(function() {that.down();}, 1000/speed); // 30 fps
	}
	this.left = function()
	{
		distance = calcDistance();
		x = lastX - distance; 
		if (x < 0) { 
			x = x + 500;
			lastX = x;
			lastUpdateAt = getTimestamp();
		}
		dir = 'left';
		clearTimeout(shipTimer);
		shipTimer = setTimeout(function() {that.left();}, 1000/speed); // 30 fps
	}
	this.right = function()
	{
		distance = calcDistance();
		x = lastX + distance; 
		if (x > 500) { 
			x = x - 500;
			lastX = x;
			lastUpdateAt = getTimestamp();
		}
		dir = 'right';
		clearTimeout(shipTimer);
		shipTimer = setTimeout(function() {that.right();}, 1000/speed); // 30 fps
	}
	this.getX = function()
	{
		return x;
	}
	this.getY = function()
	{
		return y;
	}
	this.getDir = function()
	{
		return dir;
	}
	this.setX = function(xx)
	{
		x = parseInt(xx);
	}
	this.setY = function(yy)
	{
		y = parseInt(yy);
	}
	this.turn = function(dd)
	{
		lastX = x;
		lastY = y;
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
			console.log("unrecognize direction " + dd);
		}
	}

	// c is the HTML canvas context for drawing.
	this.draw = function(c, isSelf)
	{
		try {
			rx = Math.round(x);
			ry = Math.round(y);
			if (isSelf === true)  {
				c.fillStyle = "#f00";
			} else {
				c.fillStyle = "#eee";
			}
			c.beginPath();
			if (dir == "up") {
				c.moveTo(rx,ry-5);
				c.lineTo(rx-5,ry+5);
				c.lineTo(rx+5,ry+5);
			} else if (dir == "right") {
				c.moveTo(rx+5,ry);
				c.lineTo(rx-5,ry-5);
				c.lineTo(rx-5,ry+5);
			} else if (dir == "left") {
				c.moveTo(rx-5,ry);
				c.lineTo(rx+5,ry-5);
				c.lineTo(rx+5,ry+5);
			} else if (dir == "down") {
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
