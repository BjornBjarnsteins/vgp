
// Watchmen Smiley, with gradient and blood, and scale and rotation
// ...and keyboard-handling to move it around

"use strict";
/* jshint browser: true, devel: true, globalstrict: true */

/*
Stay within this 72 character margin, to keep your code easily readable
         1         2         3         4         5         6         7
123456789012345678901234567890123456789012345678901234567890123456789012
*/

// ======================
// IMPORTANT INSTRUCTIONS
// ======================
//
// * As ever, Fork Off this Fiddle BEFORE making any changes.
//
// * Submit your URL with an explicit numerical version suffix
//   (e.g. "jsfiddle.net/qWeRtY/0" denoting version 0)
//   NB: If you do not provide a suffix, the marker is allowed
//   to assume anything. In particular, they may assume 0.
//
// * Don't modify this framework except where instructed.
//   It is here to help you (and to help us when marking!)
//
// * DON'T CHEAT!


// ==========
// OBJECTIVES
// ==========
//
// * Draw a "midground" smiley at coords x=350, y=50 with radius=50
// * WASD keys should move it up/left/down/right by 10 pixels-per-event
// * OP keys should divide/multiply its radius by a factor of 1.1
// * QE keys should reduce/increase its orientation by 1/37th of a
//      revolution.
// * T should toggle a "trail" behind the moveable one.
//   HINT: Doing this is actually easier than NOT doing it!
//
// * B should toggle a background of 2 other smileys
// * F should toggle a foreground of 2 other smileys
// * One of the foreground smileys should rotate in the opposite
//   direction to the player-moveable one.
//
// * M should toggle support for moving the smiley via the mouse
//
// * The background should be on by default
// * The foreground should be on by default
// * The trail should be off by default
// * The mouse-control should be off by default
//
// NB: The trail *doesn't* have to be preserved across F and B toggles
//     Typically, either of these toggles will have the side-effect of
//     erasing the current trail.
//
//     The drawBackground and drawForeground functions have been
//     provided for you, but you'll have to modify the foreground one
//     to implement the counter-rotation feature.


// ============
// UGLY GLOBALS
// ============
//
// Regrettable, but they just make things easier.
//
var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");
var g_keys = [];
var g_trail = false;
var g_background = true;
var g_foreground = true;
var g_usingMouse = false;
// Key codes
var KEY_Q = 81;
var KEY_W = 87;
var KEY_E = 69;
var KEY_A = 65;
var KEY_S = 83;
var KEY_D = 68;
var KEY_O = 79;
var KEY_P = 80;
var KEY_T = 84;
var KEY_B = 66;
var KEY_F = 70;
var KEY_M = 77;
var KEY_R = 82;

// ================
// HELPER FUNCTIONS
// ================

function clear() {
  g_ctx.clearRect(0, 0, g_canvas.width, g_canvas.height);
}

function drawBackground() {
    drawDefaultSmiley(g_ctx);
    drawSmileyAt(g_ctx,  25, 375,  25, -Math.PI/8);
}

function drawForeground() {
    drawSmileyAt(g_ctx,  25, 375,  25, Math.PI/8);

    // TODO: Make this one rotate in the opposite direction
    //       to your player-controllable one.
    drawSmileyAt(g_ctx, 300, 300, 100, g_smiley.foregroundAngle);
}

function fillEllipse(ctx, cx, cy, halfWidth, halfHeight, angle) {
    ctx.save(); // save the current ctx state, to restore later
    ctx.beginPath();

    // These "matrix ops" are applied in last-to-first order
    // ..which can seem a bit weird, but actually makes sense
    //
    // After modifying the ctx state like this, it's important
    // to restore it
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.scale(halfWidth, halfHeight);

    // Just draw a unit circle, and let the matrices do the rest!
    ctx.arc(0, 0, 1, 0, Math.PI*2);
    ctx.fill();

    ctx.restore();
}


// =================
// MATRIX CLEVERNESS
// =================

function drawSmileyAt(ctx, cx, cy, radius, angle) {
    // This matrix trickery lets me take a "default smiley",
    // and transform it so I can draw it anyway, at any size,
    // and at any angle.
    //
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    var scale = radius / g_defaultSmileyRadius;
    ctx.scale(scale, scale);
    ctx.translate(-g_defaultSmileyX, -g_defaultSmileyY);
    drawDefaultSmiley(ctx);
    ctx.restore();
}


// =================
// OUR SMILEY OBJECT
// =================

// Let's make the user-controllable smiley into a simple
// little javascript object. (Global for "convenience").
//
var g_smiley = {
    x : 350,
    y :  50,

    radius : 50,
    angle  : 0,
    foregroundAngle : Math.PI/8
};

// Let's add a draw method...
//
// (We could have done that above, but I find that it's sometimes
// cleaner to add the functions separately, to reduce indentation.)
//
g_smiley.draw = function() {
    drawSmileyAt(g_ctx,
                 this.x, this.y,
                 this.radius, this.angle);
};

g_smiley.moveUp = function() {
    this.y -= 10;
    redraw();
};

g_smiley.moveDown = function() {
    this.y += 10;
    redraw();
};

g_smiley.moveLeft = function() {
    this.x -= 10;
    redraw();
};

g_smiley.moveRight = function() {
    this.x += 10;
    redraw();
};

g_smiley.rotateLeft = function() {
  this.angle += 2*Math.PI/37;
  this.foregroundAngle -= 2*Math.PI/37;
  redraw();
};

g_smiley.rotateRight = function() {
  this.angle -= 2*Math.PI/37;
  this.foregroundAngle += 2*Math.PI/37;
  redraw();
};

g_smiley.grow = function() {
  this.radius *= 1.1;
  redraw();
};

g_smiley.shrink = function() {
  this.radius /= 1.1;
  redraw();
};

// You *might* want to add other methods here, as part of your
// implementation.. or you could just manipulate the object
// state directly from inside other (non-member) functions.
//
// On a small project like this, direct manipulation is fine,
// and might be simpler. On a larger project, you would be
// more likely to do everything via "methods" i.e. functions
// which belong to the object itself.


// ======================
// DEFAULT SMILEY DRAWING
// ======================

var g_defaultSmileyX = 200,
    g_defaultSmileyY = 200,
    g_defaultSmileyRadius = 150;

// A crappy placeholder smiley implementation.
function drawDefaultSmiley(ctx) {
    ctx.save();

    // abbreviation variables
    var cx = g_defaultSmileyX,
        cy = g_defaultSmileyY,
        r  = g_defaultSmileyRadius;

    // face
    ctx.fillStyle = "yellow";
    fillEllipse(ctx, cx, cy, r, r, 0);

    // border
    strokeArc(ctx, cx, cy, r, 0, Math.PI * 2, "black");

    // weird HAL-like cyclops eye!
    ctx.fillStyle = "black";
    fillEllipse(ctx, cx, cy - r/3, r/3, r/3, 0);
    ctx.fillStyle = "red";
    fillEllipse(ctx, cx, cy - r/3, r/4, r/4, 0);

    // mouth
    var smileAngle = Math.PI * 0.7,
        smileAngleOffset = (Math.PI - smileAngle) /2,
        smileAngleStart = smileAngleOffset,
        smileAngleEnd = Math.PI - smileAngleOffset,
        smileRadius = r * 2/3;
    ctx.lineWidth = r / 20;
    strokeArc(ctx, cx, cy, smileRadius,
              smileAngleStart, smileAngleEnd, "black");

    ctx.restore();
}

function strokeArc(ctx, x, y, radius, startAngle, endAngle)
{
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle);
    ctx.stroke();
}


// =====================================================
// YOUR VERSION OF drawDefaultSmiley(ctx) SHOULD GO HERE
// =====================================================
//
// Your version will replace my placeholder implementation.
//
// If you didn't complete the previous homework, then just
// use my crappy placeholder.
//
/*
function drawDefaultSmiley(ctx) {
    // YOUR CODE
}
*/


// ======
// REDRAW
// ======
//
// Your code should call this when needed, to update the
// screen. You'll have to edit this routine to make it do
// everything that is required (e.g. background, foreground,
// dealing with the "trail" etc).
//
function redraw() {
    // Simple version: just draw the initial "midground" smiley
    // NB: This doesn't handle background/foreground yet.

  if (g_trail) {
    if (g_background) {
      drawBackground();
    }
    g_smiley.draw();
  } else {
    clear();
    if (g_background) {
      drawBackground();
    }
    g_smiley.draw();
  }

  if (g_foreground) {
    drawForeground();
  }
}


// ========================================
// YOUR EVENT-HANDLING STUFF SHOULD GO HERE
// ========================================

function initEventHandlers() {
  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("keyup", handleKeyup);
}

function handleKeydown(evt) {
  g_keys[evt.keyCode] = true;

  // Movement commands
  if (g_keys[KEY_W]) { g_smiley.moveUp(); }
  if (g_keys[KEY_A]) { g_smiley.moveLeft(); }
  if (g_keys[KEY_S]) { g_smiley.moveDown(); }
  if (g_keys[KEY_D]) { g_smiley.moveRight(); }

  // Rotation commands
  if (g_keys[KEY_Q]) { g_smiley.rotateRight(); }
  if (g_keys[KEY_E]) { g_smiley.rotateLeft(); }

  // Resizing commands
  if (g_keys[KEY_O]) { g_smiley.grow(); }
  if (g_keys[KEY_P]) { g_smiley.shrink(); }

  // Toggle trail
  if (g_keys[KEY_T]) { toggleTrail(); }

  // Toggle background/foreground
  if (g_keys[KEY_B]) { toggleBackground(); }
  if (g_keys[KEY_F]) { toggleForeground(); }

  //Toggle mouse movement
  if (g_keys[KEY_M]) { toggleMouse(); }

  // Extra command to reset the canvas
  if (g_keys[KEY_R]) { reset(); }
}

function handleKeyup(evt) {
  g_keys[evt.keyCode] = false;
}

function toggleTrail() {
  g_trail = !g_trail;
}

function toggleBackground() {
  g_background = !g_background;

  if (g_background) {
    drawBackground();
    redraw();
  } else {
    clear();
    redraw();
  }
}

function toggleForeground() {
  g_foreground = !g_foreground;

  if (g_foreground) {
    drawForeground();
  } else {
    clear();
    redraw();
  }
}

function toggleMouse() {
  g_usingMouse = !g_usingMouse;

  if (g_usingMouse) {
    window.addEventListener("mousemove", handleMouseMove);
  } else {
    window.removeEventListener("mousemove", handleMouseMove);
  }
}

function handleMouseMove(evt) {
  g_smiley.x = evt.clientX;
  g_smiley.y = evt.clientY;
  redraw();
}

function reset() {
  g_smiley.x = 350;
  g_smiley.y = 50;
  g_smiley.radius = 50;
  g_smiley.angle = 0;
  g_background = true;
  g_foreground = true;
  g_trail = false;
  redraw();
}



// For now, I'm just going to do this, to kick things off...
clear();
redraw();
initEventHandlers();
