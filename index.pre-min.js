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
	x: 400,
	y: 240,
	angle: 0,
	radius: 75,
	isTarget: true,
	
	detectCollision: function (collidable) {
		return detectRadialCollision(this, collidable) && (Math.atan2(collidable.y - (240), collidable.x - (800 / 2)) >= (this.angle - Math.PI / 4) && Math.atan2(collidable.y - (240), collidable.x - (800 / 2)) <= (this.angle + Math.PI / 4));
	},

	onHit: function (collidable) {
		collidable.isReversing = true;
		collidable.xSpeed = collidable.xSpeed * -1; // much easier than Math.abs and -() :D
		collidable.ySpeed = collidable.ySpeed * -1;

		score += 10;
		if (score % 100 === 0) level++;
	}
};

var particles = [];
var lastGeneration = 0;
var fills = {
	player: '#00f',
	other: ['#f60', '#088']
};

var collisionTargets = [];

var createParticle = function (options) {
	options = options || {};

	var isRandomX = !(Math.random() + 0.5|0);
	var radius = options.radius || 25;
	var x = options.x || (isRandomX ? Math.random() * 800 : (!(Math.random() + 0.5|0) ? 0 - radius : 800 + radius));
	var y = options.y || (isRandomX ? (!(Math.random() + 0.5|0) ? 0 - radius : 480 + radius) : (!(Math.random() + 0.5|0) ? (480 / 6) - Math.random() * (480 / 6) : 480 - ((480 / 6) - Math.random() * (480 / 6))));
	var xSpeed = 5 * (((400) - x) / (400));
	var ySpeed = (5 * (((240) - y) / (240))) * (240 / 400);

	var particle = {
		isPlayer: options.isPlayer,
		isTarget: options.isPlayer,
		x: x,
		y: y,
		xSpeed: options.isPlayer ? 0 : xSpeed,
		ySpeed: options.isPlayer ? 0 : ySpeed,
		radius: radius,
		fill: options.isPlayer ? fills.player : fills.other[(Math.random() * fills.other.length)|0], // bitshift floor
		onHit: options.onHit,
		detectCollision: options.detectCollision,
        
		detectCleanup: function () {
			return this.x > 800 + this.radius + 1
								|| this.x < 0 - (this.radius + 1)
								|| this.y > 480 + this.radius + 1
								|| this.y < 0 - (this.radius + 1);
		}
	};

	if (options.isPlayer) collisionTargets.push(particle);
	particles.push(particle);
};

a.onmousemove = function (e) {
	if (e.clientX > 100 && e.clientX < 700) shield.angle = (Math.PI * 2) * ((e.clientX - 800) / 800) + Math.PI;
};

collisionTargets.push(shield);

createParticle({
	isPlayer: true,
	radius: 45,
	x: 400,
	y: 240,
	onHit: function () {
		this.cleanup = true;
		isGameActive = false;
	},
	detectCollision: function (collidable) {
		return detectRadialCollision(this, collidable);
	}
});

var detectRadialCollision = function (p1, p2) {	
	return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y)) < p1.radius + p2.radius;
}

loop();

var loop = function(ts) {
	c.fillStyle = '#000';
	c.fillRect(0, 0, 800, 480);

	// Particle.next
	particles = particles.filter(function (p) { 
		return !p.cleanup;
	});

	if (ts - lastGeneration >= 1500 - (100 * level)) {
		createParticle();
		lastGeneration = ts;
	}

	for (var i in particles) {
        // Particle.prototype.render
        c.fillStyle = particles[i].fill;
        c.shadowColor = particles[i].fill;
        c.shadowBlur = 100;
        c.beginPath();
        c.arc(particles[i].x, particles[i].y, particles[i].radius, 0, Math.PI * 2);
        c.fill();

		if (!particles[i].isTarget) {
			// Particle.prototype.move
            particles[i].x += particles[i].xSpeed;
			particles[i].y += particles[i].ySpeed;
            
			particles[i].cleanup = particles[i].detectCleanup();
		}

		// collider.detect
		if (!particles[i].isTarget && !particles[i].isReversing && isGameActive) {

			for (var j in collisionTargets) {
				!collisionTargets[j].cleanup && collisionTargets[j].detectCollision(particles[i]) && collisionTargets[j].onHit(particles[i]);
			}
		}
	}

	// shield.render()
	c.strokeStyle = '#fff';
	c.beginPath();
	c.arc(shield.x, shield.y, shield.radius, (shield.angle - Math.PI / 4), (shield.angle + Math.PI / 4));
	c.stroke();
	
	c.fillStyle = '#fff';
	c.font = '26px Arial';
	c.fillText(score, 20, 40);

	if (!isGameActive) c.fillText('BOOM', 360, 240);

	requestAnimationFrame(loop);
}