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

		a.addEventListener('mousemove', function (e) { 
			this.rotate(e);
		}.bind(this));
	},
	
	rotate: function (e) {
		this.rotation = PI - (e.clientX / PI);
	},

	render: function () {
		var rotation = this.getRotation();

		c.strokeStyle = 'white';
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

shield.init();

loop();

function loop() {
	c.clearRect(0, 0, a.width, a.height);
	c.fillStyle = 'black';
	c.fillRect(0, 0, a.width, a.height);

	shield.render();

	requestAnimationFrame(loop);
}