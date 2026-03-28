(function() {
  let particles = [];
  const particleCount = 500;
  let time = 0;
  const gridSize = 20;
  let cols, rows;

  function noise(x, y, z) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;
    
    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);
    
    const u = fade(x);
    const v = fade(y);
    const w = fade(z);
    
    const seed = X * 374761393 + Y * 668265263 + Z * 1274126177;
    return (Math.sin(seed) * 43758.5453) % 1;
  }

  function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  class Particle {
    constructor(canvas) {
      this.reset(canvas);
      this.history = [];
      this.maxHistory = 30;
    }

    reset(canvas) {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = 0;
      this.vy = 0;
      this.history = [];
    }

    update(canvas) {
      const scale = 0.005;
      const angle = noise(this.x * scale, this.y * scale, time) * Math.PI * 4;
      
      this.vx = Math.cos(angle) * 0.5;
      this.vy = Math.sin(angle) * 0.5;
      
      this.history.push({ x: this.x, y: this.y });
      if (this.history.length > this.maxHistory) {
        this.history.shift();
      }

      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width || 
          this.y < 0 || this.y > canvas.height) {
        this.reset(canvas);
      }
    }

    draw(ctx) {
      if (this.history.length < 2) return;

      for (let i = 0; i < this.history.length - 1; i++) {
        const alpha = i / this.history.length;
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        const hue = (speed * 100 + time * 10) % 360;
        
        ctx.beginPath();
        ctx.moveTo(this.history[i].x, this.history[i].y);
        ctx.lineTo(this.history[i + 1].x, this.history[i + 1].y);
        ctx.strokeStyle = `hsla(${hue}, 70%, 60%, ${alpha * 0.3})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  function init(canvas, ctx, config) {
    particles = [];
    time = 0;
    cols = Math.floor(canvas.width / gridSize);
    rows = Math.floor(canvas.height / gridSize);
    
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas));
    }
  }

  function draw(ctx, canvas) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    time += 0.003;

    for (const particle of particles) {
      particle.update(canvas);
      particle.draw(ctx);
    }
  }

  window.FakeScreenSaverModules = window.FakeScreenSaverModules || {};
  window.FakeScreenSaverModules['flow-field'] = { init, draw };
})();
