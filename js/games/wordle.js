// Simple Wordle-like game. Loads words from files/Wordle.txt

function createEmptyState() {
  return {
    secret: "",
    guesses: [], // each guess: { word, result: ["correct"|"present"|"absent"] }
    maxGuesses: 6,
  };
}

async function loadWordList() {
  try {
    const res = await fetch("files/Wordle.txt");
    if (!res.ok) throw new Error("Failed to load Wordle.txt");
    const text = await res.text();
    const words = text
      .split(/\r?\n/)
      .map((w) => w.trim().toLowerCase())
      .filter((w) => w.length === 5 && /^[a-z]+$/.test(w));
    return words;
  } catch (e) {
    console.error(e);
    return ["react", "types", "codes", "ethan", "build"]; // fallback
  }
}

function pickRandom(words) {
  if (!words.length) return "react";
  const idx = Math.floor(Math.random() * words.length);
  return words[idx];
}

function evaluateGuess(secret, guess) {
  const res = Array(5).fill("absent");
  const secretArr = secret.split("");
  const guessArr = guess.split("");
  const used = Array(5).fill(false);

  // correct positions
  for (let i = 0; i < 5; i += 1) {
    if (guessArr[i] === secretArr[i]) {
      res[i] = "correct";
      used[i] = true;
    }
  }

  // present letters
  for (let i = 0; i < 5; i += 1) {
    if (res[i] === "correct") continue;
    const ch = guessArr[i];
    for (let j = 0; j < 5; j += 1) {
      if (!used[j] && secretArr[j] === ch) {
        res[i] = "present";
        used[j] = true;
        break;
      }
    }
  }

  return res;
}

function renderGrid(container, state) {
  container.innerHTML = "";
  for (let row = 0; row < state.maxGuesses; row += 1) {
    const rowEl = document.createElement("div");
    rowEl.className = "wordle-row";
    const guess = state.guesses[row];
    for (let col = 0; col < 5; col += 1) {
      const tile = document.createElement("div");
      tile.className = "wordle-tile";
      let letter = "";
      let stateClass = "state-empty";
      if (guess) {
        letter = guess.word[col] || "";
        stateClass = `state-${guess.result[col]}`;
      }
      tile.textContent = letter.toUpperCase();
      tile.classList.add(stateClass);
      rowEl.appendChild(tile);
    }
    container.appendChild(rowEl);
  }
}

export function setupWordleGameWindow(windowElement) {
  const gridEl = windowElement.querySelector(".wordle-grid");
  const statusEl = windowElement.querySelector(".wordle-status");
  const inputEl = windowElement.querySelector(".wordle-guess-input");
  const guessBtn = windowElement.querySelector(".wordle-guess-btn");
  const newBtn = windowElement.querySelector(".wordle-new-btn");

  if (!gridEl || !statusEl || !inputEl || !guessBtn || !newBtn) return;

  let state = createEmptyState();
  let words = [];

  async function newGame() {
    if (!words.length) {
      words = await loadWordList();
    }
    state = createEmptyState();
    state.secret = pickRandom(words);
    statusEl.textContent = "Guess the 5-letter word.";
    inputEl.value = "";
    renderGrid(gridEl, state);
  }

  function handleGuess() {
    const raw = inputEl.value.trim().toLowerCase();
    if (raw.length !== 5 || !/^[a-z]+$/.test(raw)) {
      statusEl.textContent = "Enter a valid 5-letter word.";
      return;
    }
    if (state.guesses.length >= state.maxGuesses) {
      statusEl.textContent = `Out of guesses. Word was "${state.secret.toUpperCase()}".`;
      return;
    }
    const result = evaluateGuess(state.secret, raw);
    state.guesses.push({ word: raw, result });
    renderGrid(gridEl, state);
    inputEl.value = "";

    if (raw === state.secret) {
      statusEl.textContent = "Correct! 🎉";
    } else if (state.guesses.length >= state.maxGuesses) {
      statusEl.textContent = `Out of guesses. Word was "${state.secret.toUpperCase()}".`;
    } else {
      statusEl.textContent = "Try again.";
    }
  }

  guessBtn.addEventListener("click", () => handleGuess());
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleGuess();
    }
  });
  newBtn.addEventListener("click", () => newGame());

  newGame();
}
