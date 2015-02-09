/*
 * Ball.js
 * Implementation of the ball object in Pong.
 * Assignment 2 for CS4344, AY2013/14.
 * Modified from Davin Choo's AY2012/13 version.
 *
 * Changes from AY2012/13:
 *  - distance travelled now depends on time (previously,
 *    each step is constant).
 *
 * Usage: 
 *   require('Ball.js') in both server and client.
 */

// enforce strict/clean programming
"use strict"; 

function Ball() {
    // Private variables
    var moving; // boolean of whether ball is moving
    var lastUpdate; // timestamp of lastUpdate

    // Public variables
    this.x;     // x-coordinate of ball's position 
    this.y;     // y-coordinate of ball's position
    this.vx;    // x-component of ball's velocity
    this.vy;    // y-component of ball's 
    this.velocityUpdated; // has the ball bounced?
    this.outOfBound; // has the ball gone out of bound?

    // constructor
    var that = this;
    moving = false;
    this.vx = 0;
    this.vy = 0;
    this.x = Pong.WIDTH/2;
    this.y = Pong.HEIGHT/2;
    this.velocityUpdated = false;
    this.outOfBound = false;

    /*
     * private method: updateVelocity(px)
     *
     * Called from checkForBounce whenever the ball hits the 
     * or paddle.  px is the x-position of the paddle.
     * 
     * The velocity changes depending on which region the ball
     * hits the paddle.
     */
    var updateVelocity = function(px) {
        // Change direction (vx) depending on collision point between ball and paddle
        that.velocityUpdated = true;
        if (that.x >= px - Paddle.R1 && that.x <= px + Paddle.R1) {
            that.vy = -that.vy;
        } else if (that.x >= px - Paddle.R2 && that.x <= px + Paddle.R2) {
            that.vx += (that.x > px? 1 : -1);
            that.vy = -that.vy;
        } else if (that.x >= px - Paddle.R3 && that.x <= px + Paddle.R3) {
            that.vx += (that.x > px? 2 : -2);
            that.vy = -that.vy;
        } else if (that.x + Ball.WIDTH/2 >= px - Paddle.WIDTH/2 && that.x - Ball.WIDTH/2 <= px + Paddle.WIDTH/2) {
            that.vx += (that.x > px? 3 : -3);
            that.vy = -that.vy;
        } else {
            // ball didn't collide with paddle
            that.velocityUpdated = false;
        }
    }

    /*
     * priviledged method: reset()
     */
    this.reset = function(){
        this.vx = 0;
        this.vy = 0;
        this.x = Pong.WIDTH/2;
        this.y = Pong.HEIGHT/2;
        moving = false;
    }

    /*
     * priviledged method: startMoving()
     *
     * Change the ball velocity to non-zero and 
     * set the moving flag to true.
     */
    this.startMoving = function(){
        that.vx = 0;
        that.vy = Ball.VERTICAL_VELOCITY;
        that.velocityUpdated = true;
        moving = true;
        lastUpdate = getTimestamp();
    }
      
    /*
     * priviledged method: isMoving()
     *
     * Return true iff the ball is moving.
     */
    this.isMoving = function() {
        return moving;
    }

    /*
     * priviledged method: updatePosition()
     *
     * Called to calculate the new position of the ball.  
     */
    this.updatePosition = function() {
        var now = getTimestamp(); // get the current time in millisecond resolution
        
        // Update position
        that.x += that.vx*(now - lastUpdate)*Pong.FRAME_RATE/1000;
        that.y += that.vy*(now - lastUpdate)*Pong.FRAME_RATE/1000;

        lastUpdate = now;
    }

    /*
     * priviledged methods: isMoving<Dir>()
     * (e.g., isMovingUp())
     *
     * Return true iff the ball is moving in the direction.
     */
    this.isMovingUp = function() {
        return (that.vy < 0);
    }
    this.isMovingDown = function() {
        return (that.vy > 0);
    }
    this.isMovingLeft = function() {
        return (that.vx < 0);
    }
    this.isMovingRight = function() {
        return (that.vx > 0);
    }

    /*
     * priviledged method: checkForBounce(topPaddle, bottomPaddle)
     *
     * Called to calculate the new position of the ball.  Update 
     * velocity if the ball hits the paddle.
     */
    this.checkForBounce = function(topPaddle, bottomPaddle) {

        // Check for bouncing
        if ((that.isMovingLeft() && that.x <= Ball.WIDTH/2) || 
            (that.isMovingRight() && that.x >= Pong.WIDTH - Ball.WIDTH/2)) {
            // Bounds off horizontally
            that.vx = -that.vx;
        } else if ((that.isMovingDown() && that.y + Ball.HEIGHT/2 > Pong.HEIGHT) || 
                (that.isMovingUp() && that.y - Ball.HEIGHT/2 < 0)) {
            // Goes out of bound! Lose point and restart.
            that.reset();
            that.outOfBound = true;
        } else if (that.isMovingUp() && that.y - Ball.HEIGHT/2 < Paddle.HEIGHT) {
            // Chance for ball to collide with top paddle.
            updateVelocity(topPaddle.x);
        } else if (that.isMovingDown() && that.y + Ball.HEIGHT/2 > Pong.HEIGHT - Paddle.HEIGHT) {
            // Chance for ball to collide with bottom paddle.
            updateVelocity(bottomPaddle.x);
        }
    }

    // the following snippet defines an appropriate high resolution 
    // getTimestamp function depends on platform.
    if (typeof window === "undefined") {
        console.log("using process.hrtime()");
        var getTimestamp = function() { var t = process.hrtime(); return t[0]*1e3 + t[1]*1.0/1e6} 
    } else if (window.performance !== undefined) {
        if (window.performance.now) {
            console.log("using window.performence.now()");
            var getTimestamp = function() { return window.performance.now(); };
        } else if (window.performance.webkitNow) {
            console.log("using window.performence.webkitNow()");
            var getTimestamp = function() { return window.performance.webkitNow(); };
        }
    } else {
        console.log("using Date.now();");
        var getTimestamp = function() { return new Date().now(); };
    }
    // initialize the lastUpdate so that it is not a NaN
    lastUpdate = getTimestamp();
}

// Static variables
Ball.WIDTH = 20;
Ball.HEIGHT = 20;
Ball.VERTICAL_VELOCITY = 7;

// For node.js require
global.Ball = Ball;

// vim:ts=4:sw=4:expandtab
