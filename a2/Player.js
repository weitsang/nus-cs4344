/*
 * Player.js
 * Implementation of player objects in Pong.
 * Assignment 2 for CS4344, AY2013/14.
 * Modified from Davin Choo's AY2012/13 version.
 *
 * Changes from AY2012/13:
 *  - none
 *
 * Usage: 
 *   require('Ball.js') in both server and client.
 */
function Player(sid, pid, yPos) {
    // Public variables
    this.sid;   // Socket id. Used to uniquely identify players via 
                // the socket they are connected from
    this.pid;   // Player id. In this case, 1 or 2 
    this.paddle;// player's paddle object 
    this.delay; // player's delay 
    this.lastUpdated; // timestamp of last paddle update

    // Constructor
    this.sid = sid;
    this.pid = pid;
    this.paddle = new Paddle(yPos);
    this.delay = 0;
    this.lastUpdated = new Date().getTime();

    /*
     * priviledge method: getDelay
     *
     * Return the current delay associated with this player.
     * The delay has a random 20% fluctuation.
     */
    this.getDelay = function() {
        var errorPercentage = 20;
        var to = this.delay + errorPercentage*this.delay/100;
        var from = this.delay - errorPercentage*this.delay/100;
        if (this.delay != 0) {
            return Math.floor(Math.random() * (to - from + 1) + from);
        } else {
            return 0;
        }
    }
}

// For node.js require
global.Player = Player;

// vim:ts=4:sw=4:expandtab
