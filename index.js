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

var PI = Math.PI;
var PLAYER_X = a.width / 2;
var PLAYER_Y = a.height / 2;
var PLAYER_RADIUS = 45;

var shield = {
	init: function () {
		this.x = PLAYER_X;
		this.y = PLAYER_Y;
		this.angle = 0;
		this.radialModifier = 1;
		this.radius = PLAYER_RADIUS + 30;
		this.stroke = 'white';

		a.addEventListener('mousemove', function (e) { 
			this.rotate(e);
		}.bind(this));
	},
	
	rotate: function (e) {
		var distanceFromX = a.width - e.clientX;
		this.angle = (PI * 2) * (distanceFromX / a.width);
	},

	render: function () {
		var angles = this.getAngles();

		c.strokeStyle = this.stroke;
		c.beginPath();
		c.arc(this.x, this.y, this.radius, angles.start, angles.end, true);
		c.stroke();
	},

	getAngles: function () {
		return {
			start: this.radialModifier - this.angle,
			end: PI + (this.radialModifier - this.angle)
		};
	},

	detectCollision: function (collidable) {
		var shieldAngles;
		var collidableAngle;

		return detectRadialCollision(this, collidable);
		
		if (!detectRadialCollision(this, collidable)) return false;
		shieldAngles = this.getAngles();
		collidableAngle = Math.atan2(PLAYER_X - collidable.x, PLAYER_Y - collidable.y);
		return collidableAngle >= shieldAngles.start && collidableAngle <= shieldAngles.end;
	},

	onHit: function (collidable) {
		var xSpeed = collidable.xSpeed;
		var ySpeed = collidable.ySpeed;

		collidable.isReversing = true;

		collidable.xSpeed = xSpeed > 0 ? -(xSpeed) : Math.abs(xSpeed);
		collidable.ySpeed = ySpeed > 0 ? -(ySpeed) : Math.abs(ySpeed);
	}
};

function Particle(options) {
	options = options || {};
	this.isPlayer = options.isPlayer;
	this.radius = options.radius || Particle.generateRadius();
	this.fill = Particle.generateFill(this.isPlayer);
	this.onHit = options.onHit;
	this.detectCollision = options.detectCollision;

	this.setPos(options);
	this.setSpeed();

	if (this.isPlayer) collider.addTarget(this);
}

Particle.baseRadius = 30;
Particle.generationFrequencyMs = 1500;
Particle.lastGeneration = Date.now() - Particle.generationFrequencyMs;
Particle.instances = [];
Particle.blur = 100;

Particle.fills = {
	player: 'blue',
	other: ['orange', '#008080']
};

Particle.generateRadius = function () {
	return Particle.baseRadius - (Math.ceil(Math.random() * Particle.baseRadius) / 2);
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
	var shouldGenerate = now - Particle.lastGeneration >= Particle.generationFrequencyMs;

	if (shouldGenerate) {
		Particle.create();
		Particle.lastGeneration = now;
	}
};

Particle.prototype.render = function () {
	c.fillStyle = this.fill;
	c.shadowColor = this.fill;
	c.shadowBlur = Particle.blur;
	c.beginPath();
	c.arc(this.x, this.y, this.radius, 0, PI * 2);
	c.fill();
	c.closePath();
};

Particle.prototype.setSpeed = function () {
	var distanceFromX = PLAYER_X - this.x;
	var distanceFromY = PLAYER_Y - this.y;
	var aspectRatio =  a.height / a.width;
	var speed = 3;

	this.xSpeed = speed * (distanceFromX / PLAYER_X);
	this.ySpeed = (speed * (distanceFromY / PLAYER_Y)) * aspectRatio;
};

Particle.prototype.setPos = function (options) {
	var isX;
	var hasCustomPos = options.x && options.y;

	if (hasCustomPos) {
		this.x = options.x;
		this.y = options.y;
		return;
	}

	isX = Math.round(Math.random()) === 0;

	if (isX) {
		this.x = Math.random() * a.width;
		this.y = this.getStartPos(a.width);
	} else {
		this.y = Math.random() * a.height;
		this.x = this.getStartPos(a.width);
	}
};

Particle.prototype.getStartPos = function (length) {
	var fromZero = Math.round(Math.random()) === 0;

	return fromZero ? 0 - this.radius : length + this.radius;
};

Particle.prototype.move = function () {
	this.x += this.xSpeed;
	this.y += this.ySpeed;
};

Particle.prototype.detectCleanup = function () {
	var boundBuffer = 1;
	var isOutOfBounds = this.x > a.width + this.radius + boundBuffer
						|| this.x < 0 - (this.radius + boundBuffer)
						|| this.y > a.height + this.radius + boundBuffer
						|| this.y < 0 - (this.radius + boundBuffer);

	return isOutOfBounds;
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
		if (collidable.isTarget || collidable.isReversing) return;

		for (var i in this.targets) {
			var target = this.targets[i];
			var isHit = target.detectCollision(collidable)

			if (isHit && target.onHit) target.onHit(collidable);
		}
	}
};

shield.init();
collider.addTarget(shield);

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

function detectRadialCollision(p1, p2) {
	var distanceX = p1.x - p2.x;
	var distanceY = p1.y - p2.y;
	var distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
	
	return distance < p1.radius + p2.radius;
}

loop();

function gameOver() {
	this.cleanup = true;
	collider.removeTarget(this);
}

function loop() {
	c.clearRect(0, 0, a.width, a.height);
	c.fillStyle = 'black';
	c.fillRect(0, 0, a.width, a.height);

	Particle.next();
	shield.render();

	requestAnimationFrame(loop);
}