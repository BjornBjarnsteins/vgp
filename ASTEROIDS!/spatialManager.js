/*

spatialManager.js

A module which handles spatial lookup, as required for...
e.g. general collision detection.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var spatialManager = {

// "PRIVATE" DATA

_nextSpatialID : 1, // make all valid IDs non-falsey (i.e. don't start at 0)

_entities : [],

// "PRIVATE" METHODS
//
// <none yet>


// PUBLIC METHODS

getNewSpatialID : function() {
    var newId = this._nextSpatialID;
	this._nextSpatialID++;
	return newId;
},

register: function(entity) {
    var pos = entity.getPos();
    var spatialID = entity.getSpatialID();

	this._entities[spatialID] = {entity: entity,
								 posX  : pos.posX,
								 posY  : pos.posY};
},

unregister: function(entity) {
    var spatialID = entity.getSpatialID();

    delete this._entities[spatialID];

},

findEntityInRange: function(posX, posY, radius) {

    // TODO: YOUR STUFF HERE!
	for (var i = 0; i < this._entities.length; i++) {
		if (!this._entities[i]) {
			continue;
		}

		var otherRadius = this._entities[i].entity.getRadius();

		var distSq = util.distSq(posX, posY,
								 this._entities[i].posX,
								 this._entities[i].posY);

		if (distSq < util.square(radius+otherRadius)) {
			return this._entities[i].entity;
		}
	}
	return;

},

render: function(ctx) {
    var oldStyle = ctx.strokeStyle;
    ctx.strokeStyle = "red";

    for (var ID in this._entities) {
        var e = this._entities[ID];
        util.strokeCircle(ctx, e.posX, e.posY, e.entity.getRadius());
    }
    ctx.strokeStyle = oldStyle;
}

};
