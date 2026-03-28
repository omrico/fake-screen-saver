(function() {
  let grid = [];
  let nextGrid = [];
  let cellSize = 8;
  let cols, rows;
  let stagnationCounter = 0;
  let lastPopulation = 0;

  function initGrid(cols, rows) {
    grid = [];
    nextGrid = [];
    for (let i = 0; i < cols; i++) {
      grid[i] = [];
      nextGrid[i] = [];
      for (let j = 0; j < rows; j++) {
        grid[i][j] = Math.random() > 0.7 ? 1 : 0;
        nextGrid[i][j] = 0;
      }
    }
    stagnationCounter = 0;
    lastPopulation = 0;
  }

  function countNeighbors(x, y) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        
        const col = (x + i + cols) % cols;
        const row = (y + j + rows) % rows;
        count += grid[col][row];
      }
    }
    return count;
  }

  function updateGrid() {
    let population = 0;
    
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const neighbors = countNeighbors(i, j);
        const cell = grid[i][j];

        if (cell === 1 && (neighbors < 2 || neighbors > 3)) {
          nextGrid[i][j] = 0;
        } else if (cell === 0 && neighbors === 3) {
          nextGrid[i][j] = 1;
        } else {
          nextGrid[i][j] = cell;
        }

        population += nextGrid[i][j];
      }
    }

    const temp = grid;
    grid = nextGrid;
    nextGrid = temp;

    if (population === lastPopulation) {
      stagnationCounter++;
    } else {
      stagnationCounter = 0;
    }
    lastPopulation = population;

    if (stagnationCounter > 100 || population === 0) {
      initGrid(cols, rows);
    }
  }

  function drawGrid(ctx, canvas) {
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if (grid[i][j] === 1) {
          const hue = (i + j) % 360;
          ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
          ctx.fillRect(i * cellSize, j * cellSize, cellSize - 1, cellSize - 1);
        }
      }
    }
  }

  function init(canvas, ctx, config) {
    cols = Math.floor(canvas.width / cellSize);
    rows = Math.floor(canvas.height / cellSize);
    
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    initGrid(cols, rows);
  }

  function draw(ctx, canvas) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    updateGrid();
    drawGrid(ctx, canvas);
  }

  window.FakeScreenSaverModules = window.FakeScreenSaverModules || {};
  window.FakeScreenSaverModules['game-of-life'] = { init, draw };
})();
