(function() {
  let pipes = [];
  let pixelCount = 0;
  let totalPixels = 0;
  let currentColor;

  const directions = [
    { dx: 1, dy: 0, angle: 0 },     // East
    { dx: 0, dy: 1, angle: 90 },    // South
    { dx: -1, dy: 0, angle: 180 },  // West
    { dx: 0, dy: -1, angle: 270 }   // North
  ];

  const colors = [
    '#4A90E2', // Blue
    '#50C878', // Green
    '#E94B3C', // Red
    '#F39C12', // Orange
    '#9B59B6', // Purple
    '#1ABC9C', // Turquoise
  ];

  class Pipe {
    constructor(canvas) {
      this.x = canvas.width / 2;
      this.y = canvas.height / 2;
      this.width = 20;
      this.directionIndex = Math.floor(Math.random() * 4);
      this.segmentLength = 0;
      this.maxSegmentLength = 50 + Math.random() * 100;
    }

    update(canvas) {
      if (this.segmentLength >= this.maxSegmentLength || 
          Math.random() < 0.02 || 
          this.nearEdge(canvas)) {
        
        const oldDir = this.directionIndex;
        do {
          this.directionIndex = Math.floor(Math.random() * 4);
        } while (this.directionIndex === (oldDir + 2) % 4);
        
        this.segmentLength = 0;
        this.maxSegmentLength = 50 + Math.random() * 100;
      }

      const dir = directions[this.directionIndex];
      this.x += dir.dx * 2;
      this.y += dir.dy * 2;
      this.segmentLength += 2;

      if (this.x < -this.width) this.x = canvas.width + this.width;
      if (this.x > canvas.width + this.width) this.x = -this.width;
      if (this.y < -this.width) this.y = canvas.height + this.width;
      if (this.y > canvas.height + this.width) this.y = -this.width;
    }

    nearEdge(canvas) {
      const margin = 100;
      return this.x < margin || 
             this.x > canvas.width - margin || 
             this.y < margin || 
             this.y > canvas.height - margin;
    }

    draw(ctx) {
      const dir = directions[this.directionIndex];
      
      if (dir.dx !== 0) {
        const gradient = ctx.createLinearGradient(
          this.x, this.y - this.width/2,
          this.x, this.y + this.width/2
        );
        gradient.addColorStop(0, '#333');
        gradient.addColorStop(0.3, currentColor);
        gradient.addColorStop(0.5, '#fff');
        gradient.addColorStop(0.7, currentColor);
        gradient.addColorStop(1, '#111');

        ctx.fillStyle = gradient;
        ctx.fillRect(this.x - 2, this.y - this.width/2, 4, this.width);
        
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x - 2, this.y - this.width/2, 4, this.width);
      } else {
        const gradient = ctx.createLinearGradient(
          this.x - this.width/2, this.y,
          this.x + this.width/2, this.y
        );
        gradient.addColorStop(0, '#333');
        gradient.addColorStop(0.3, currentColor);
        gradient.addColorStop(0.5, '#fff');
        gradient.addColorStop(0.7, currentColor);
        gradient.addColorStop(1, '#111');

        ctx.fillStyle = gradient;
        ctx.fillRect(this.x - this.width/2, this.y - 2, this.width, 4);
        
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x - this.width/2, this.y - 2, this.width, 4);
      }
      
      pixelCount += 4;
    }
  }

  function init(canvas, ctx, config) {
    pipes = [];
    pixelCount = 0;
    totalPixels = canvas.width * canvas.height;
    currentColor = colors[Math.floor(Math.random() * colors.length)];
    
    for (let i = 0; i < 3; i++) {
      pipes.push(new Pipe(canvas));
    }
    
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function draw(ctx, canvas) {
    if (pixelCount > totalPixels * 0.6) {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      pixelCount = 0;
      currentColor = colors[Math.floor(Math.random() * colors.length)];
      
      pipes = [];
      for (let i = 0; i < 3; i++) {
        pipes.push(new Pipe(canvas));
      }
    }

    for (const pipe of pipes) {
      pipe.update(canvas);
      pipe.draw(ctx);
    }
  }

  window.FakeScreenSaverModules = window.FakeScreenSaverModules || {};
  window.FakeScreenSaverModules['pipes'] = { init, draw };
})();
