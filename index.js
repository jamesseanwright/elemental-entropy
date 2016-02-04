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
		this.y = a.width / 2;
		this.radius = 50;

		a.addEventListener('mousemove', this.rotate.bind(this, e));
		this.render();
	},
	
	rotate: function (e) {
		this.rotation = this.x - e.clientX / 50;
		this.render();
	},

	render: function () {
		c.clearRect(
			this.x - this.radius,
			this.y - this.radius,
			this.x + this.radius,
			this.y + this.radius
		);

		c.strokeStyle = 'white';
		c.beginPath();
		c.arc(this.x, this.y, this.radius, PI - this.rotation, (PI + PI) - this.rotation);
		c.stroke();
	}
};

shield.render = requestAnimationFrame(shield.render);
shield.init();

drawFire();

function drawFire() {
	c.fillStyle = 'red';
	c.fillRect(100, 100, 50, 50);
}
