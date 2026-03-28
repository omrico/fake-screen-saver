(function() {
  let stars = [];
  const numStars = 400;
  let centerX, centerY;
  let speed = 0.5;

  class Star {
    constructor(canvas) {
      this.reset(canvas, true);
    }

    reset(canvas, initial = false) {
      const angle = Math.random() * Math.PI * 2;
      const maxDist = Math.max(canvas.width, canvas.height) * 0.5;
      const distance = Math.random() * maxDist + 50;
      
      this.x = Math.cos(angle) * distance;
      this.y = Math.sin(angle) * distance;
      this.z = initial ? Math.random() * 1000 : 1000;
      this.pz = this.z;
    }

    update(canvas) {
      this.pz = this.z;
      this.z -= speed * 10;

      if (this.z <= 0) {
        this.reset(canvas);
      }
    }

    draw(ctx, canvas) {
      const sx = (this.x / this.z) * 500 + centerX;
      const sy = (this.y / this.z) * 500 + centerY;
      const px = (this.x / this.pz) * 500 + centerX;
      const py = (this.y / this.pz) * 500 + centerY;

      if (sx < 0 || sx > canvas.width || sy < 0 || sy > canvas.height) {
        this.reset(canvas);
        return;
      }

      const size = Math.max(0.5, (1 - this.z / 1000) * 3);
      const brightness = Math.max(0.2, 1 - this.z / 1000);

      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(sx, sy);
      ctx.strokeStyle = `rgba(255, 255, 255, ${brightness})`;
      ctx.lineWidth = size;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(sx, sy, size * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
      ctx.fill();
    }
  }

  function init(canvas, ctx, config) {
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
    stars = [];

    for (let i = 0; i < numStars; i++) {
      stars.push(new Star(canvas));
    }
  }

  function draw(ctx, canvas) {
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    speed = 0.5 + Math.sin(Date.now() / 5000) * 0.3;

    for (const star of stars) {
      star.update(canvas);
      star.draw(ctx, canvas);
    }
  }

  window.FakeScreenSaverModules = window.FakeScreenSaverModules || {};
  window.FakeScreenSaverModules['starfield'] = { init, draw };
})();
