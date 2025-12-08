// Simplified Tetris implementation

const SHAPES = {
  I: [[1, 1, 1, 1]],
  O: [[1, 1],[1, 1]],
  T: [[0, 1, 0],[1, 1, 1]],
  S: [[0, 1, 1],[1, 1, 0]],
  Z: [[1, 1, 0],[0, 1, 1]],
  J: [[1, 0, 0],[1, 1, 1]],
  L: [[0, 0, 1],[1, 1, 1]],
};

const SHAPE_KEYS = Object.keys(SHAPES);

function createEmptyBoard(rows, cols) {
  return Array.from({ length: rows }, () => Array(cols).fill(null));
}

function randomShape() {
  const key = SHAPE_KEYS[Math.floor(Math.random() * SHAPE_KEYS.length)];
  return { type: key, matrix: SHAPES[key].map((row) => row.slice()) };
}

function rotateMatrix(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const res = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      res[c][rows - 1 - r] = matrix[r][c];
    }
  }
  return res;
}

function canPlace(board, matrix, offsetRow, offsetCol) {
  const rows = board.length;
  const cols = board[0].length;
  for (let r = 0; r < matrix.length; r += 1) {
    for (let c = 0; c < matrix[r].length; c += 1) {
      if (!matrix[r][c]) continue;
      const br = offsetRow + r;
      const bc = offsetCol + c;
      if (br < 0 || br >= rows || bc < 0 || bc >= cols) return false;
      if (board[br][bc]) return false;
    }
  }
  return true;
}

function mergePiece(board, piece) {
  const { matrix, row, col, type } = piece;
  const rows = matrix.length;
  const cols = matrix[0].length;
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (!matrix[r][c]) continue;
      const br = row + r;
      const bc = col + c;
      if (br >= 0) board[br][bc] = type;
    }
  }
}

function clearLines(board) {
  const cols = board[0].length;
  const newRows = [];
  let cleared = 0;
  for (let r = 0; r < board.length; r += 1) {
    if (board[r].every((cell) => cell)) {
      cleared += 1;
    } else {
      newRows.push(board[r]);
    }
  }
  while (newRows.length < board.length) {
    newRows.unshift(Array(cols).fill(null));
  }
  return { board: newRows, cleared };
}

function renderBoard(board, currentPiece, gridEl, scoreEl, score) {
  const rows = board.length;
  const cols = board[0].length;
  const temp = board.map((row) => row.slice());

  if (currentPiece) {
    const { matrix, row, col, type } = currentPiece;
    for (let r = 0; r < matrix.length; r += 1) {
      for (let c = 0; c < matrix[r].length; c += 1) {
        if (!matrix[r][c]) continue;
        const br = row + r;
        const bc = col + c;
        if (br >= 0 && br < rows && bc >= 0 && bc < cols) {
          temp[br][bc] = type;
        }
      }
    }
  }

  gridEl.innerHTML = "";
  gridEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const cellEl = document.createElement("div");
      cellEl.className = "tetris-cell";
      const val = temp[r][c];
      if (val) {
        cellEl.classList.add(`filled-${val}`);
      }
      gridEl.appendChild(cellEl);
    }
  }

  if (scoreEl) scoreEl.textContent = `Score: ${score}`;
}

export function setupTetrisGameWindow(windowElement) {
  const gridEl = windowElement.querySelector(".tetris-grid");
  const nextGridEl = windowElement.querySelector(".tetris-next-grid");
  const statusEl = windowElement.querySelector(".tetris-status");
  const scoreEl = windowElement.querySelector(".tetris-score");
  const resetBtn = windowElement.querySelector(".tetris-reset-btn");

  if (!gridEl || !nextGridEl || !statusEl || !scoreEl || !resetBtn) return;

  const rows = parseInt(gridEl.dataset.rows || "20", 10);
  const cols = parseInt(gridEl.dataset.cols || "10", 10);

  let board;
  let currentPiece;
  let nextPiece;
  let score;
  let intervalId;
  let running = false;

  function renderNext() {
    nextGridEl.innerHTML = "";
    nextGridEl.style.gridTemplateColumns = "repeat(4, 1fr)";
    const preview = Array.from({ length: 4 }, () => Array(4).fill(null));
    if (nextPiece) {
      const m = nextPiece.matrix;
      const offsetR = Math.floor((4 - m.length) / 2);
      const offsetC = Math.floor((4 - m[0].length) / 2);
      for (let r = 0; r < m.length; r += 1) {
        for (let c = 0; c < m[r].length; c += 1) {
          if (!m[r][c]) continue;
          preview[offsetR + r][offsetC + c] = nextPiece.type;
        }
      }
    }
    for (let r = 0; r < 4; r += 1) {
      for (let c = 0; c < 4; c += 1) {
        const cell = document.createElement("div");
        cell.className = "tetris-cell";
        const val = preview[r][c];
        if (val) cell.classList.add(`filled-${val}`);
        nextGridEl.appendChild(cell);
      }
    }
  }

  function spawnPiece() {
    currentPiece = nextPiece || randomShape();
    currentPiece.row = -2;
    currentPiece.col = Math.floor(cols / 2) - 2;
    nextPiece = randomShape();
    renderNext();
    if (!canPlace(board, currentPiece.matrix, currentPiece.row, currentPiece.col)) {
      // game over
      running = false;
      clearInterval(intervalId);
      statusEl.textContent = "Game over. Press New Game.";
    }
  }

  function step() {
    if (!running) return;
    const { matrix, row, col } = currentPiece;
    if (canPlace(board, matrix, row + 1, col)) {
      currentPiece.row += 1;
    } else {
      mergePiece(board, currentPiece);
      const result = clearLines(board);
      board = result.board;
      if (result.cleared > 0) {
        score += result.cleared * 100;
      }
      spawnPiece();
    }
    renderBoard(board, currentPiece, gridEl, scoreEl, score);
  }

  function newGame() {
    board = createEmptyBoard(rows, cols);
    nextPiece = randomShape();
    score = 0;
    running = true;
    statusEl.textContent = "Use ← → ↓ and ↑/space to rotate/drop.";
    spawnPiece();
    renderBoard(board, currentPiece, gridEl, scoreEl, score);
    if (intervalId) clearInterval(intervalId);
    intervalId = window.setInterval(step, 500);
  }

  function handleKey(e) {
    if (!running || !currentPiece) return;
    const { matrix, row, col } = currentPiece;
    if (e.key === "ArrowLeft") {
      if (canPlace(board, matrix, row, col - 1)) {
        currentPiece.col -= 1;
      }
    } else if (e.key === "ArrowRight") {
      if (canPlace(board, matrix, row, col + 1)) {
        currentPiece.col += 1;
      }
    } else if (e.key === "ArrowDown") {
      if (canPlace(board, matrix, row + 1, col)) {
        currentPiece.row += 1;
      }
    } else if (e.key === "ArrowUp" || e.key === " ") {
      const rotated = rotateMatrix(matrix);
      if (canPlace(board, rotated, row, col)) {
        currentPiece.matrix = rotated;
      }
    }
    renderBoard(board, currentPiece, gridEl, scoreEl, score);
  }

  resetBtn.addEventListener("click", () => newGame());
  window.addEventListener("keydown", handleKey);

  newGame();
}
