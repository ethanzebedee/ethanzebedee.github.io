// Minesweeper implementation

function createEmptyBoard(rows, cols) {
  const board = [];
  for (let r = 0; r < rows; r += 1) {
    const row = [];
    for (let c = 0; c < cols; c += 1) {
      row.push({
        row: r,
        col: c,
        isMine: false,
        adjacent: 0,
        revealed: false,
        flagged: false,
      });
    }
    board.push(row);
  }
  return board;
}

function inBounds(rows, cols, r, c) {
  return r >= 0 && r < rows && c >= 0 && c < cols;
}

function forEachNeighbor(board, r, c, cb) {
  const rows = board.length;
  const cols = board[0].length;
  for (let dr = -1; dr <= 1; dr += 1) {
    for (let dc = -1; dc <= 1; dc += 1) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr;
      const nc = c + dc;
      if (inBounds(rows, cols, nr, nc)) cb(board[nr][nc]);
    }
  }
}

function placeMines(board, mineCount, safeCell) {
  const rows = board.length;
  const cols = board[0].length;
  const total = rows * cols;
  const forbiddenIndex = safeCell.row * cols + safeCell.col;

  const indices = [];
  for (let i = 0; i < total; i += 1) {
    if (i === forbiddenIndex) continue;
    indices.push(i);
  }

  for (let i = indices.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const selected = indices.slice(0, mineCount);
  selected.forEach((idx) => {
    const r = Math.floor(idx / cols);
    const c = idx % cols;
    board[r][c].isMine = true;
  });

  // Compute adjacency
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const cell = board[r][c];
      if (cell.isMine) continue;
      let count = 0;
      forEachNeighbor(board, r, c, (n) => {
        if (n.isMine) count += 1;
      });
      cell.adjacent = count;
    }
  }
}

function updateCounter(el, remaining) {
  if (!el) return;
  el.textContent = `Mines: ${remaining}`;
}

function revealCell(board, cell, gridEl, statusEl) {
  if (cell.revealed || cell.flagged) return;
  cell.revealed = true;

  const index = cell.row * board[0].length + cell.col;
  const cellEl = gridEl.children[index];
  if (!cellEl) return;

  cellEl.classList.add("revealed");
  if (cell.isMine) {
    cellEl.classList.add("mine");
    cellEl.textContent = "💣";
    if (statusEl) statusEl.textContent = "Game over — hit a mine.";
    return;
  }

  if (cell.adjacent > 0) {
    cellEl.textContent = String(cell.adjacent);
  } else {
    // flood fill
    forEachNeighbor(board, cell.row, cell.col, (n) => {
      if (!n.revealed && !n.isMine) {
        revealCell(board, n, gridEl, statusEl);
      }
    });
  }
}

function revealAllMines(board, gridEl) {
  const rows = board.length;
  const cols = board[0].length;
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const cell = board[r][c];
      if (!cell.isMine) continue;
      const idx = r * cols + c;
      const cellEl = gridEl.children[idx];
      if (!cellEl) continue;
      cellEl.classList.add("revealed", "mine");
      cellEl.textContent = "💣";
    }
  }
}

function checkWin(board) {
  const rows = board.length;
  const cols = board[0].length;
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const cell = board[r][c];
      if (!cell.isMine && !cell.revealed) return false;
    }
  }
  return true;
}

export function setupMinesweeperGameWindow(windowElement) {
  const container = windowElement.querySelector(".minesweeper-container");
  const gridEl = windowElement.querySelector(".minesweeper-grid");
  const statusEl = windowElement.querySelector(".minesweeper-status");
  const counterEl = windowElement.querySelector(".minesweeper-counter");
  const resetBtn = windowElement.querySelector(".minesweeper-reset-btn");

  if (!container || !gridEl || !statusEl || !counterEl || !resetBtn) return;

  const rows = parseInt(gridEl.dataset.rows || "10", 10);
  const cols = parseInt(gridEl.dataset.cols || "10", 10);
  const mines = parseInt(gridEl.dataset.mines || "15", 10);

  let board = null;
  let firstClick = true;
  let remainingMines = mines;
  let gameOver = false;

  function renderBoard() {
    gridEl.innerHTML = "";
    gridEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    updateCounter(counterEl, remainingMines);

    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const cell = board[r][c];
        const cellEl = document.createElement("div");
        cellEl.className = "minesweeper-cell";
        cellEl.dataset.row = String(r);
        cellEl.dataset.col = String(c);
        gridEl.appendChild(cellEl);
      }
    }
  }

  function newGame() {
    board = createEmptyBoard(rows, cols);
    firstClick = true;
    remainingMines = mines;
    gameOver = false;
    statusEl.textContent = "Left-click to reveal, right-click to flag.";
    renderBoard();
  }

  function handleClick(e) {
    if (gameOver) return;
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const r = parseInt(target.dataset.row || "-1", 10);
    const c = parseInt(target.dataset.col || "-1", 10);
    if (!inBounds(rows, cols, r, c)) return;

    const cell = board[r][c];

    if (firstClick) {
      placeMines(board, mines, cell);
      firstClick = false;
    }

    if (cell.flagged) return;

    if (cell.isMine) {
      revealAllMines(board, gridEl);
      gameOver = true;
      statusEl.textContent = "Game over — hit a mine. Press New Game.";
      return;
    }

    revealCell(board, cell, gridEl, statusEl);

    if (checkWin(board)) {
      gameOver = true;
      statusEl.textContent = "You win! 🎉";
    }
  }

  function handleRightClick(e) {
    e.preventDefault();
    if (gameOver) return;
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const r = parseInt(target.dataset.row || "-1", 10);
    const c = parseInt(target.dataset.col || "-1", 10);
    if (!inBounds(rows, cols, r, c)) return;
    const cell = board[r][c];
    if (cell.revealed) return;

    cell.flagged = !cell.flagged;
    if (cell.flagged) {
      remainingMines -= 1;
      target.classList.add("flagged");
    } else {
      remainingMines += 1;
      target.classList.remove("flagged");
    }
    updateCounter(counterEl, remainingMines);
  }

  gridEl.addEventListener("click", handleClick);
  gridEl.addEventListener("contextmenu", handleRightClick);
  resetBtn.addEventListener("click", () => newGame());

  newGame();
}
