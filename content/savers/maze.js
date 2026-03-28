(function() {
  let grid = [];
  let cols, rows;
  let cellSize = 20;
  let stacks = [];
  let walls = [];
  let hues = [];
  let growing = true;
  let stallFrames = 0;

  const directions = [
    { dx: 0, dy: -1 },  // up
    { dx: 1, dy: 0 },   // right
    { dx: 0, dy: 1 },   // down
    { dx: -1, dy: 0 }   // left
  ];

  function initGrid(canvas) {
    cols = Math.floor(canvas.width / cellSize);
    rows = Math.floor(canvas.height / cellSize);
    grid = [];
    walls = [];
    stacks = [];
    hues = [];
    growing = true;
    stallFrames = 0;

    for (let x = 0; x < cols; x++) {
      grid[x] = [];
      for (let y = 0; y < rows; y++) {
        grid[x][y] = { visited: false, owner: -1 };
      }
    }

    const numSeeds = 8;
    for (let i = 0; i < numSeeds; i++) {
      const x = Math.floor(Math.random() * cols);
      const y = Math.floor(Math.random() * rows);
      
      if (!grid[x][y].visited) {
        grid[x][y].visited = true;
        grid[x][y].owner = i;
        stacks.push([{ x, y }]);
        hues.push((i * 360 / numSeeds + Math.random() * 30) % 360);
      }
    }

    if (stacks.length === 0) {
      grid[0][0].visited = true;
      grid[0][0].owner = 0;
      stacks.push([{ x: 0, y: 0 }]);
      hues.push(Math.random() * 360);
    }
  }

  function getUnvisitedNeighbors(x, y) {
    const neighbors = [];
    for (const dir of directions) {
      const nx = x + dir.dx;
      const ny = y + dir.dy;
      if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && !grid[nx][ny].visited) {
        neighbors.push({ x: nx, y: ny, dx: dir.dx, dy: dir.dy });
      }
    }
    return neighbors;
  }

  function growMaze() {
    let anyGrew = false;

    for (let i = 0; i < stacks.length; i++) {
      const stack = stacks[i];
      if (stack.length === 0) continue;

      const current = stack[stack.length - 1];
      const neighbors = getUnvisitedNeighbors(current.x, current.y);

      if (neighbors.length > 0) {
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        
        grid[next.x][next.y].visited = true;
        grid[next.x][next.y].owner = i;

        walls.push({
          x1: current.x * cellSize + cellSize / 2,
          y1: current.y * cellSize + cellSize / 2,
          x2: next.x * cellSize + cellSize / 2,
          y2: next.y * cellSize + cellSize / 2,
          owner: i
        });

        stack.push({ x: next.x, y: next.y });
        anyGrew = true;
      } else {
        stack.pop();
      }
    }

    return anyGrew;
  }

  function init(canvas, ctx, config) {
    initGrid(canvas);
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function draw(ctx, canvas) {
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const grew = growMaze();

    for (const wall of walls) {
      const hue = hues[wall.owner];
      ctx.strokeStyle = `hsl(${hue}, 70%, 50%)`;
      ctx.lineWidth = cellSize * 0.4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(wall.x1, wall.y1);
      ctx.lineTo(wall.x2, wall.y2);
      ctx.stroke();
    }

    for (let i = 0; i < stacks.length; i++) {
      const stack = stacks[i];
      if (stack.length > 0) {
        const head = stack[stack.length - 1];
        const hue = hues[i];
        ctx.fillStyle = `hsl(${hue}, 90%, 70%)`;
        ctx.beginPath();
        ctx.arc(
          head.x * cellSize + cellSize / 2,
          head.y * cellSize + cellSize / 2,
          cellSize * 0.35,
          0, Math.PI * 2
        );
        ctx.fill();
      }
    }

    if (!grew) {
      stallFrames++;
      if (stallFrames > 120) {
        initGrid(canvas);
      }
    } else {
      stallFrames = 0;
    }
  }

  window.FakeScreenSaverModules = window.FakeScreenSaverModules || {};
  window.FakeScreenSaverModules['maze'] = { init, draw };
})();
