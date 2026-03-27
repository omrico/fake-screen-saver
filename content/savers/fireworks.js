(function() {
  let fireworks = [];
  let particles = [];
  let hue = 120;

  class Firework {
    constructor(canvas) {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height;
      this.targetY = Math.random() * (canvas.height * 0.5) + 50;
      this.speed = 8 + Math.random() * 4;
      this.angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.3;
      this.vx = Math.cos(this.angle) * this.speed;
      this.vy = Math.sin(this.angle) * this.speed;
      this.hue = Math.random() * 360;
      this.alive = true;
      this.trail = [];
    }

    update() {
      this.trail.push({ x: this.x, y: this.y, alpha: 1 });
      if (this.trail.length > 10) this.trail.shift();

      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.1;

      if (this.vy >= 0 || this.y <= this.targetY) {
        this.alive = false;
      }
    }

    draw(ctx) {
      for (let i = 0; i < this.trail.length; i++) {
        const t = this.trail[i];
        const alpha = (i / this.trail.length) * 0.5;
        ctx.beginPath();
        ctx.arc(t.x, t.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, ${alpha})`;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${this.hue}, 100%, 70%)`;
      ctx.fill();
    }
  }

  class Particle {
    constructor(x, y, hue) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.hue = hue + (Math.random() - 0.5) * 30;
      this.alpha = 1;
      this.decay = 0.015 + Math.random() * 0.015;
      this.size = 2 + Math.random() * 2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.08;
      this.vx *= 0.99;
      this.alpha -= this.decay;
    }

    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, ${this.alpha})`;
      ctx.fill();
    }
  }

  function init(canvas, ctx, config) {
    fireworks = [];
    particles = [];
  }

  function draw(ctx, canvas) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (Math.random() < 0.05) {
      fireworks.push(new Firework(canvas));
    }

    for (let i = fireworks.length - 1; i >= 0; i--) {
      fireworks[i].update();
      fireworks[i].draw(ctx);

      if (!fireworks[i].alive) {
        const f = fireworks[i];
        const particleCount = 50 + Math.floor(Math.random() * 50);
        for (let j = 0; j < particleCount; j++) {
          particles.push(new Particle(f.x, f.y, f.hue));
        }
        fireworks.splice(i, 1);
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw(ctx);

      if (particles[i].alpha <= 0) {
        particles.splice(i, 1);
      }
    }
  }

  window.FakeScreenSaverModules = window.FakeScreenSaverModules || {};
  window.FakeScreenSaverModules['fireworks'] = { init, draw };
})();
