// Very simple chess implementation: basic legal moves, no check/checkmate logic

const INITIAL_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

const PIECE_UNICODE = {
  p: "♟️",
  r: "♜",
  n: "♞",
  b: "♝",
  q: "♛",
  k: "♚",
  P: "♙",
  R: "♖",
  N: "♘",
  B: "♗",
  Q: "♕",
  K: "♔",
};

function parseFen(fen) {
  const board = [];
  const rows = fen.split("/");
  for (let r = 0; r < 8; r += 1) {
    const row = [];
    let c = 0;
    for (const ch of rows[r]) {
      if (/[1-8]/.test(ch)) {
        const empty = parseInt(ch, 10);
        for (let i = 0; i < empty; i += 1) row.push(null);
        c += empty;
      } else {
        row.push(ch);
        c += 1;
      }
    }
    board.push(row);
  }
  return board;
}

function sameColor(a, b) {
  if (!a || !b) return false;
  const isWhite = (p) => p === p.toUpperCase();
  return isWhite(a) === isWhite(b);
}

function isWhitePiece(p) {
  return p && p === p.toUpperCase();
}

function inBounds(r, c) {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

function generateMoves(board, r, c) {
  const piece = board[r][c];
  if (!piece) return [];
  const moves = [];
  const white = isWhitePiece(piece);
  const dir = white ? -1 : 1;
  const enemyColor = (p) => !!p && isWhitePiece(p) !== white;

  const addMove = (nr, nc) => {
    if (!inBounds(nr, nc)) return;
    const target = board[nr][nc];
    if (!target || enemyColor(target)) moves.push({ r: nr, c: nc });
  };

  const addRay = (dr, dc) => {
    let nr = r + dr;
    let nc = c + dc;
    while (inBounds(nr, nc)) {
      const target = board[nr][nc];
      if (!target) {
        moves.push({ r: nr, c: nc });
      } else {
        if (enemyColor(target)) moves.push({ r: nr, c: nc });
        break;
      }
      nr += dr;
      nc += dc;
    }
  };

  switch (piece.toLowerCase()) {
    case "p": {
      // single forward
      const nr = r + dir;
      if (inBounds(nr, c) && !board[nr][c]) moves.push({ r: nr, c });
      // double from start
      const startRank = white ? 6 : 1;
      if (r === startRank && !board[nr][c] && !board[r + 2 * dir][c]) {
        moves.push({ r: r + 2 * dir, c });
      }
      // captures
      [[dir, -1], [dir, 1]].forEach(([dr, dc]) => {
        const cr = r + dr;
        const cc = c + dc;
        if (inBounds(cr, cc) && enemyColor(board[cr][cc])) {
          moves.push({ r: cr, c: cc });
        }
      });
      break;
    }
    case "n": {
      const jumps = [
        [2, 1],[2, -1],[-2, 1],[-2, -1],
        [1, 2],[1, -2],[-1, 2],[-1, -2],
      ];
      jumps.forEach(([dr, dc]) => addMove(r + dr, c + dc));
      break;
    }
    case "b": {
      [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([dr, dc]) => addRay(dr, dc));
      break;
    }
    case "r": {
      [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dr, dc]) => addRay(dr, dc));
      break;
    }
    case "q": {
      [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([dr, dc]) => addRay(dr, dc));
      break;
    }
    case "k": {
      for (let dr = -1; dr <= 1; dr += 1) {
        for (let dc = -1; dc <= 1; dc += 1) {
          if (dr === 0 && dc === 0) continue;
          addMove(r + dr, c + dc);
        }
      }
      break;
    }
    default:
      break;
  }

  return moves;
}

export function setupChessGameWindow(windowElement) {
  const boardEl = windowElement.querySelector(".chess-board");
  const statusEl = windowElement.querySelector(".chess-status");
  const resetBtn = windowElement.querySelector(".chess-reset-btn");

  if (!boardEl || !statusEl || !resetBtn) return;

  let board = parseFen(INITIAL_FEN);
  let whiteToMove = true;
  let selected = null; // {r,c}

  function render() {
    boardEl.innerHTML = "";
    for (let r = 0; r < 8; r += 1) {
      for (let c = 0; c < 8; c += 1) {
        const square = document.createElement("div");
        square.className = "chess-square";
        const dark = (r + c) % 2 === 1;
        square.classList.add(dark ? "dark" : "light");
        square.dataset.row = String(r);
        square.dataset.col = String(c);
        const piece = board[r][c];
        if (piece) {
          square.textContent = PIECE_UNICODE[piece] || piece;
        }
        if (selected && selected.r === r && selected.c === c) {
          square.classList.add("selected");
        }
        boardEl.appendChild(square);
      }
    }
    statusEl.textContent = whiteToMove ? "White to move" : "Black to move";
  }

  function resetGame() {
    board = parseFen(INITIAL_FEN);
    whiteToMove = true;
    selected = null;
    render();
  }

  function handleClick(e) {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const r = parseInt(target.dataset.row || "-1", 10);
    const c = parseInt(target.dataset.col || "-1", 10);
    if (!inBounds(r, c)) return;
    const piece = board[r][c];

    if (!selected) {
      if (!piece) return;
      if (whiteToMove !== isWhitePiece(piece)) return;
      selected = { r, c };
      render();
      return;
    }

    const from = selected;
    const fromPiece = board[from.r][from.c];
    if (!fromPiece) {
      selected = null;
      render();
      return;
    }

    const moves = generateMoves(board, from.r, from.c);
    const isLegal = moves.some((m) => m.r === r && m.c === c);
    if (!isLegal) {
      // either select new piece or deselect
      if (piece && sameColor(piece, fromPiece)) {
        selected = { r, c };
      } else {
        selected = null;
      }
      render();
      return;
    }

    // make move
    board[r][c] = fromPiece;
    board[from.r][from.c] = null;
    selected = null;
    whiteToMove = !whiteToMove;
    render();
  }

  boardEl.addEventListener("click", handleClick);
  resetBtn.addEventListener("click", () => resetGame());

  render();
}
