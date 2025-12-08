import { state } from "./state.js";
import { appConfigs } from "./apps/index.js";
import { addToTaskbar, removeFromTaskbar, updateTaskbarActive } from "./taskbar.js";
import { setupSettingsWindow } from "./settingsWindow.js";
import { setupGamesWindow } from "./gamesWindow.js";
import { setupSnakeGameWindow } from "./games/snake.js";
import { setupMinesweeperGameWindow } from "./games/minesweeper.js";
import { setupTetrisGameWindow } from "./games/tetris.js";
import { setupPongGameWindow } from "./games/pong.js";
import { setupChessGameWindow } from "./games/chess.js";
import { setupSudokuGameWindow } from "./games/sudoku.js";
import { setupWordleGameWindow } from "./games/wordle.js";

let currentThemeLabelEl = null;
let themeIconEl = null;

// Initialise window manager with external UI references
export function initWindowManager({ currentThemeLabel, themeIcon }) {
  currentThemeLabelEl = currentThemeLabel;
  themeIconEl = themeIcon;
}

// Window management functions
export function openWindow(appName) {
  console.log("openWindow called for:", appName);

  // If window already exists, focus it
  if (state.windows[appName]) {
    console.log("Window already exists, focusing");
    focusWindow(state.windows[appName]);
    if (state.windows[appName].classList.contains("minimized")) {
      toggleMinimize(state.windows[appName]);
    }
    return;
  }

  const config = appConfigs[appName];
  if (!config) {
    console.error("No config found for app:", appName);
    return;
  }

  console.log("Creating window with config:", config);

  // Create window from template
  const template = document.getElementById("window-template");
  const windowElement = template.content
    .cloneNode(true)
    .querySelector(".window");

  windowElement.dataset.app = appName;
  windowElement.querySelector(".window-title").textContent = config.title;

  // Load content from template
  const contentTemplate = document.getElementById(config.template);
  const content = contentTemplate.content.cloneNode(true);
  windowElement.querySelector(".window-content").appendChild(content);

  // Set initial position (cascade)
  const offset = Object.keys(state.windows).length * 30;
  windowElement.style.top = `${50 + offset}px`;
  windowElement.style.left = `${50 + offset}px`;
  windowElement.style.width = "600px";
  windowElement.style.height = "500px";

  // Add to DOM
  document.getElementById("windows-container").appendChild(windowElement);

  // Store reference
  state.windows[appName] = windowElement;

  // Setup window controls
  setupWindowControls(windowElement);

  // Add to taskbar
  addToTaskbar(appName, config.title, toggleMinimize, focusWindow);

  // Focus the window
  focusWindow(windowElement);

  // Animate skill bars if it's the skills window
  if (appName === "skills") {
    setTimeout(() => {
      windowElement.querySelectorAll(".skill-level").forEach((bar) => {
        bar.style.width = bar.dataset.level + "%";
      });
    }, 100);
  }

  // Setup settings window interactivity
  if (appName === "settings") {
    setTimeout(
      () =>
        setupSettingsWindow(windowElement, {
          currentThemeLabel: currentThemeLabelEl,
          themeIcon: themeIconEl,
        }),
      50
    );
  }

  // Setup games hub window (launches individual game windows)
  if (appName === "games") {
    setTimeout(() => setupGamesWindow(windowElement), 50);
  }

  // Setup individual game windows
  if (appName === "snake-game") {
    setTimeout(() => setupSnakeGameWindow(windowElement), 50);
  }
  if (appName === "minesweeper-game") {
    setTimeout(() => setupMinesweeperGameWindow(windowElement), 50);
  }
  if (appName === "tetris-game") {
    setTimeout(() => setupTetrisGameWindow(windowElement), 50);
  }
  if (appName === "pong-game") {
    setTimeout(() => setupPongGameWindow(windowElement), 50);
  }
  if (appName === "chess-game") {
    setTimeout(() => setupChessGameWindow(windowElement), 50);
  }
  if (appName === "sudoku-game") {
    setTimeout(() => setupSudokuGameWindow(windowElement), 50);
  }
  if (appName === "wordle-game") {
    setTimeout(() => setupWordleGameWindow(windowElement), 50);
  }
}

function setupWindowControls(windowElement) {
  const titlebar = windowElement.querySelector(".window-titlebar");
  const closeBtn = windowElement.querySelector(".close-btn");
  const minimizeBtn = windowElement.querySelector(".minimize-btn");
  const maximizeBtn = windowElement.querySelector(".maximize-btn");

  if (!titlebar || !closeBtn || !minimizeBtn || !maximizeBtn) return;

  // Close button
  closeBtn.addEventListener("click", () => closeWindow(windowElement));

  // Minimize button
  minimizeBtn.addEventListener("click", () => toggleMinimize(windowElement));

  // Maximize button
  maximizeBtn.addEventListener("click", () => toggleMaximize(windowElement));

  // Make window draggable
  makeWindowDraggable(windowElement, titlebar);

  // Add resize handles
  addResizeHandles(windowElement);

  // Focus on click
  windowElement.addEventListener("mousedown", () => focusWindow(windowElement));
}

function addResizeHandles(windowElement) {
  // Create resize handles
  const handles = [
    { class: "right", cursor: "ew-resize" },
    { class: "bottom", cursor: "ns-resize" },
    { class: "corner", cursor: "nwse-resize" },
  ];

  handles.forEach((handle) => {
    const div = document.createElement("div");
    div.className = `resize-handle ${handle.class}`;
    windowElement.appendChild(div);

    div.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      if (windowElement.classList.contains("maximized")) return;

      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = windowElement.offsetWidth;
      const startHeight = windowElement.offsetHeight;

      function resize(moveEvent) {
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;

        if (handle.class === "right" || handle.class === "corner") {
          const newWidth = Math.max(400, startWidth + deltaX);
          windowElement.style.width = newWidth + "px";
        }

        if (handle.class === "bottom" || handle.class === "corner") {
          const newHeight = Math.max(300, startHeight + deltaY);
          windowElement.style.height = newHeight + "px";
        }
      }

      function stopResize() {
        document.removeEventListener("mousemove", resize);
        document.removeEventListener("mouseup", stopResize);
      }

      document.addEventListener("mousemove", resize);
      document.addEventListener("mouseup", stopResize);
    });
  });
}

function makeWindowDraggable(windowElement, handle) {
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;

  handle.addEventListener("mousedown", (e) => {
    // Don't drag if clicking on buttons
    if (e.target.closest(".window-btn")) return;

    // Don't drag if maximized
    if (windowElement.classList.contains("maximized")) return;

    isDragging = true;
    initialX = e.clientX - windowElement.offsetLeft;
    initialY = e.clientY - windowElement.offsetTop;

    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);
  });

  function drag(e) {
    if (!isDragging) return;

    e.preventDefault();
    currentX = e.clientX - initialX;
    currentY = e.clientY - initialY;

    // Keep window within bounds
    const maxX = window.innerWidth - windowElement.offsetWidth;
    const maxY = window.innerHeight - 48 - windowElement.offsetHeight;

    currentX = Math.max(0, Math.min(currentX, maxX));
    currentY = Math.max(0, Math.min(currentY, maxY));

    windowElement.style.left = currentX + "px";
    windowElement.style.top = currentY + "px";
  }

  function stopDrag() {
    isDragging = false;
    document.removeEventListener("mousemove", drag);
    document.removeEventListener("mouseup", stopDrag);
  }
}

export function closeWindow(windowElement) {
  const appName = windowElement.dataset.app;

  // Animate out
  windowElement.style.opacity = "0";
  windowElement.style.transform = "scale(0.9)";
  windowElement.style.transition = "opacity 0.2s ease, transform 0.2s ease";

  setTimeout(() => {
    windowElement.remove();
    delete state.windows[appName];
    removeFromTaskbar(appName);
  }, 200);
}

export function toggleMinimize(windowElement) {
  windowElement.classList.toggle("minimized");
  const appName = windowElement.dataset.app;
  const taskbarApp = document.querySelector(`[data-taskbar-app="${appName}"]`);

  if (windowElement.classList.contains("minimized")) {
    taskbarApp?.classList.remove("active");
  } else {
    taskbarApp?.classList.add("active");
    focusWindow(windowElement);
  }
}

export function toggleMaximize(windowElement) {
  windowElement.classList.toggle("maximized");
}

function focusWindow(windowElement) {
  // Remove focus from all windows
  Object.values(state.windows).forEach((w) => {
    w.style.zIndex = 100;
  });

  // Focus this window
  windowElement.style.zIndex = ++state.zIndexCounter;
  state.activeWindow = windowElement;

  // Update taskbar
  updateTaskbarActive(windowElement.dataset.app);
}
