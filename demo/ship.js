function Ship()
{
	var x = 250;
	var y = 250;
	var dir = 'up';

	// constructor
	that = this;

	this.up = function()
	{
		y = y-1;
		dir = 'up';
	}
	this.down = function()
	{
		y = y+1;
		dir = 'down';
	}
	this.left = function()
	{
		x = x-1;
		dir = 'left';
	}
	this.right = function()
	{
		x = x+1;
		dir = 'right';
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
	this.setDir = function(dd)
	{
		dir = dd;
	}
	// c is the HTML canvas context for drawing.
	this.draw = function(c)
	{
		c.fillStyle = "#eee";
		c.beginPath();
			if (dir == "up") {
				c.moveTo(x,y-5);
				c.lineTo(x-5,y+5);
				c.lineTo(x+5,y+5);
			} else if (dir == "right") {
				c.moveTo(x+5,y);
				c.lineTo(x-5,y-5);
				c.lineTo(x-5,y+5);
			} else if (dir == "left") {
				c.moveTo(x-5,y);
				c.lineTo(x+5,y-5);
				c.lineTo(x+5,y+5);
			} else if (dir == "down") {
				c.moveTo(x,y+5);
				c.lineTo(x-5,y-5);
				c.lineTo(x+5,y-5);
			}
		c.closePath();
		c.fill();
	}
}

global.Ship = Ship;
