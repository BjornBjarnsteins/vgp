// A generic constructor which accepts an arbitrary descriptor object
function Wall(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }

	this.init();
}

Wall.prototype.leftX = 0;
Wall.prototype.topY = 50;
Wall.prototype.width = 600;
Wall.prototype.height = 180
Wall.prototype.rows = 6;
Wall.prototype.columns = 15;
Wall.prototype.bricksToGo = 6*15;

Wall.prototype.init = function () {
    this.bricks = new Array(this.rows);
    for (var i=0 ; i<this.rows ; i++) {
		this.bricks[i] = new Array(this.columns);
		for (var j=0; j<this.columns ; j++) {
        	//this.bricks[i][j] = 1;
			var dur = Math.ceil(this.rows/(3*i + 2));

			this.bricks[i][j] = new Brick({durability: dur});
		}
    }

	this.brickHeight = this.height/this.rows;
	this.brickWidth = this.width/this.columns;
};

Wall.prototype.render = function (ctx) {
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
			var brick = this.bricks[i][j];
            //draw this brick
            brick.renderAt(ctx, this.leftX + j*this.brickWidth,
                                this.topY + i*this.brickHeight,
                                this.brickWidth,
                                this.brickHeight,
						   		this.colour);
    	}
	}
};

Wall.prototype.detectCollision = function (prevX, prevY, nextX, nextY, r) {
	if (nextY < this.topY || nextY > this.topY + this.height) {
		return;
	}

	var brickRow = this.getBrickRow(nextY);
	var brickColumn = this.getBrickColumn(nextX);

	if (this.bricks[brickRow][brickColumn] &&
		this.bricks[brickRow][brickColumn].durability) {
		this.bricks[brickRow][brickColumn].takeHit();

		// determine if side or top collision
		var prevBrickRow = this.getBrickRow(prevY);
		var prevBrickColumn = this.getBrickColumn(prevX);

		var pwrUpSpawnSeed = Math.random()

		if (this.bricks[brickRow][brickColumn].durability === 0) {
			this.bricksToGo--;

			if (this.bricksToGo === 0) {
				finishGame(true);
			}

			if (pwrUpSpawnSeed < 0.5) {
				spawnPowerUpAt(nextX, nextY);
			}
		}

		if (prevBrickRow === brickRow) {
			return "side";
		} else {
			return "bottom";
		}
	}
};

Wall.prototype.getBrickRow = function (y) {
	return Math.floor((y - this.topY)/this.brickHeight);
}

Wall.prototype.getBrickColumn = function (x) {
	return Math.floor((x - this.leftX)/this.brickWidth);
}

function drawBrickAt(ctx, x, y, width, height, style) {
    fillBox(ctx, x, y, width, height, style);
    ctx.rect(x, y, width, height);
    ctx.stroke();
}

// -----------
// Brick stuff
// -----------

// A generic constructor which accepts an arbitrary descriptor object
function Brick(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }

	this.getColour();
}

Brick.prototype.renderAt = function (ctx, x, y, width, height) {
	if (this.durability === 0) return;
    fillBox(ctx, x, y, width, height, this.colour);
    ctx.rect(x, y, width, height);
    ctx.stroke();
};

Brick.prototype.takeHit = function () {
	this.durability -= 1;

	if (this.durability === 0) {
		scorePoint(10);
	}

	this.getColour();
};

Brick.prototype.getColour = function() {
	if (this.durability === 1) {
		this.colour = "green";
	} else if (this.durability === 2) {
		this.colour = "white";
	} else {
		this.colour = "#555555";
	}
};
