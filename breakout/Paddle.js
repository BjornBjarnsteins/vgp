// A generic constructor which accepts an arbitrary descriptor object
function Paddle(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }

	this.spawnBall();
}

Paddle.prototype.halfWidth = 50;
Paddle.prototype.halfHeight = 8;
Paddle.prototype.vel = 7;
Paddle.prototype.maxVel = 20;
Paddle.prototype.minVel = 3;
Paddle.prototype.sticky = false;
Paddle.prototype.balls = [];
Paddle.prototype.onPaddle = [];
Paddle.prototype.colour = "#888888";
Paddle.prototype.turret = false;

Paddle.prototype.getReboundAngle = function (ballX, ballY) {
	var dx = this.cx - ballX;
	var dy = this.cy - ballY + this.halfHeight;

	return Math.atan(dx/dy);
};

Paddle.prototype.update = function (du) {
	for (var i = 0; i < this.balls.length; i++) {
		this.balls[i].update(du);
	}

	if (g_keys[this.KEY_LEFT]) {
        this.move(-this.vel * du);
    } else if (g_keys[this.KEY_RIGHT]) {
        this.move(this.vel * du);
    }

	this.checkBounds(du);

	if (g_keys[this.KEY_LAUNCH]) {
		this.launch();
	}

	if (eatKey(this.KEY_STICK)) {
		this.sticky = !this.sticky;
	}

	if (g_keys[this.KEY_GROW]) {
		this.halfWidth += 5 * du;
	} else if (g_keys[this.KEY_SHRINK]) {
		this.halfWidth -= 5 * du;
	}

	if (eatKey(this.KEY_ADD_BALL)) {
		this.spawnBall();
	}

	if (eatKey(this.KEY_TOGGLE_TURRET)) {
		this.enableTurret();
	}

	if (eatKey(this.KEY_FIRE_TURRET) && this.turret) {
		this.fireTurret();
		console.log("firing turret");
	}
};


Paddle.prototype.checkBounds = function (du) {
	if (this.cx - this.halfWidth < 0) {
		this.move(this.vel * du);
	} else if (this.cx + this.halfWidth > g_canvas.width) {
		this.move(-this.vel * du);
	}
};

Paddle.prototype.render = function (ctx) {
	for (var i = 0; i < this.balls.length; i++) {
		this.balls[i].render(ctx);
	}
    // (cx, cy) is the centre; must offset it for drawing
    fillBox(ctx, this.cx - this.halfWidth,
                 this.cy - this.halfHeight,
                 this.halfWidth * 2,
                 this.halfHeight * 2,
			     this.colour);

	// if I possessed any skills doing sprites I would have 2
	// different sprites that toggle with this.turret, but I don't
	// so this ugly crap will have to do
	if (this.turret) {
		fillBox(ctx, this.cx - this.halfWidth + 5,
			   		 this.cy - this.halfHeight - 10,
			   		 5, 15,
			   		 this.colour);
		fillBox(ctx, this.cx + this.halfWidth - 10,
			   		 this.cy - this.halfHeight - 10,
			   		 5, 15,
			   		 this.colour);
	}
};

Paddle.prototype.collidesWith = function (prevX, prevY,
                                          nextX, nextY,
                                          r) {
    var paddleEdge = this.cy;

	// Check Y coordinates
	if (nextY - r <= this.cy + this.halfHeight &&
		nextY + r >= this.cy - this.halfHeight) {
		// Check X coordinates
		if (nextX + r >= this.cx - this.halfWidth &&
			nextX - r <= this.cx + this.halfWidth) {
			return true;
		}
	}

    // It's a miss!
    return false;
};

// ========================
// Various Paddle mechanics
// ========================

Paddle.prototype.spawnBall = function () {
	var offset = (Math.random()-0.5)*this.halfWidth;

	var newBall = new Ball({
    	cx: this.cx + offset,
    	cy: this.cy - this.halfHeight - 7,
    	radius: 7,

    	xVel: 0,
    	yVel: 0
	});
	this.balls.push(newBall);

	this.catch(newBall);
};

Paddle.prototype.dropBall = function (ball) {
	if (this.balls.length === 1) {
		finishGame(false);
		// for some reason the game lags like hell after I remove
		// the last ball so I decided to just let him fly forever
		return;
	}

	var ballIndex = this.balls.indexOf(ball);
	this.balls.splice(ballIndex, 1);
	ball = null;
};

// Makes the ball stick to the paddle
Paddle.prototype.catch = function(ball) {
	ball.launchVel = ball.getVel();

	if (!ball.onPaddle) {
		ball.onPaddle = true;
		this.onPaddle.push(ball);
	}

	ball.xVel = 0;
	ball.yVel = 0;
};

Paddle.prototype.launch = function() {
	for (var i = 0; i < this.onPaddle.length; i++) {
		var b = this.onPaddle[i];
		var launchAngle = this.getReboundAngle(b.cx, b.cy);

		if (!b.launchVel) {
			b.launchVel = Math.sqrt(42);
		}

		b.xVel = -b.launchVel*Math.sin(launchAngle);
		b.yVel = -5;

		//this.sticky = false;
		b.onPaddle = false;
		console.log(this.onPaddle.length);
	}

	this.onPaddle = [];
};


Paddle.prototype.move = function (x) {
	this.cx += x;

	for (var b = 0; b < this.onPaddle.length; b++) {
		this.onPaddle[b].cx += x;
	}
};

// Increases the size of the paddle by x
Paddle.prototype.grow = function (x) {
	this.halfWidth += x/2;
};

// Shrinks the paddle by x
Paddle.prototype.shrink = function (x) {
	this.halfWidth -= x/2;
};

Paddle.prototype.changeSpeedBy = function (x) {
	this.vel += x;
	if (this.vel > this.maxVel) {
		this.vel = this.maxVel;
	} else if (this.vel < this.minVel) {
		this.vel = this.minVel;
	}
};

Paddle.prototype.toggleSuper = function () {
	for (var i = 0; i < this.balls.length; i++) {
		this.balls[i].superBall = true;
		this.balls[i].radius = 10;
	}
}

Paddle.prototype.enableTurret = function () {
	this.turret = true;
}

Paddle.prototype.fireTurret = function () {
	new Bullet({cx: this.cx - this.halfWidth,
				cy: this.cy,

				r: 5});

	new Bullet({cx: this.cx + this.halfWidth,
				cy: this.cy,

				r: 5});
}

// Bullet stuff

// A generic constructor which accepts an arbitrary descriptor object
function Bullet(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }

	g_bullets.push(this);
}

Bullet.prototype.vel = -10;

Bullet.prototype.update = function (du) {
	var nextY = this.cy + this.vel * du;

	if (g_wall.detectCollision(this.cx, this.cy, this.cx, nextY, 0) ||
	    this.cy < 0) {
		var index = g_bullets.indexOf(this);
		g_bullets.splice(index, 1);
	} else {
		this.cy += this.vel * du;
	}
};

Bullet.prototype.render = function (ctx) {
	var oldStyle = ctx.fillStyle;
	ctx.fillStyle = "red";
	fillCircle(ctx, this.cx, this.cy, this.r);
	ctx.fillStyle = oldStyle;
};
