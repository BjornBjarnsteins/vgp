"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

// ======================
// INITALIZE GAME OBJECTS
// ======================

// Create Paddle
var KEY_A = 'A'.charCodeAt(0);
var KEY_D = 'D'.charCodeAt(0);
var KEY_N = 'N'.charCodeAt(0);
var KEY_M = 'M'.charCodeAt(0);
var KEY_S = 'S'.charCodeAt(0);
var KEY_PLUS = '+'.charCodeAt(0);
var KEY_MINUS = '-'.charCodeAt(0);
var KEY_SPACE = ' '.charCodeAt(0);
var KEY_B = 'B'.charCodeAt(0);
var KEY_T = 'T'.charCodeAt(0);
var KEY_W = 'W'.charCodeAt(0);

var g_paddle = new Paddle({
	cx : 150,
	cy : g_canvas.height-30,

	KEY_LEFT  : KEY_A,
	KEY_RIGHT : KEY_D,

	KEY_GROW   : KEY_M,
	KEY_SHRINK : KEY_N,

	KEY_LAUNCH : KEY_SPACE,
	KEY_STICK  : KEY_S,

	KEY_ADD_BALL : KEY_B,

	KEY_TOGGLE_TURRET : KEY_T,
	KEY_FIRE_TURRET : KEY_W
});


// Create The Wall
var g_wall = new Wall({width: g_canvas.width});

// List of powerups that are on the screen
var g_activePowerUps = [];

var background = document.getElementById('background');

// List of bullets currently flying
var g_bullets = [];

// Score stuff
var score = 0;
var scoreX = 585;
var scoreY = 30;

function scorePoint(x) {
	score += x;
}

function renderScore(ctx) {
	ctx.font = "20px Verdana";
	ctx.textAlign = "end";
	var scoreStr = "Score: " + score;
	var oldStyle = ctx.fillStyle;
	ctx.fillStyle = "white";
	ctx.fillText(scoreStr, scoreX, scoreY);
	ctx.fillStyle = oldStyle;
}

// Game over dialogue
var gameOver = false;
var gameWon = false;

// call this function only when the game is finished
// if player won the game, victory === true, false otherwise
function finishGame(victory) {
	g_isUpdatePaused = true;
	gameOver = true;

	gameWon = victory;
}

function renderGameOver(ctx) {
	if (!gameOver) return;

	// semitransparent overlay for the game screen
	ctx.globalAlpha = 0.75;
	ctx.fillRect(0, 0, g_canvas.width, g_canvas.height);
	ctx.globalAlpha = 1;

	if (gameWon) {
		var gameOverMsg = "You are winner!";
	} else {
		var gameOverMsg = "You lost!";
	}

	ctx.save();

	ctx.font = "50px Georgia";
	ctx.textAlign = "center";
	ctx.fillStyle = "white";
	ctx.fillText(gameOverMsg, g_canvas.width/2, g_canvas.height/2 - 20);

	ctx.restore();
}

// =============
// GATHER INPUTS
// =============

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}

// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {
    g_paddle.update(du);

	for (var i=0; i<g_activePowerUps.length; i++) {
		g_activePowerUps[i].update(du);
	}

	for (var i=0; i<g_bullets.length; i++) {
		g_bullets[i].update(du);
	}
}


// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`


// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {
	ctx.drawImage(background, 0, 700, 3328, 3328, 0, 0, 600, 600);

    g_paddle.render(ctx);

	g_wall.render(ctx);

	for (var i=0; i<g_activePowerUps.length; i++) {
		g_activePowerUps[i].render(ctx);
	}

	for (var i=0; i<g_bullets.length; i++) {
		g_bullets[i].render(ctx);
	}

	renderGameOver(ctx);

	renderScore(ctx);
}

// Kick it off
g_main.init();
