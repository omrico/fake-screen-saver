(function() {
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let columns = [];
  let fontSize = 16;
  let columnCount = 0;
  let frameCount = 0;
  let frameSkip = 2;

  const speedSettings = {
    'very-slow': 6,
    'slow': 4,
    'medium': 2,
    'fast': 1,
    'very-fast': 0
  };

  function init(canvas, ctx, config) {
    fontSize = 16;
    columnCount = Math.floor(canvas.width / fontSize);
    columns = [];
    frameCount = 0;
    
    const speed = config.matrixSpeed || 'slow';
    frameSkip = speedSettings[speed] ?? 2;
    
    for (let i = 0; i < columnCount; i++) {
      columns[i] = Math.floor(Math.random() * -50);
    }
  }

  function draw(ctx, canvas) {
    frameCount++;
    
    if (frameSkip > 0 && frameCount % (frameSkip + 1) !== 0) {
      return;
    }

    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0f0';
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < columnCount; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = columns[i] * fontSize;

      ctx.fillStyle = '#0f0';
      ctx.fillText(char, x, y);

      ctx.fillStyle = '#fff';
      ctx.fillText(char, x, y);
      ctx.fillStyle = '#0f0';
      ctx.fillText(char, x, y);

      if (y > canvas.height && Math.random() > 0.975) {
        columns[i] = 0;
      }
      
      columns[i]++;
    }
  }

  window.FakeScreenSaverModules = window.FakeScreenSaverModules || {};
  window.FakeScreenSaverModules['matrix'] = { init, draw };
})();
