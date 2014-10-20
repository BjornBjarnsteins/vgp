/*

entityManager.js

A module which handles arbitrary entity-management for "Asteroids"


We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.

"Private" properties are denoted by an underscore prefix convention.

*/


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {

// "PRIVATE" DATA

_rocks   : [],
_bullets : [],
_ships   : [],

_bShowRocks : false,

// "PRIVATE" METHODS

_generateRocks : function(NUM_ROCKS) {
	var NUM_ROCKS = typeof NUM_ROCKS !== 'undefined' ? NUM_ROCKS : 4;

    // TODO: Make `NUM_ROCKS` Rocks!
	for (var i = 0; i < NUM_ROCKS; i++) {
		this._rocks.push(new Rock());
	}
},

_findNearestShip : function(posX, posY) {

    var closestShip = this._ships[0];
	var smallestDistance = util.wrappedDistSq(closestShip.cx, closestShip.cy,
									   posX, posY,
									   g_canvas.width, g_canvas.height);

	var smallestIndex = 0;

	for (var i = 0; i < this._ships.length; i++) {
		var distFromMouse = util.wrappedDistSq(this._ships[i].cx, this._ships[i].cy,
											   posX, posY,
											   g_canvas.width, g_canvas.height);
		if (distFromMouse < smallestDistance) {
			closestShip = this._ships[i];
			smallestDistance = distFromMouse;
			smallestIndex = i;
		}
	}

    // NB: Use this technique to let you return "multiple values"
    //     from a function. It's pretty useful!
    //
    return {
	theShip : closestShip,   // the object itself
	theIndex: smallestIndex   // the array index where it lives
    };
},

_forEachOf: function(aCategory, fn, fnArgs) {
    for (var i = 0; i < aCategory.length; ++i) {
	fn.call(aCategory[i], fnArgs);
    }
},

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {
    this._categories = [this._rocks, this._bullets, this._ships];
},

init: function() {
    this._generateRocks();
	window.addEventListener("keydown", yoinkNearestShip);
},

fireBullet: function(cx, cy, velX, velY, rotation) {
	this._bullets.push(new Bullet({cx: cx,
								   cy: cy,

								   velX: velX,
								   velY: velY,

								   rotation: rotation}));
},

generateShip : function(descr) {
	this._ships.push(new Ship(descr));
},

killNearestShip : function(xPos, yPos) {
	var nearestShip = this._findNearestShip(xPos, yPos);

	this._ships.splice(nearestShip.theIndex, 1);
},

yoinkNearestShip : function(xPos, yPos) {
    var nearestShip = this._findNearestShip(xPos, yPos);

	nearestShip.theShip.cx = xPos;
	nearestShip.theShip.cy = yPos;
},

resetShips: function() {
    this._forEachOf(this._ships, Ship.prototype.reset);
},

haltShips: function() {
    this._forEachOf(this._ships, Ship.prototype.halt);
},

toggleRocks: function() {
    this._bShowRocks = !this._bShowRocks;
},

update: function(du) {
	this._forEachOf(this._ships, Ship.prototype.update, du);

	this._forEachOf(this._rocks, Rock.prototype.update, du);

	for (var i = 0; i < this._bullets.length; i++) {
		if (this._bullets[i].update(du) === -1) {
			this._bullets.splice(i, 1);
		}
	}

    // TODO: Implement this

    // NB: Remember to handle the "KILL_ME_NOW" return value!
    //     and to properly update the array in that case.
},

render: function(ctx) {
	if (this._bShowRocks) {
		this._forEachOf(this._rocks, Rock.prototype.render, ctx);
	}

	this._forEachOf(this._ships, Ship.prototype.render, ctx);

	this._forEachOf(this._bullets, Bullet.prototype.render, ctx);
}

};

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

entityManager.init();
