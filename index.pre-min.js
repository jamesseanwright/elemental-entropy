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

var ctx = new AudioContext();

var score = 0;
var level = 0;
var angle = 0;

var particles = [];
var lastGeneration = 0;
var fills = {
	player: '#00f',
	other: ['#f60', '#088']
};

var createParticle = function (options) {
	options = options || {};

	var isRandomX = !(Math.random() + 0.5 | 0);
	var radius = options.radius || 25;
	var x = options.x || (isRandomX ? Math.random() * 800 : (!(Math.random() + 0.5 | 0) ? 0 - radius : 800 + radius));
	var y = options.y || (isRandomX ? (!(Math.random() + 0.5 | 0) ? 0 - radius : 480 + radius) : (!(Math.random() + 0.5 | 0) ? (480 / 6) - Math.random() * (480 / 6) : 480 - ((480 / 6) - Math.random() * (480 / 6))));
	var xSpeed = 5 * (((400) - x) / (400));
	var ySpeed = (5 * (((240) - y) / (240))) * (240 / 400);

	var particle = {
		isPlayer: options.isPlayer,
		x: x,
		y: y,
		xSpeed: options.isPlayer ? 0 : xSpeed,
		ySpeed: options.isPlayer ? 0 : ySpeed,
		radius: radius,
		fill: options.isPlayer ? fills.player : fills.other[(Math.random() * fills.other.length) | 0], // bitshift floor
	};

	particles.push(particle);
    return particle;
};

a.onmousemove = function (e) {
	if (e.clientX > 100 && e.clientX < 700) angle = (Math.PI * 2) * ((e.clientX - 800) / 800) + Math.PI;
};

var player = createParticle({
	isPlayer: true,
	radius: 45,
	x: 400,
	y: 240
});

var loop = function (ts) {
	c.fillStyle = '#000';
	c.fillRect(0, 0, 800, 480);

	// Particle.next
	if (ts - lastGeneration >= 1500 - (100 * level)) {
		createParticle();
		lastGeneration = ts;
	}

	for (var i in particles) {
        // Particle.prototype.render
		if (particles[i]) {
			c.fillStyle = particles[i].fill;
			c.shadowColor = particles[i].fill;
			c.shadowBlur = 100;
			c.beginPath();
			c.arc(particles[i].x, particles[i].y, particles[i].radius, 0, Math.PI * 2);
			c.fill();

			if (particles[i] !== player) {
				var oscillator;
				
				// Particle.prototype.move
				particles[i].x += particles[i].xSpeed;
				particles[i].y += particles[i].ySpeed;
		
				//collider.detect (Particle)
				if (player && (Math.sqrt((player.x - particles[i].x) * (player.x - particles[i].x) + (player.y - particles[i].y) * (player.y - particles[i].y)) < player.radius + particles[i].radius)) {
					player = particles[particles.indexOf(player)] = undefined;
					
					oscillator = ctx.createOscillator();
					oscillator.frequency.value = 150;
					oscillator.connect(ctx.destination);
					oscillator.start(ctx.currentTime);
					oscillator.stop(ctx.currentTime + 2);			
				}

				// collider.detect (shield)
				if (player && !particles[i].isReversing && (Math.sqrt((400 - particles[i].x) * (400 - particles[i].x) + (240 - particles[i].y) * (240 - particles[i].y)) < 75 + particles[i].radius) && (Math.atan2(particles[i].y - (240), particles[i].x - (800 / 2)) >= (angle - Math.PI / 4) && Math.atan2(particles[i].y - (240), particles[i].x - (800 / 2)) <= (angle + Math.PI / 4))) {
					particles[i].isReversing = true;
					particles[i].xSpeed = particles[i].xSpeed * -1; // much easier than Math.abs and -() :D
					particles[i].ySpeed = particles[i].ySpeed * -1;

					score += 10;
					if (score % 100 === 0) level++;
					
					oscillator = ctx.createOscillator();
					oscillator.frequency.value = 190;
					oscillator.connect(ctx.destination);
					oscillator.start(ctx.currentTime);
					oscillator.stop(ctx.currentTime + 0.1);
				}
				
				if (particles[i].x > 800 + particles[i].radius + 1 || particles[i].x < 0 - (particles[i].radius + 1) || particles[i].y > 480 + particles[i].radius + 1 || particles[i].y < 0 - (particles[i].radius + 1)) {
					particles[i] = undefined;
				}
			}
		}
	}

	// shield.render()
	c.strokeStyle = '#fff';
	c.beginPath();
	c.arc(400, 240, 75, (angle - Math.PI / 4), (angle + Math.PI / 4));
	c.stroke();

	c.fillStyle = '#fff';
	c.font = '26px Arial';
	c.fillText(score, 20, 40);

	requestAnimationFrame(loop);
};

loop();