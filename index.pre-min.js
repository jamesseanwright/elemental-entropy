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

var score = 0;
var level = 0;
var isGameActive = true;

var shield = {
	init: function () {
		this.x = 400;
		this.y = 240;
		this.angle = 0;
		this.radius = 75;

		a.onmousemove = function (e) {
			// hax for RegPack :(
			(e.clientX > 100 && e.clientX < 700) && shield.r(e);
		};
	},
	
	r: function (e) {
		this.angle = (Math.PI * 2) * ((e.clientX - 800) / 800) + Math.PI;
	},

	render: function () {
		c.strokeStyle = '#fff';
		c.beginPath();
		c.arc(this.x, this.y, this.radius, this.getAngles().s, this.getAngles().e);
		c.stroke();
	},

	getAngles: function () {
		return {
			s: this.angle - Math.PI / 4,
			e: this.angle + Math.PI / 4
		};
	},

	detectCollision: function (collidable) {
		return detectRadialCollision(this, collidable) && (Math.atan2(collidable.y - (240), collidable.x - (800 / 2)) >= this.getAngles().s && Math.atan2(collidable.y - (240), collidable.x - (800 / 2)) <= this.getAngles().e);
	},

	onHit: function (collidable) {
		collidable.isReversing = true;
		collidable.xSpeed = collidable.xSpeed * -1; // much easier than Math.abs and -() :D
		collidable.ySpeed = collidable.ySpeed * -1;

		onScore();
	}
};

var particles = [];
var lastGeneration = 0;
var Particle = {};
Particle.fills = {
	player: '#00f',
	other: ['#f60', '#088']
};

Particle.generateFill = function (isPlayer) {
	return isPlayer 
		? Particle.fills.player
		: Particle.fills.other[(Math.random() * Particle.fills.other.length)|0]; // bitshift floor
};

Particle.generatePos = function (length) {
	return Math.random() * length;
};

Particle.create = function (options) {
	options = options || {};

	var isRandomX = !(Math.random() + 0.5|0);
	var radius = options.radius || 25;
	var x = options.x || isRandomX ? Math.random() * 800 : (!(Math.random() + 0.5|0) ? 0 - radius : 800 + radius);
	var y = options.y || isRandomX ? (!(Math.random() + 0.5|0) ? 0 - radius : 480 + radius) : (!(Math.random() + 0.5|0) ? (480 / 6) - Math.random() * (480 / 6) : 480 - ((480 / 6) - Math.random() * (480 / 6)));
	var xSpeed = 5 * (((400) - x) / (400));
	var ySpeed = (5 * (((240) - y) / (240))) * (240 / 400);

	var particle = {
		isPlayer: options.isPlayer,
		x: x,
		y: y,
		xSpeed: xSpeed,
		ySpeed: ySpeed,
		radius: radius,
		fill: Particle.generateFill(options.isPlayer),
		onHit: options.onHit,
		detectCollision: options.detectCollision,

		render: function () {
			c.fillStyle = this.fill;
			c.shadowColor = this.fill;
			c.shadowBlur = 100;
			c.beginPath();
			c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
			c.fill();
		},

		m: function () {
			this.x += this.xSpeed;
			this.y += this.ySpeed;
		},

		detectCleanup: function () {
			return this.x > 800 + this.radius + 1
								|| this.x < 0 - (this.radius + 1)
								|| this.y > 480 + this.radius + 1
								|| this.y < 0 - (this.radius + 1);
		}
	};

	if (options.isPlayer) collider.addTarget.call(collider, particle); // l33t h4x for Closure Compiler

	particles.push(particle);
};

Particle.cleanup = function () {
	particles = particles.filter(function (p) { 
		return !p.cleanup;
	});
};

Particle.tryGenerate = function (ts) {
	if (ts - lastGeneration >= 1500 - (100 * level)) {
		Particle.create();
		lastGeneration = ts;
	}
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
	radius: 45,
	x: (400),
	y: (240),
	onHit: gameOver,
	detectCollision: function (collidable) {
		return detectRadialCollision(this, collidable);
	}
});

var detectRadialCollision = function (p1, p2) {	
	return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y)) < p1.radius + p2.radius;
}

var onScore = function() {
	score += 10;

	if (score % 100 === 0) level++;
}

loop();

var gameOver = function() {
	this.cleanup = true;
	collider.removeTarget(this);
	isGameActive = false;
}

var loop = function(ts) {
	c.fillStyle = '#000';
	c.fillRect(0, 0, 800, 480);

	// Particle.next
	Particle.cleanup();
	Particle.tryGenerate(ts);

	for (var i in particles) {
		particles[i].render();

		if (!particles[i].isTarget) {
			particles[i].m();
			particles[i].cleanup = particles[i].detectCleanup();
		}

		collider.detect(particles[i]);
	}

	shield.render();
	
	c.fillStyle = '#fff';
	c.font = '26px Arial';
	c.fillText(score, 20, 40);

	if (!isGameActive) c.fillText('BOOM', 360, 240);

	requestAnimationFrame(loop);
}