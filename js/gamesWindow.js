// Games hub window logic
// Responsible only for launching individual game windows from the Games app

let currentGame = null;
let keyHandlerRegistered = false;

function registerKeyHandler() {
  if (keyHandlerRegistered) return;
  keyHandlerRegistered = true;

  window.addEventListener("keydown", (e) => {
    if (!currentGame || !currentGame.running) return;

    const { windowElement } = currentGame;
    if (!windowElement || !windowElement.isConnected) {
      stopGame(currentGame);
      return;
    }

    const key = e.key.toLowerCase();
    let newDir = null;

    if (key === "arrowup" || key === "w") newDir = "up";
    if (key === "arrowdown" || key === "s") newDir = "down";
    if (key === "arrowleft" || key === "a") newDir = "left";
    if (key === "arrowright" || key === "d") newDir = "right";

    if (!newDir) return;

    e.preventDefault();

    // Prevent reversing direction directly
    const opposite = {
      up: "down",
      down: "up",
      left: "right",
      right: "left",
    };

    if (opposite[currentGame.direction] === newDir) return;
    currentGame.nextDirection = newDir;
  });
}

function initBoard(game) {
  const { grid } = game;
  if (!grid || grid.dataset.initialised) return;

  const rows = game.rows;
  const cols = game.cols;

  grid.style.setProperty("--snake-rows", rows);
  grid.style.setProperty("--snake-cols", cols);

  const fragment = document.createDocumentFragment();
  const total = rows * cols;
  for (let i = 0; i < total; i += 1) {
    const cell = document.createElement("div");
    cell.className = "snake-cell";
    fragment.appendChild(cell);
  }
  grid.appendChild(fragment);
  grid.dataset.initialised = "true";
  game.cells = Array.from(grid.children);
}

function indexFromPos(game, x, y) {
  return y * game.cols + x;
}

function placeFood(game) {
  const { rows, cols, snake } = game;
  const total = rows * cols;
  const occupied = new Set(snake.map((seg) => indexFromPos(game, seg.x, seg.y)));

  let idx = null;
  const maxAttempts = 1000;
  let attempts = 0;
  while (attempts < maxAttempts) {
    const candidate = Math.floor(Math.random() * total);
    if (!occupied.has(candidate)) {
      idx = candidate;
      break;
    }
    attempts += 1;
  }

  if (idx == null) {
    game.food = null;
    return;
  }

  game.food = {
    x: idx % game.cols,
    y: Math.floor(idx / game.cols),
  };
}

function render(game) {
  const { cells, snake, food, scoreEl } = game;
  if (!cells || !cells.length) return;

  // Clear classes
  cells.forEach((cell) => {
    cell.classList.remove("snake", "snake-head", "food");
  });

  // Draw snake
  snake.forEach((seg, i) => {
    const idx = indexFromPos(game, seg.x, seg.y);
    const cell = cells[idx];
    if (!cell) return;
    if (i === 0) {
      cell.classList.add("snake-head");
    } else {
      cell.classList.add("snake");
    }
  });

  // Draw food
  if (food) {
    const idx = indexFromPos(game, food.x, food.y);
    const cell = cells[idx];
    if (cell) cell.classList.add("food");
  }

  if (scoreEl) {
    scoreEl.textContent = `Score: ${game.score}`;
  }
}

function tick(game) {
  const { grid, rows, cols } = game;
  if (!grid || !grid.isConnected) {
    stopGame(game);
    return;
  }

  let { snake, direction, nextDirection, food, statusEl } = game;

  if (!snake || snake.length === 0) return;

  // Apply buffered direction
  direction = nextDirection || direction;
  game.direction = direction;

  const head = snake[0];
  let newX = head.x;
  let newY = head.y;

  if (direction === "up") newY -= 1;
  if (direction === "down") newY += 1;
  if (direction === "left") newX -= 1;
  if (direction === "right") newX += 1;

  // Check wall collision
  if (newX < 0 || newX >= cols || newY < 0 || newY >= rows) {
    if (statusEl) {
      statusEl.textContent = "Game over — hit the wall. Press Restart.";
    }
    stopGame(game);
    render(game);
    return;
  }

  // Check self collision
  if (snake.some((seg) => seg.x === newX && seg.y === newY)) {
    if (statusEl) {
      statusEl.textContent = "Game over — ran into yourself. Press Restart.";
    }
    stopGame(game);
    render(game);
    return;
  }

  const newHead = { x: newX, y: newY };

  // Move
  snake = [newHead, ...snake];

  if (food && newX === food.x && newY === food.y) {
    // Eat food: keep tail, increase score, place new food
    game.score += 1;
    placeFood(game);
  } else {
    // Normal move: remove tail
    snake.pop();
  }

  game.snake = snake;
  render(game);
}

function startGame(game) {
  if (!game.grid || !game.grid.isConnected) return;

  // Stop any existing game loop
  stopGame(game);

  const { rows, cols, statusEl } = game;
  const startX = Math.floor(cols / 2);
  const startY = Math.floor(rows / 2);

  game.snake = [
    { x: startX, y: startY },
    { x: startX - 1, y: startY },
    { x: startX - 2, y: startY },
  ];
  game.direction = "right";
  game.nextDirection = "right";
  game.score = 0;

  placeFood(game);

  if (statusEl) {
    statusEl.textContent = "Use arrow keys or WASD to move.";
  }

  game.running = true;
  currentGame = game;

  render(game);

  game.intervalId = window.setInterval(() => tick(game), 150);
}

function stopGame(game) {
  if (!game) return;
  if (game.intervalId) {
    clearInterval(game.intervalId);
    game.intervalId = null;
  }
  game.running = false;
}

export function setupGamesWindow(windowElement) {
  const gamesContainer = windowElement.querySelector(".games-container");
  if (!gamesContainer) return;

  // Helper to wire a game card to open a specific app id
  function wireGameLauncher(gameId) {
    const card = gamesContainer.querySelector(`.game-card[data-game="${gameId}"]`);
    if (!card) return;

    const button = card.querySelector(".game-launch-btn");
    if (!button) return;

    button.textContent = "Open";
    button.classList.add("game-launch-btn--active");
    button.style.cursor = "pointer";

    button.addEventListener("click", () => {
      window.dispatchEvent(
        new CustomEvent("open-app", { detail: { appId: `${gameId}-game` } })
      );
    });
  }

  ["minesweeper", "snake", "tetris", "pong", "doom", "chess", "sudoku", "wordle"].forEach((id) =>
    wireGameLauncher(id)
  );
}
