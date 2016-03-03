/* This software is protected by version 2 of
 * the Apache License. If you fork and modify it,
 * please attribute me as the author of the original
 * project. You can of course protect your own modifications
 * as and how you please. http://www.apache.org/licenses/LICENSE-2.0.txt

 * The JS1K guys have made life easier by providing
 * the following shim:
 * - a - a canvas element
 * - b - the body
 * - c - a's 2D context
 * - g - a's 3D context */

var PLAYER_X = a.width / 2;
var PLAYER_Y = a.height / 2;
var PLAYER_RADIUS = 45;
var LEVEL_INCREASE_THRESHOLD = 100;
var HIT_SCORE = 10;
var H_PADDING = 100;

var score = 0;
var level = 0;
var isGameActive = true;

var shield = {
	init: function () {
		this.x = PLAYER_X;
		this.y = PLAYER_Y;
		this.angle = 0;
		this.radius = PLAYER_RADIUS + 30;

		a.addEventListener('mousemove', function (e) {
			// hax for RegPack :(
			(e.clientX > H_PADDING && e.clientX < a.width - H_PADDING) && shield.rotate(e);
		});
	},
	
	rotate: function (e) {
		var distanceFromX = e.clientX - a.width;
		this.angle = (Math.PI * 2) * (distanceFromX / a.width) + Math.PI;
	},

	render: function () {
		var angles = this.getAngles();

		c.strokeStyle = 'white';
		c.beginPath();
		c.arc(this.x, this.y, this.radius, angles.start, angles.end);
		c.stroke();
	},

	getAngles: function () {
		return {
			start: this.angle - Math.PI / 4,
			end: this.angle + Math.PI / 4
		};
	},

	detectCollision: function (collidable) {
		var shieldAngles;
		var collidableAngle;

		if (!detectRadialCollision(this, collidable)) return false;
		
		shieldAngles = this.getAngles();
		collidableAngle = Math.atan2(collidable.y - PLAYER_Y, collidable.x - PLAYER_X);
		return collidableAngle >= shieldAngles.start && collidableAngle <= shieldAngles.end;
	},

	onHit: function (collidable) {
		var xSpeed = collidable.xSpeed;
		var ySpeed = collidable.ySpeed;

		collidable.isReversing = true;

		collidable.xSpeed = xSpeed > 0 ? -(xSpeed) : Math.abs(xSpeed);
		collidable.ySpeed = ySpeed > 0 ? -(ySpeed) : Math.abs(ySpeed);

		onScore();
	}
};

var Particle = function(options) {
	options = options || {};
	this.isPlayer = options.isPlayer;
	this.radius = options.radius || Particle.RADIUS;
	this.fill = Particle.generateFill(this.isPlayer);
	this.onHit = options.onHit;
	this.detectCollision = options.detectCollision;

	this.setPos(options);
	this.setSpeed();

	if (this.isPlayer) collider.addTarget.call(collider, this); // l33t h4x for Closure Compiler
}

Particle.SPEED = 5;
Particle.RADIUS = 25;
Particle.GENERATION_FREQUENCY_MS = 1500;
Particle.BLUR = 100;
Particle.GEN_DEDUCTION_MS = 100;

Particle.instances = [];
Particle.lastGeneration = Date.now() - Particle.GENERATION_FREQUENCY_MS;

Particle.fills = {
	player: 'blue',
	other: ['orange', '#008080']
};

Particle.generateFill = function (isPlayer) {
	var other = Particle.fills.other;

	return isPlayer 
		? Particle.fills.player
		: other[Math.floor(Math.random() * other.length)];
};

Particle.generatePos = function (length) {
	return Math.random() * length;
};

Particle.create = function (options) {
	Particle.instances.push(new Particle(options));
};

Particle.next = function () {
	Particle.cleanup();
	Particle.tryGenerate();

	for (var i in Particle.instances) {
		var particle = Particle.instances[i];
		particle.render();

		if (!particle.isTarget) {
			particle.move();
			particle.cleanup = particle.detectCleanup();
		}

		collider.detect(particle);
	}
};

Particle.cleanup = function () {
	Particle.instances = Particle.instances.filter(function (p) { 
		return !p.cleanup;
	});
};

Particle.tryGenerate = function () {
	var now = Date.now();
	var frequency = Particle.GENERATION_FREQUENCY_MS - (Particle.GEN_DEDUCTION_MS * level);

	var shouldGenerate = now - Particle.lastGeneration >= frequency;

	if (shouldGenerate) {
		Particle.create();
		Particle.lastGeneration = now;
	}
};

Particle.prototype.render = function () {
	c.fillStyle = this.fill;
	c.shadowColor = this.fill;
	c.shadowBlur = Particle.BLUR;
	c.beginPath();
	c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
	c.fill();
};

Particle.prototype.setSpeed = function () {
	this.xSpeed = Particle.SPEED * ((PLAYER_X - this.x) / PLAYER_X);
	this.ySpeed = (Particle.SPEED * ((PLAYER_Y - this.y) / PLAYER_Y)) * a.height / a.width;
};

Particle.prototype.setPos = function (options) {
	var hasCustomPos = options.x && options.y;

	if (hasCustomPos) {
		this.x = options.x;
		this.y = options.y;
		return;
	}

	if (!(Math.random() + 0.5|0)) {
		this.x = Math.random() * a.width;
		this.y = this.getStartPos(a.width);
		return;
	} 

	// nasty hack to overcome shield dead spot bug :(
	var preCentre = !(Math.random() + 0.5|0);
	var start = (a.height / 6) - Math.random() * (a.height / 6);

	this.y = preCentre ? start : a.height - start;
	this.x = this.getStartPos(a.width);
};

Particle.prototype.getStartPos = function (length) {
	return !(Math.random() + 0.5|0) ? 0 - this.radius : length + this.radius;
};

Particle.prototype.move = function () {
	this.x += this.xSpeed;
	this.y += this.ySpeed;
};

Particle.prototype.detectCleanup = function () {
	return this.x > a.width + this.radius + 1
						|| this.x < 0 - (this.radius + 1)
						|| this.y > a.height + this.radius + 1
						|| this.y < 0 - (this.radius + 1);
};

var collider = {
	targets: [],

	addTarget: function (target) {
		target.isTarget = true;
		this.targets.push(target);
	},

	removeTarget: function (target) {
		this.targets = this.targets.filter(function (t) {
			return target !== t;
		});
	},

	detect: function (collidable) {
		if (collidable.isTarget || collidable.isReversing || !isGameActive) return;

		for (var i in this.targets) {
			this.targets[i].detectCollision(collidable) && this.targets[i].onHit && this.targets[i].onHit(collidable);
		}
	}
};

shield.init();

// Closure Compiler hax
collider.addTarget.call(collider, shield);

Particle.create({
	isPlayer: true,
	radius: PLAYER_RADIUS,
	x: PLAYER_X,
	y: PLAYER_Y,
	onHit: gameOver,
	detectCollision: function (collidable) {
		return detectRadialCollision(this, collidable);
	}
});

var detectRadialCollision = function (p1, p2) {	
	return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y)) < p1.radius + p2.radius;
}

var onScore = function() {
	score += HIT_SCORE;

	if (score % LEVEL_INCREASE_THRESHOLD === 0) level++;
}

loop();

var gameOver = function() {
	this.cleanup = true;
	collider.removeTarget(this);
	isGameActive = false;
}

var loop = function() {
	c.fillStyle = 'black';
	c.fillRect(0, 0, a.width, a.height);

	Particle.next();
	shield.render();
	renderHUD();

	requestAnimationFrame(loop);
}

var renderHUD = function() {
	c.fillStyle = 'white';
	c.font = '26px Arial';
	c.fillText(score + ' - lvl ' + level, 20, 40);

	if (!isGameActive) c.fillText('GAME OVER', PLAYER_X - 80, PLAYER_Y);
}