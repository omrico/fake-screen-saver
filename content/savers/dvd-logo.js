(function() {
  let x, y, dx, dy;
  let width = 150;
  let height = 75;
  let hue = 0;
  let targetHue = 0;

  const colors = [
    '#ff0000', '#ff8800', '#ffff00', '#00ff00', 
    '#00ffff', '#0088ff', '#8800ff', '#ff00ff'
  ];
  let colorIndex = 0;
  let currentColor = colors[0];

  function init(canvas, ctx, config) {
    x = Math.random() * (canvas.width - width);
    y = Math.random() * (canvas.height - height);
    dx = 2;
    dy = 2;
    colorIndex = Math.floor(Math.random() * colors.length);
    currentColor = colors[colorIndex];
  }

  function draw(ctx, canvas) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    x += dx;
    y += dy;

    let bounced = false;

    if (x <= 0) {
      x = 0;
      dx = -dx;
      bounced = true;
    } else if (x + width >= canvas.width) {
      x = canvas.width - width;
      dx = -dx;
      bounced = true;
    }

    if (y <= 0) {
      y = 0;
      dy = -dy;
      bounced = true;
    } else if (y + height >= canvas.height) {
      y = canvas.height - height;
      dy = -dy;
      bounced = true;
    }

    if (bounced) {
      colorIndex = (colorIndex + 1) % colors.length;
      currentColor = colors[colorIndex];
    }

    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);

    ctx.fillStyle = currentColor;
    ctx.shadowColor = currentColor;
    ctx.shadowBlur = 20;

    ctx.beginPath();
    ctx.ellipse(0, 0, width / 2, height / 2.5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#000';
    ctx.font = 'bold 32px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('DVD', 0, 0);

    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, width / 2 - 5, height / 2.5 - 5, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  window.FakeScreenSaverModules = window.FakeScreenSaverModules || {};
  window.FakeScreenSaverModules['dvd-logo'] = { init, draw };
})();
