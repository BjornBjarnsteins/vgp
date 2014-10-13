// ============
// SPRITE STUFF
// ============

// Construct a "sprite" from the given `image`
//
function Sprite(imageSrc) {
	this.image = new Image();
	this.image.src = imageSrc;
}

Sprite.prototype.drawCentredAt = function (ctx, cx, cy, rotation) {

    // This is how to implement default parameters...
    if (rotation === undefined) rotation = 0;

    var upperX = cx-this.image.width/2;
    var upperY = cy-this.image.height/2;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.translate(-cx, -cy);
    ctx.drawImage(this.image, upperX, upperY);
    ctx.restore();
};
