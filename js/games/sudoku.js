// Sudoku implementation: randomised puzzle from base grid + backtracking solver

const BASE_SOLUTION = [
  [5,3,4,6,7,8,9,1,2],
  [6,7,2,1,9,5,3,4,8],
  [1,9,8,3,4,2,5,6,7],
  [8,5,9,7,6,1,4,2,3],
  [4,2,6,8,5,3,7,9,1],
  [7,1,3,9,2,4,8,5,6],
  [9,6,1,5,3,7,2,8,4],
  [2,8,7,4,1,9,6,3,5],
  [3,4,5,2,8,6,1,7,9],
];

function cloneGrid(grid) {
  return grid.map((row) => row.slice());
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randomisedSolution() {
  let grid = cloneGrid(BASE_SOLUTION);

  // swap rows within each band
  [0,3,6].forEach((start) => {
    const order = shuffle([0,1,2]);
    const band = order.map((o) => grid[start + o]);
    for (let i = 0; i < 3; i += 1) grid[start + i] = band[i];
  });

  // swap columns within each stack
  grid = grid.map((row) => {
    const newRow = row.slice();
    [0,3,6].forEach((start) => {
      const order = shuffle([0,1,2]);
      const seg = order.map((o) => row[start + o]);
      for (let i = 0; i < 3; i += 1) newRow[start + i] = seg[i];
    });
    return newRow;
  });

  return grid;
}

function makePuzzle(solution, holes = 40) {
  const puzzle = cloneGrid(solution);
  const cells = [];
  for (let r = 0; r < 9; r += 1) {
    for (let c = 0; c < 9; c += 1) {
      cells.push({ r, c });
    }
  }
  const shuffled = shuffle(cells);
  for (let i = 0; i < holes && i < shuffled.length; i += 1) {
    const { r, c } = shuffled[i];
    puzzle[r][c] = 0;
  }
  return puzzle;
}

function isValid(grid, row, col, val) {
  for (let c = 0; c < 9; c += 1) {
    if (grid[row][c] === val) return false;
  }
  for (let r = 0; r < 9; r += 1) {
    if (grid[r][col] === val) return false;
  }
  const br = Math.floor(row / 3) * 3;
  const bc = Math.floor(col / 3) * 3;
  for (let r = br; r < br + 3; r += 1) {
    for (let c = bc; c < bc + 3; c += 1) {
      if (grid[r][c] === val) return false;
    }
  }
  return true;
}

function solve(grid) {
  for (let r = 0; r < 9; r += 1) {
    for (let c = 0; c < 9; c += 1) {
      if (!grid[r][c]) {
        for (let val = 1; val <= 9; val += 1) {
          if (isValid(grid, r, c, val)) {
            grid[r][c] = val;
            if (solve(grid)) return true;
            grid[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

export function setupSudokuGameWindow(windowElement) {
  const gridEl = windowElement.querySelector(".sudoku-grid");
  const statusEl = windowElement.querySelector(".sudoku-status");
  const newBtn = windowElement.querySelector(".sudoku-new-btn");
  const solveBtn = windowElement.querySelector(".sudoku-solve-btn");

  if (!gridEl || !statusEl || !newBtn || !solveBtn) return;

  let solution;
  let puzzle;

  function render() {
    gridEl.innerHTML = "";
    for (let r = 0; r < 9; r += 1) {
      for (let c = 0; c < 9; c += 1) {
        const cell = document.createElement("input");
        cell.type = "text";
        cell.maxLength = 1;
        cell.className = "sudoku-cell";
        cell.dataset.row = String(r);
        cell.dataset.col = String(c);
        const val = puzzle[r][c];
        if (val) {
          cell.value = String(val);
          cell.readOnly = true;
          cell.classList.add("readonly");
        }
        cell.addEventListener("input", () => {
          const v = cell.value.replace(/[^1-9]/g, "");
          cell.value = v;
          const num = parseInt(v || "0", 10);
          puzzle[r][c] = Number.isNaN(num) ? 0 : num;
        });
        gridEl.appendChild(cell);
      }
    }
  }

  function newPuzzle() {
    solution = randomisedSolution();
    puzzle = makePuzzle(solution, 40);
    statusEl.textContent = "Fill the grid. Digits 1–9.";
    render();
  }

  function autoSolve() {
    const grid = cloneGrid(puzzle);
    if (solve(grid)) {
      puzzle = grid;
      statusEl.textContent = "Solved!";
      render();
    } else {
      statusEl.textContent = "No solution found.";
    }
  }

  newBtn.addEventListener("click", () => newPuzzle());
  solveBtn.addEventListener("click", () => autoSolve());

  newPuzzle();
}
