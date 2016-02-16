'use strict';

/* The JS1K guys have made life easier by providing
 * the following shim:
 * - a - a canvas element
 * - b - the body
 * - c - a's 2D context
 * - g - a's 3D context */

var PI = Math.PI;

var shield = {
	init: function () {
		this.rotation = 0;
		this.x = a.width / 2;
		this.y = a.height / 2;
		this.radianModifier = 1;
		this.radius = 85;
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
		c.arc(this.x, this.y, this.radius, rotation.start, rotation.end);
		c.stroke();
	},

	getRotation: function () {
		return {
			start: (PI + this.radianModifier) - this.rotation,
			end: (PI + PI) - this.radianModifier - this.rotation,
		};
	}
};

var fire = {
	init: function () {
		this.width = 90;
		this.height = 80;
		this.x = a.width / 2 - this.width / 2;
		this.y = a.height / 2 - this.height / 2;
		this.fill = 'red';
		this.blur = 50;
		this.isActive = true;
	},

	render: function () {
		if (!this.isActive) return;

		c.beginPath();
		c.moveTo(this.x, this.y + this.height);
		c.lineTo(this.x + this.width / 2, this.y);
		c.lineTo(this.x + this.width, this.y + this.height);
		c.lineTo(this.x, this.y + this.height);
		c.fillStyle = this.fill;
		c.shadowColor = this.fill;
		c.shadowBlur = this.blur;
		c.fill();
		c.closePath();
	}
}

function Wind() {
	this.width = Wind.width;
	this.isFromLeft = Wind.getDirection();
	this.x = this.isFromLeft ? 0 - Wind.width : a.width;
	this.speed = 5;
	
	mover.register(this);
}

Wind.generationFrequencyMs = 1500;
Wind.instances = [];
Wind.numLines = 3;
Wind.lineSpacing = 5;
Wind.width = 50;
Wind.y = a.height / 2 - (Wind.lineSpacing * Wind.numLines);
Wind.stroke = 'white';
Wind.blur = 100;

Wind.getDirection = function () {
	// TODO: alternate depending upon previous direction, change frequency too
	return Math.round(Math.random()) === 0;
};

Wind.create = function () {
	Wind.instances.push(new Wind());
};

Wind.render = function () {
	for (var i in Wind.instances) {
		var instance = Wind.instances[i];
		instance.render();
	}
};

Wind.prototype.render = function () {
	c.strokeStyle = Wind.stroke;
	c.shadowColor = Wind.stroke;
	c.shadowBlur = Wind.blur;

	for (var i = 0; i < Wind.numLines; i++) {
		var vertOffset = i * Wind.lineSpacing

		c.beginPath();
		c.moveTo(this.x, Wind.y + vertOffset);
		c.lineTo(this.x + Wind.width, Wind.y + vertOffset);
		
		c.stroke();
		c.closePath();
	}
};

var mover = {
	movees: [],

	register: function (movee) {
		this.movees.push(movee);
	},

	unregister: function (movee) {
		this.movees = this.movees.filter(function (m) { return movee !== m });
	},

	next: function () {
		for (var i in this.movees) {
			var movee = this.movees[i];

			movee.x = movee.isFromLeft ? movee.x + movee.speed : movee.x - movee.speed;
			collider.detect(movee);
		}
	}
};

var collider = {
	setTarget: function (target) {
		this.target = target;
	},

	detect: function (movee) {
		var target = this.target;
		var isHit = movee.isFromLeft
					? movee.x + movee.width >= target.x
					: movee.x <= target.x + target.width;

		if (isHit) target.isActive = false;
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
fire.init();

generator.register(Wind);
collider.setTarget(fire);

loop();

function loop() {
	c.clearRect(0, 0, a.width, a.height);
	c.fillStyle = 'black';
	c.fillRect(0, 0, a.width, a.height);

	shield.render();
	fire.render();
	Wind.render();

	generator.next();
	mover.next();

	requestAnimationFrame(loop);
}