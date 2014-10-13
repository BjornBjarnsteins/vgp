function spawnPowerUpAt(x, y) {
	console.log('spawning Power Up');
	var powerUp = new PowerUp({cx : x,
				   cy : y,

				   velY: 5,

							  });

	powerUp.randomizeEffect();

	g_activePowerUps.push(powerUp);

	return powerUp;
}


// A generic constructor which accepts an arbitrary descriptor object
function PowerUp(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}

PowerUp.prototype.size = 10;

PowerUp.prototype.update = function (du) {
	var prevY = this.cy + this.velY*du;

	if (g_paddle.collidesWith(this.cx, prevY,
							  this.cx, this.cy,
							  this.size)) {
		this.effect();
		scorePoint(this.score);
		destroy(this);
	} else if (this.cy > g_canvas.height + this.size) {
		destroy(this);
	}

	this.cy += this.velY*du;
};

function destroy(obj) {
	var index = g_activePowerUps.indexOf(obj);
	g_activePowerUps.splice(index, 1);
	/*obj.render = function () {return;};
	obj.effect = function () {return;};
	obj = null;*/
}

PowerUp.prototype.render = function(ctx) {
	// TODO: change to drawImage for this.sprite
	this.sprite.drawCentredAt(ctx, this.cx, this.cy, 0);
};

PowerUp.prototype.randomizeEffect = function () {
	var seed = Math.random();

	if (seed < 0.25) {
		this.effect = function () { shrinkPaddle(); };
		this.sprite = new Sprite("img/paddle_shrink_powerup.png");
		this.score = -10;
	} else if (seed < 0.5) {
		this.effect = function () { growPaddle(); };
		this.sprite = new Sprite("img/paddle_grow_powerup.png");
		this.score = 50;
	} else if (seed < 0.65) {
		this.effect = function () { speedUp(); };
		this.sprite = new Sprite("img/speed_up_powerup.png");
		this.score = 50;
	} else if (seed < 0.8) {
		this.effect = function () { speedDown(); };
		this.sprite = new Sprite("img/speed_down_powerup.png");
		this.score = -10;
	} else if (seed < 0.9) {
		this.effect = function () { toggleSticky(); };
		this.sprite = new Sprite("img/sticky_paddle_powerup.png");
		this.score = 0;
	} else if (seed < 0.95) {
		this.effect = function () { extraBall(); };
		this.sprite = new Sprite("img/extra_ball_powerup.png");
		this.score = 100;
	} else if (seed < 0.99) {
		this.effect = function () { enableTurret(); };
		this.sprite = new Sprite("img/turret_powerup.png");
		this.score = 0;
	} else {
		this.effect = function () { toggleSuper(); };
		this.sprite = new Sprite("img/super_ball_powerup.png");
		this.score = 1000;
	}
};

function shrinkPaddle() {
	g_paddle.shrink(10);
}

function growPaddle() {
	g_paddle.grow(10);
}

function extraBall() {
	g_paddle.spawnBall();
}

function speedUp() {
	g_paddle.changeSpeedBy(2);
}

function speedDown() {
	g_paddle.changeSpeedBy(-2);
}

function toggleSuper() {
	g_paddle.toggleSuper();
}

function toggleSticky() {
	g_paddle.sticky = true;
}

function enableTurret() {
	g_paddle.enableTurret();
}
