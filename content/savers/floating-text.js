(function() {
  let x, y, dx, dy;
  let text = 'Hello World';
  let textColor = '#00ff88';
  let bgColor = '#1a1a2e';
  let fontSize = 48;
  let textWidth = 0;

  function init(canvas, ctx, config) {
    if (config.floatingText) {
      text = config.floatingText.text || 'Hello World';
      textColor = config.floatingText.textColor || '#00ff88';
      bgColor = config.floatingText.bgColor || '#1a1a2e';
    }

    ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    textWidth = ctx.measureText(text).width;

    x = Math.random() * (canvas.width - textWidth);
    y = Math.random() * (canvas.height - fontSize) + fontSize;
    
    dx = 2 + Math.random() * 2;
    dy = 2 + Math.random() * 2;
    
    if (Math.random() > 0.5) dx = -dx;
    if (Math.random() > 0.5) dy = -dy;
  }

  function draw(ctx, canvas) {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    x += dx;
    y += dy;

    if (x <= 0 || x + textWidth >= canvas.width) {
      dx = -dx;
      x = Math.max(0, Math.min(x, canvas.width - textWidth));
    }

    if (y - fontSize <= 0 || y >= canvas.height) {
      dy = -dy;
      y = Math.max(fontSize, Math.min(y, canvas.height));
    }

    ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillStyle = textColor;
    ctx.shadowColor = textColor;
    ctx.shadowBlur = 10;
    ctx.fillText(text, x, y);
    ctx.shadowBlur = 0;
  }

  window.FakeScreenSaverModules = window.FakeScreenSaverModules || {};
  window.FakeScreenSaverModules['floating-text'] = { init, draw };
})();
