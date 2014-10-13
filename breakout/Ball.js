// ==========
// BALL STUFF
// ==========

// BALL STUFF

// A generic constructor which accepts an arbitrary descriptor object
function Ball(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}

Ball.prototype.colour = "#AAAAAA";
Ball.prototype.superBall = false;
Ball.onPaddle = true;

// Returns the total velocity of this ball
Ball.prototype.getVel = function () {
	return Math.sqrt(this.xVel*this.xVel + this.yVel*this.yVel);
};

Ball.prototype.update = function (du) {
    // Remember my previous position
    var prevX = this.cx;
    var prevY = this.cy;

    // Compute my provisional new position (barring collisions)
    var nextX = prevX + this.xVel * du;
    var nextY = prevY + this.yVel * du;

    // Bounce off the paddles
    if (g_paddle.collidesWith(prevX, prevY, nextX, nextY, this.radius))
    {
		if (g_paddle.sticky) {
			g_paddle.catch(this);
			return;
		}

		var newAngle = g_paddle.getReboundAngle(prevX,
												prevY + this.radius);

		this.yVel *= -1;
        //this.yVel = -this.getVel()*Math.cos(-newAngle);
		this.xVel = -this.getVel()*Math.sin(newAngle);
    }


	// Handles collisions with the Wall
	// if this ball is a superball it doesn't bounce off bricks
	var wallCollision = g_wall.detectCollision(prevX, prevY, nextX, nextY, this.radius);

	if (this.superBall) {
	}
	else if (wallCollision === "bottom") {
		this.yVel *= -1;
	} else if (wallCollision === "side") {
		this.xVel *= -1;
	}

    // Bounce off top and bottom edges
    if (nextX - this.radius < 0 ||                             // left edge
        nextX + this.radius > g_canvas.width) {                // right edge
        this.xVel *= -1;
    }

	if (nextY - this.radius < 0) {
		this.yVel *= -1; 						 // top edge
	}

	if (nextY > g_canvas.height+this.radius) {
		g_paddle.dropBall(this);
	}

    // *Actually* update my position
    // ...using whatever velocity I've ended up with
    //
    this.cx += this.xVel * du;
    this.cy += this.yVel * du;
};

Ball.prototype.reset = function () {
    this.cx = 300;
    this.cy = 100;
    this.xVel = -5;
    this.yVel = 4;
};

Ball.prototype.render = function (ctx) {
	var oldStyle = ctx.fillStyle;
	ctx.fillStyle = this.colour;
    fillCircle(ctx, this.cx, this.cy, this.radius);
	ctx.fillStyle = "black";
	ctx.arc(this.cx, this.cy, this.radius, 0, Math.PI * 2);
	ctx.stroke();
	ctx.fillStyle = oldStyle;
};
