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
		this.radianModifier = 0.6;
		this.radius = 80;
		this.stroke = 'white';

		a.addEventListener('mousemove', function (e) { 
			this.rotate(e);
		}.bind(this));
	},
	
	rotate: function (e) {
		var centre = a.width / 2;

		this.rotation = (PI - ((e.clientX - centre) / PI)) / 100;
		console.log(this.rotation);
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
		this.y = (a.height - a.height / 2) - this.height / 2;
		this.fill = 'red';
	},

	render: function () {
		c.beginPath();
		c.moveTo(this.x, this.y + this.height);
		c.lineTo(this.x + this.width / 2, this.y);
		c.lineTo(this.x + this.width, this.y + this.height);
		c.lineTo(this.x, this.y + this.height);
		c.fillStyle = this.fill;
		c.fill();
		c.closePath();
	}
}

shield.init();
fire.init();

loop();

function loop() {
	c.clearRect(0, 0, a.width, a.height);
	c.fillStyle = 'black';
	c.fillRect(0, 0, a.width, a.height);

	shield.render();
	fire.render();

	requestAnimationFrame(loop);
}