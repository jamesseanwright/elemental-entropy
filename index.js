'use strict';

/* The JS1K guys have made life easier by providing
 * the following shim:
 * - a - a canvas element
 * - b - the body
 * - c - a's 2D context
 * - g - a's 3D context */

var PI = Math.PI;
var PLAYER_X = a.width / 2;
var PLAYER_Y = a.height / 2;
var PLAYER_RADIUS = 75;

var isGameRunning = true;

var shield = {
	init: function () {
		this.rotation = 0;
		this.radianModifier = 1;
		this.radius = PLAYER_RADIUS + 10;
		this.stroke = 'white';

		a.addEventListener('mousemove', function (e) { 
			this.rotate(e);
		}.bind(this));
	},
	
	rotate: function (e) {
		var centre = a.width / 2;
		this.rotation = (PI - ((e.clientX - centre) / PI)) / 100;
	},

	render: function () {
		var rotation = this.getRotation();

		c.strokeStyle = this.stroke;
		c.beginPath();
		c.arc(PLAYER_X, PLAYER_Y, this.radius, rotation.start, rotation.end);
		c.stroke();
	},

	getRotation: function () {
		return {
			start: (PI + this.radianModifier) - this.rotation,
			end: (PI + PI) - this.radianModifier - this.rotation,
		};
	}
};

function Particle(options) {
	options = options || {};
	this.radius = options.radius || Particle.getRadius();
	this.x = options.x || 0;
	this.y = options.y || 0;
	this.speed = 5;
}

Particle.generationFrequencyMs = 1500;
Particle.instances = [];
Particle.fill = 'blue';
Particle.blur = 100;

Particle.getRadius = function () {
	return 50;
};

Particle.create = function (options) {
	Particle.instances.push(new Particle(options));
};

Particle.next = function () {
	for (var i in Particle.instances) {
		var instance = Particle.instances[i];
		instance.render();

		if (particle.isMovable) particle(particle)
		
		collider.detect(particle);
	}
};

Particle.prototype.render = function () {
	c.fillStyle = Particle.fill;
	c.shadowColor = Particle.fill;
	c.shadowBlur = Particle.blur;
	c.beginPath();
	c.arc(this.x, this.y, this.radius, 0, PI * 2);
	c.fill();
	c.closePath();
};

function move(particle) {
	particle.x = particle.isFromLeft ? particle.x + particle.speed : particle.x - particle.speed;
}

var collider = {
	setTarget: function (target) {
		this.target = target;
	},

	detect: function (particle) {
		var target = this.target;
		var isHit = particle.isFromLeft
					? particle.x + particle.width >= target.x
					: particle.x <= target.x + target.width;

		if (isHit) {
			target.isActive = false;
			target.onHit && target.onHit();
		}
	}
}

var generator = {
	events: [],

	register: function(Event) {
		Event.lastGenerationTime = Date.now();
		this.events.push(Event);
	},

	next: function () {
		for (var i in this.events) {
			var Event = this.events[i];

			var freqSurpassed = Date.now() - Event.lastGenerationTime >= Event.generationFrequencyMs;
			
			if (freqSurpassed) {
				Event.create();
				Event.lastGenerationTime = Date.now();
			}
		}
	}
};

shield.init();

var player = new Particle({
	radius: PLAYER_RADIUS,
	x: PLAYER_X,
	y: PLAYER_Y,
	onHit: gameOver
});

collider.setTarget(player);

loop();

function gameOver() {
	isGameRunning = false;
}

function loop() {
	if (!isGameRunning) return;

	c.clearRect(0, 0, a.width, a.height);
	c.fillStyle = 'black';
	c.fillRect(0, 0, a.width, a.height);

	shield.render();
	Particle.next();

	requestAnimationFrame(loop);
}