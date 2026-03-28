(function() {
  let particles = [];
  const particleCount = 120;
  const connectionDistance = 150;

  class Particle {
    constructor(canvas) {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = 2;
    }

    update(canvas) {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width) {
        this.vx *= -1;
        this.x = Math.max(0, Math.min(canvas.width, this.x));
      }
      if (this.y < 0 || this.y > canvas.height) {
        this.vy *= -1;
        this.y = Math.max(0, Math.min(canvas.height, this.y));
      }
    }

    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(100, 200, 255, 0.8)';
      ctx.fill();
    }
  }

  function init(canvas, ctx, config) {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas));
    }
  }

  function draw(ctx, canvas) {
    ctx.fillStyle = 'rgba(10, 10, 20, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update(canvas);
      particles[i].draw(ctx);

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          const opacity = 1 - distance / connectionDistance;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(100, 200, 255, ${opacity * 0.5})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  window.FakeScreenSaverModules = window.FakeScreenSaverModules || {};
  window.FakeScreenSaverModules['plexus'] = { init, draw };
})();
