# EthanOS Portfolio - Complete Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Design](#architecture--design)
3. [File Structure](#file-structure)
4. [Core Systems](#core-systems)
5. [Application Windows](#application-windows)
6. [Games System](#games-system)
7. [Theming & Styling](#theming--styling)
8. [Data Flow](#data-flow)
9. [Adding New Features](#adding-new-features)
10. [Customization Guide](#customization-guide)

---

## Project Overview

**EthanOS** is a portfolio website designed as a fully functional desktop operating system interface. It runs entirely in the browser using vanilla HTML, CSS, and JavaScript with no build process, framework dependencies, or backend services.

### Key Features

- **Desktop Environment**: Full windowing system with draggable, resizable, minimizable, and maximizable windows
- **Boot Animation**: Simulated OS boot screen with loading animation
- **Taskbar**: Shows running apps, live clock, and theme toggles
- **Start Menu**: Quick launcher for all applications
- **Clippy Assistant**: Interactive desktop helper with tips and periodic messages
- **Multiple Apps**: About, Projects, Achievements, Skills, Contact, Games hub, Notes, File Explorer, Algorithm Visualiser, MS Paint, and Settings
- **6 Playable Games**: Snake, Minesweeper, Pong, Chess, Sudoku, Wordle
- **Algorithm Visualiser**: Interactive visualization of 30+ algorithms (sorting, searching, pathfinding, and more)
- **Notes App**: localStorage-based note-taking with auto-save
- **File Explorer**: Simulated file system for browsing and downloading files
- **MS Paint**: Canvas-based drawing application
- **Theme System**: Modern/Windows 95 themes + Day/Night mode
- **Customizable Backgrounds**: 8 different background options
- **Keyboard Shortcuts**: Alt+1-5 for quick app launch, Ctrl+W to close, etc.

### Technology Stack

- **HTML5**: Single-page application with template elements
- **CSS3**: Modular stylesheets (base, windows, apps)
- **Vanilla JavaScript (ES6 Modules)**: No frameworks, transpilers, or bundlers
- **GitHub Pages**: Static hosting (no server-side code)

---

## Architecture & Design

### Core Design Principles

1. **Template-Based Architecture**

   - All app content lives in `<template>` tags in `index.html`
   - Window manager clones templates on-demand
   - No HTML generation in JavaScript (content is declarative)

2. **ES6 Module System**

   - Clean separation of concerns across modules
   - Central state management in `state.js`
   - Window lifecycle managed by `windows.js`
   - Each app and game has its own module

3. **Event-Driven Communication**

   - Custom events for app launching (`open-app` event)
   - Callback-based window management
   - Click/drag handlers for desktop icons

4. **Static Asset Strategy**

   - All content pre-defined in HTML
   - No API calls or dynamic data fetching
   - Resume PDF and images served directly

5. **State Management**
   - Centralized `state.js` for global app state
   - LocalStorage for persisting user preferences (background, theme)
   - Window references stored in `state.windows` object

---

## File Structure

```
.
├── index.html                     # Main HTML file with all templates
├── css/
│   ├── base.css                   # Global styles, layout, boot screen, desktop, taskbar
│   ├── windows.css                # Window UI, dragging, resizing, z-index management
│   └── apps.css                   # App-specific styles (terminal, projects, games, etc.)
├── js/
│   ├── main.js                    # Entry point: boot, start menu, taskbar, keyboard shortcuts
│   ├── state.js                   # Centralized state (windows, theme, day/night mode)
│   ├── windows.js                 # Window manager (open/close/minimize/maximize/focus/drag)
│   ├── desktopIcons.js            # Desktop icon layout, click, and drag handlers
│   ├── taskbar.js                 # Taskbar app buttons (add/remove/update active)
│   ├── clippy.js                  # Clippy assistant logic
│   ├── notesWindow.js             # Notes app logic (localStorage-based)
│   ├── fileExplorerWindow.js     # File Explorer app logic
│   ├── algorithmVisualiserWindow.js # Algorithm Visualiser (30+ algorithms)
│   ├── paintWindow.js             # MS Paint app logic
│   ├── settingsWindow.js          # Settings window logic (theme, background picker)
│   ├── gamesWindow.js             # Games hub launcher (grid of game cards)
│   ├── apps/
│   │   ├── index.js               # Central app registry (all app configs)
│   │   ├── about.js               # About app config
│   │   ├── projects.js            # Projects app config
│   │   ├── achievements.js        # Achievements app config
│   │   ├── skills.js              # Skills app config
│   │   ├── contact.js             # Contact app config
│   │   ├── games.js               # Games hub app config
│   │   ├── notes.js               # Notes app config
│   │   ├── fileExplorer.js        # File Explorer app config
│   │   ├── algorithmVisualiser.js # Algorithm Visualiser app config
│   │   ├── paint.js               # MS Paint app config
│   │   ├── settings.js            # Settings app config
│   │   ├── snakeGame.js           # Snake game config
│   │   ├── minesweeperGame.js     # Minesweeper game config
│   │   ├── pongGame.js            # Pong game config
│   │   ├── chessGame.js           # Chess game config
│   │   ├── sudokuGame.js          # Sudoku game config
│   │   └── wordleGame.js          # Wordle game config
│   └── games/
│       ├── snake.js               # Snake game logic
│       ├── minesweeper.js         # Minesweeper game logic
│       ├── pong.js                # Pong game logic (Canvas-based)
│       ├── chess.js               # Chess game logic
│       ├── sudoku.js              # Sudoku puzzle generator & solver
│       └── wordle.js              # Wordle game logic (loads wordle.txt)
├── files/
│   ├── Ethan Hammond Resume.pdf   # Resume PDF file
│   ├── profile.png                # Profile image
│   └── wordle.txt                 # Word list for Wordle game
├── README.md                      # Project README
├── WARP.md                        # Warp AI guidance
└── DOCUMENTATION.md               # This file (comprehensive documentation)
```

---

## Core Systems

### 1. Boot Screen System (`main.js`, `base.css`)

**Purpose**: Simulates OS startup with animated logo and loading bar.

**How It Works**:

```javascript
// main.js - setupBootScreen()
window.addEventListener("load", () => {
  setTimeout(() => {
    bootScreen.classList.add("hidden"); // Fade out after 2 seconds
    setTimeout(() => bootScreen.remove(), 500); // Remove from DOM after fade
  }, 2000);
});
```

**Visual Elements** (in `index.html`):

- `.boot-logo`: Image logo (profile.png)
- `.boot-title`: "EthanOS" text
- `.boot-loader`: Animated progress bar
- `.boot-text`: "Loading portfolio..." message

**Styling** (`base.css`):

- Fixed overlay with `z-index: 9999`
- CSS animation for loading bar
- Opacity transition for fade-out

---

### 2. Window Management System (`windows.js`)

**Purpose**: Manages the lifecycle of all application windows.

**Key Functions**:

#### `openWindow(appName)`

```javascript
// 1. Check if window already exists → focus it
// 2. Lookup app config from appConfigs
// 3. Clone window template from DOM
// 4. Load app content template
// 5. Set initial position (cascaded)
// 6. Add to DOM and state.windows
// 7. Setup controls (close/minimize/maximize)
// 8. Add to taskbar
// 9. Focus the window
// 10. Run app-specific setup (skills animation, games logic, etc.)
```

#### `closeWindow(windowElement)`

- Remove from `state.windows`
- Remove from taskbar
- Remove from DOM
- Update active window state

#### `toggleMinimize(windowElement)`

- Add/remove `.minimized` class
- Update taskbar button state
- Manage window visibility

#### `toggleMaximize(windowElement)`

- Toggle `.maximized` class
- Save/restore original size and position
- Update window layout

#### `focusWindow(windowElement)`

- Increment `state.zIndexCounter`
- Apply new z-index to window
- Set as `state.activeWindow`
- Update taskbar active state

**Window Controls**:

- **Dragging**: Click and drag titlebar to move window
- **Resizing**: Drag resize handles (right, bottom, corner)
- **Double-click titlebar**: Maximize/restore

---

### 3. Desktop Icons System (`desktopIcons.js`)

**Purpose**: Manages desktop icon layout, clicking, and dragging.

**Auto-Layout Algorithm**:

```javascript
// layoutDesktopIcons()
// 1. Calculate available height (desktop height - taskbar - padding)
// 2. Determine how many icons fit per column
// 3. Position icons in columns from left to right
// 4. Use absolute positioning with calculated top/left
```

**Click vs Drag Detection**:

- Track mouse movement from `mousedown`
- If moved > 5px → Drag mode (reposition icon)
- If moved < 5px AND duration < 300ms → Click (open app)
- Double-click also opens app

**Icon Data Attribute**: Each icon has `data-app="appName"` to identify which app to launch.

---

### 4. Taskbar System (`taskbar.js`, `main.js`)

**Purpose**: Shows running applications and provides quick access.

**Components**:

#### Taskbar Left

- **Start Button**: Opens/closes start menu
- Styled with `🌟 EthanOS` text

#### Taskbar Center

- **App Buttons**: One for each open window
- Click behavior:
  - If minimized → Restore
  - If active → Minimize
  - Otherwise → Focus

#### Taskbar Right

- **Theme Toggle**: Day/Night mode (☀️/🌙 icon)
- **Clock**: Live time updated every second

**Adding/Removing Apps**:

```javascript
addToTaskbar(appName, title, toggleMinimize, focusWindow);
removeFromTaskbar(appName);
updateTaskbarActive(appName); // Highlight active app
```

---

### 5. Start Menu System (`main.js`)

**Purpose**: Quick launcher for all applications.

**Structure** (in `index.html`):

- `.start-menu-header`: User avatar and name
- `.start-menu-apps`: Grid of app launchers
- `.start-menu-footer`: Theme switcher

**Behavior**:

- Toggle visibility with start button
- Close when clicking outside
- Each item has `data-app="appName"`
- Clicking an item opens the app and closes menu

---

### 6. State Management (`state.js`)

**Purpose**: Centralized global state for the entire application.

**State Object**:

```javascript
export const state = {
  windows: {}, // Map of appName → windowElement
  zIndexCounter: 100, // Incrementing z-index for window focus
  activeWindow: null, // Currently focused window element
  theme: "modern", // 'modern' or 'win95'
  dayMode: false, // true = day mode, false = night mode
};
```

**Background Management**:

- `backgrounds`: Object mapping background IDs to CSS values
- `changeBackground(bgType)`: Updates desktop background and saves to localStorage

---

### 7. App Registry System (`js/apps/index.js`)

**Purpose**: Central registry of all available applications.

**App Config Format**:

```javascript
export const aboutApp = {
  id: "about",
  title: "About Me",
  templateId: "about-content", // References <template id="about-content">
};
```

**How It's Used**:

- `windows.js` imports `appConfigs` from `apps/index.js`
- When opening a window, looks up config by app ID
- Uses `templateId` to find the content template in HTML

**Adding a New App** requires:

1. Create app config file in `js/apps/`
2. Export app object with `id`, `title`, `templateId`
3. Import and add to `apps` array in `js/apps/index.js`
4. Create corresponding `<template>` in `index.html`
5. Add desktop icon and start menu item in `index.html`

---

## Application Windows

### About Me Window

- **Template**: `about-content`
- **Style**: Terminal aesthetic with prompt and output
- **Content**: Name, role, bio, skills list
- **Special Features**: Blinking cursor animation

### Projects Window

- **Template**: `projects-content`
- **Layout**: CSS Grid with project cards
- **Content**: Project title, tags, description, links to GitHub/README
- **Cards**: 3 projects (Quantum Classifiers, Focus Boardgame, Family Restaurant)

### Skills Window

- **Template**: `skills-content`
- **Layout**: Skill categories with animated bars
- **Animation**: Bars animate from 0% to `data-level` value on window open
- **Categories**: Languages & Core, Frameworks & Tools

### Notes Window

- **Template**: `notes-content`
- **Layout**: List of note cards with title, content, and date
- **Features**: 
  - Create, edit, and delete notes
  - Auto-save to localStorage on every change
  - Notes persist across page refreshes
  - Date stamps for each note
- **Storage**: Uses browser localStorage API
- **Logic**: Managed by `notesWindow.js`

### File Explorer Window

- **Template**: `file-explorer-content`
- **Layout**: Split view with file tree on left, file viewer on right
- **Features**:
  - Navigate through simulated file system
  - View images, text files, and download PDFs
  - Path bar showing current location
  - Back navigation support
- **File System**: JSON-based structure defined in `fileExplorerWindow.js`
- **Logic**: Managed by `fileExplorerWindow.js`

### Algorithm Visualiser Window

- **Template**: `algorithm-visualiser-content`
- **Layout**: Canvas-based visualization with controls
- **Features**:
  - 30+ algorithms organized by category
  - Play/Pause/Reset controls
  - Adjustable animation speed
  - Step-by-step visualization
- **Categories**:
  - **Sorting**: Bubble, Insertion, Selection, Merge, Quick Sort
  - **Search**: Linear, Binary, Jump, Interpolation, Exponential, Stalin Sort
  - **Pathfinding**: Dijkstra's, A*, Bellman-Ford, Floyd-Warshall, Prim's MST, Kruskal's MST
  - **Other**: Top K Elements, Backtracking (N-Queens), Sliding Window, Huffman Coding, Euclid's Algorithm, Union Find, Kadane's Algorithm, Floyd's Cycle Detection, KMP Pattern Matching, Quick Select, Boyer-Moore, Maze Generation
- **Extensibility**: Easy to add custom algorithms (see "Adding New Algorithms" section)
- **Logic**: Managed by `algorithmVisualiserWindow.js`

### MS Paint Window

- **Template**: `paint-content`
- **Layout**: Toolbar with controls and canvas
- **Features**:
  - Brush and eraser tools
  - Color picker
  - Adjustable brush size
  - Save canvas as PNG
  - Clear canvas option
  - Touch support for mobile devices
- **Technology**: HTML5 Canvas API
- **Logic**: Managed by `paintWindow.js`

### Contact Window

- **Template**: `contact-content`
- **Layout**: Grid of contact cards
- **Links**: GitHub, LinkedIn, Email
- **Icons**: Emoji-based contact method icons

### Games Hub Window

- **Template**: `games-content`
- **Layout**: 2x4 grid of game cards
- **Each Card**: Icon, title, description, "Open" button
- **Launches**: Individual game windows when clicked

### Settings Window

- **Template**: `settings-content`
- **Sections**:
  - Appearance (theme toggle, day/night toggle)
  - Desktop (background picker with color swatches)
  - About (version info)
- **Interactivity**: Managed by `settingsWindow.js`
- **Background Picker**: Clickable color swatches that update desktop

### Clippy Assistant

- **Not a Window**: Floating desktop element
- **Features**:
  - Shows helpful tips and messages
  - Click to show/hide tips
  - Auto-shows tips periodically
  - Draggable around desktop
  - Auto-hides after 5 seconds
- **Initialization**: Called from `main.js` on DOMContentLoaded
- **Logic**: Managed by `clippy.js`
- **Styling**: Defined in `css/base.css`

---

## Games System

All games follow a consistent pattern:

### Game Architecture

1. **App Config** (in `js/apps/`)

   - Defines game ID, title, template ID
   - Example: `snakeGameApp.js`

2. **Template** (in `index.html`)

   - Game UI structure (grid, canvas, controls)
   - Example: `<template id="snake-game-content">`

3. **Game Logic** (in `js/games/`)
   - Core gameplay implementation
   - Setup function called by window manager
   - Example: `snake.js` → `setupSnakeGameWindow(windowElement)`

### Individual Games

#### 1. Snake (`js/games/snake.js`)

- **Grid-based**: 15 rows × 20 columns
- **Controls**: Arrow keys or WASD
- **Logic**: Snake movement, collision detection, food spawning
- **Score**: Increments with each food eaten

#### 2. Minesweeper (`js/games/minesweeper.js`)

- **Grid**: 10×10 with 15 mines
- **Controls**: Left-click reveal, right-click flag
- **Logic**: Recursive flood-fill for blank cells, win/lose detection
- **Counter**: Shows remaining mines

#### 3. Pong (`js/games/pong.js`)

- **Canvas-based**: 480×300 pixel canvas
- **Controls**: W/S or ↑/↓ for player paddle
- **AI**: Computer-controlled opponent
- **Physics**: Ball bouncing, collision detection
- **Score**: First to X points (no limit set)

#### 4. Chess (`js/games/chess.js`)

- **Board**: 8×8 with standard chess layout
- **Moves**: Click piece, then destination
- **Validation**: Implements chess movement rules
- **Turn-based**: Alternates white/black
- **No AI**: Two-player only

#### 5. Sudoku (`js/games/sudoku.js`)

- **Grid**: 9×9 with input fields
- **Generator**: Creates solvable puzzles with random difficulty
- **Auto-Solve**: Button to reveal solution
- **Validation**: Checks for conflicts as you type

#### 6. Wordle (`js/games/wordle.js`)

- **Word List**: Loads from `files/wordle.txt`
- **Grid**: 6 guesses × 5 letters
- **Input**: Text field + "Guess" button
- **Feedback**: Color-coded tiles (green/yellow/gray)
- **Dictionary**: Pre-loaded word list fetched on setup

---

## Theming & Styling

### CSS Architecture

#### `base.css` - Foundation

- CSS reset
- CSS custom properties (CSS variables) in `:root`
- Boot screen styles
- Desktop and icon styles
- Taskbar layout
- Start menu layout
- Day mode overrides

#### `windows.css` - Window System

- Window frame styling (titlebar, controls, borders)
- Window states (focused, minimized, maximized)
- Dragging visual feedback
- Resize handles
- Z-index management
- Taskbar app buttons
- Responsive window sizing

#### `apps.css` - Application Content

- Terminal styling (About window)
- Project cards grid
- Skill bars animation
- Contact cards
- Games hub grid
- Settings sections
- Individual game styles (snake grid, chess board, etc.)

### Theme System

#### Modern Theme (Default)

- Clean, modern aesthetic
- Glassmorphism effects (backdrop-filter blur)
- Rounded corners
- Subtle shadows
- Blue accent colors (`#2563eb`)

#### Windows 95 Theme

- Activated by adding `.win95-theme` class to `<body>`
- Square corners, beveled borders
- System font change
- Gray color scheme
- Classic 3D button effects
- Managed by theme switcher in settings/start menu

#### Day/Night Mode

- Toggled by `.day-mode` class on `<body>`
- Changes CSS variables:
  - `--background`: Dark → Light blue
  - `--desktop-bg`: Dark gradient → Light blue gradient
  - `--taskbar-bg`: Dark → Light blue translucent
- Independent of Modern/Win95 theme
- Icon changes: 🌙 → ☀️

### CSS Custom Properties

```css
:root {
  --primary-color: #2563eb;
  --secondary-color: #1e40af;
  --text-color: #1f2937;
  --text-light: #6b7280;
  --background: #0f172a;
  --desktop-bg: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  --window-bg: rgba(255, 255, 255, 0.95);
  --window-border: rgba(0, 0, 0, 0.1);
  --taskbar-bg: rgba(15, 23, 42, 0.8);
  --glass-bg: rgba(255, 255, 255, 0.1);
  --shadow: rgba(0, 0, 0, 0.3);
}
```

These variables are used throughout all CSS files for consistent theming.

---

## Data Flow

### Opening an Application Window

```
User clicks desktop icon
  ↓
desktopIcons.js detects click
  ↓
Calls onOpenApp(appName) callback
  ↓
main.js calls openWindow(appName)
  ↓
windows.js → openWindow(appName)
  ↓
1. Check if window exists in state.windows
2. Lookup appConfig from apps/index.js
3. Clone window template from DOM
4. Clone app content template from DOM
5. Insert content into window
6. Set position and size
7. Add to DOM
8. Store in state.windows
9. Setup window controls (drag, resize, close, etc.)
10. Call addToTaskbar(appName)
  ↓
taskbar.js creates taskbar button
  ↓
windows.js calls focusWindow(windowElement)
  ↓
Window appears focused with highest z-index
  ↓
If app has special setup (games, settings), run setup function
```

### Closing a Window

```
User clicks close button (×)
  ↓
windows.js → closeWindow(windowElement)
  ↓
1. Get appName from windowElement.dataset.app
2. Delete state.windows[appName]
3. Call removeFromTaskbar(appName)
4. If this was activeWindow, set activeWindow = null
5. Remove windowElement from DOM
  ↓
Taskbar button disappears
  ↓
Window removed from screen
```

### Theme Toggle Flow

```
User clicks theme toggle in taskbar or settings
  ↓
main.js or settingsWindow.js toggles state.dayMode
  ↓
Adds/removes 'day-mode' class on <body>
  ↓
CSS variables update (--background, --desktop-bg, etc.)
  ↓
All elements using these variables re-render with new colors
  ↓
Theme icon updates (🌙 ↔ ☀️)
```

### Background Change Flow

```
User clicks background swatch in Settings
  ↓
settingsWindow.js calls changeBackground(bgType)
  ↓
state.js → changeBackground(bgType)
  ↓
1. Lookup background value from backgrounds object
2. Update desktop.style.background
3. Save to localStorage.setItem('desktop-background', bgType)
  ↓
Desktop background updates immediately
  ↓
On page reload, main.js reads from localStorage and applies saved background
```

---

## Adding New Features

### Adding a New Application

**Step 1**: Create app template in `index.html`

```html
<template id="my-app-content">
  <div class="my-app-container">
    <h3>My New App</h3>
    <p>App content goes here</p>
  </div>
</template>
```

**Step 2**: Create app config in `js/apps/myApp.js`

```javascript
export const myApp = {
  id: "my-app",
  title: "My New App",
  templateId: "my-app-content",
};
```

**Step 3**: Register app in `js/apps/index.js`

```javascript
import { myApp } from "./myApp.js";

const apps = [
  aboutApp,
  projectsApp,
  // ... other apps
  myApp, // Add here
  settingsApp,
];
```

**Step 4**: Add desktop icon in `index.html`

```html
<div class="desktop-icon" data-app="my-app">
  <div class="icon-image">🆕</div>
  <span class="icon-label">My New App</span>
</div>
```

**Step 5**: Add start menu item in `index.html`

```html
<div class="start-menu-item" data-app="my-app">
  <span class="start-menu-icon">🆕</span>
  <span>My New App</span>
</div>
```

**Step 6** (Optional): Add styling in `css/apps.css`

```css
.my-app-container {
  padding: 2rem;
}
```

**Step 7** (Optional): Add setup logic in `windows.js`

```javascript
if (appName === "my-app") {
  setTimeout(() => setupMyApp(windowElement), 50);
}
```

---

### Adding a New Game

Follow the same steps as adding an app, but:

1. Create game logic file in `js/games/myGame.js`
2. Export `setupMyGameWindow(windowElement)` function
3. Import and call in `windows.js` conditional
4. Add game launcher card to `games-content` template
5. Wire up button in `gamesWindow.js`

**Example Game Setup Function**:

```javascript
export function setupMyGameWindow(windowElement) {
  const gameGrid = windowElement.querySelector(".my-game-grid");
  const resetBtn = windowElement.querySelector(".my-game-reset-btn");

  let gameState = initializeGame();

  function initializeGame() {
    // Setup game logic
  }

  function render() {
    // Draw game to DOM
  }

  resetBtn.addEventListener("click", () => {
    gameState = initializeGame();
    render();
  });

  render();
}
```

---

### Adding a New Background Option

**Step 1**: Add to `backgrounds` object in `state.js`

```javascript
export const backgrounds = {
  // ... existing backgrounds
  "gradient-custom": "linear-gradient(135deg, #ff0000 0%, #0000ff 100%)",
};
```

**Step 2**: Add swatch to Settings template in `index.html`

```html
<div
  class="background-option"
  data-bg="gradient-custom"
  style="background: linear-gradient(135deg, #ff0000 0%, #0000ff 100%)"
></div>
```

**Step 3**: Wire up in `settingsWindow.js` (already handles all `.background-option` elements automatically)

---

## Customization Guide

### Updating Personal Information

#### About Window

Edit `index.html` → `<template id="about-content">`:

- Name, role, bio on lines 148-150
- Skills list on line 157

#### Projects Window

Edit `index.html` → `<template id="projects-content">`:

- Each `.project-item` is a project card (lines 169-213)
- Update title, tags, description, links

#### Contact Window

Edit `index.html` → `<template id="contact-content">`:

- Update intro text (line 300)
- Update contact links (lines 303-323)

#### Skills/Visualiser Windows

Edit `index.html` → skill bar elements:

- Change skill names
- Adjust `data-level` attribute (0-100)
- Add/remove skill categories

---

### Changing Colors

**Primary/Accent Color**:
Edit `css/base.css` → `:root`:

```css
--primary-color: #2563eb; /* Change this */
--secondary-color: #1e40af; /* And this for hover state */
```

**Text Colors**:

```css
--text-color: #1f2937; /* Main text */
--text-light: #6b7280; /* Secondary text */
```

**Background**:

```css
--background: #0f172a; /* Solid background color */
--desktop-bg: linear-gradient(
  135deg,
  #1e293b 0%,
  #0f172a 100%
); /* Desktop gradient */
```

---

### Adding Desktop Icons from Files

To add a resume icon or README icon:

**Step 1**: Add file to `files/` directory (already done for resume)

**Step 2**: Create new app that opens/downloads the file

```javascript
// js/apps/resume.js
export const resumeApp = {
  id: "resume",
  title: "Resume",
  templateId: "resume-content",
};
```

**Step 3**: Create template that links to PDF

```html
<template id="resume-content">
  <div class="resume-container">
    <iframe
      src="files/Ethan Hammond Resume.pdf"
      style="width:100%; height:100%; border:none;"
    ></iframe>
  </div>
</template>
```

**Step 4**: Add desktop icon and register app (see "Adding a New Application")

---

### Keyboard Shortcuts

Current shortcuts (defined in `main.js` → `setupKeyboardShortcuts()`):

- **Alt+1**: Open About
- **Alt+2**: Open Projects
- **Alt+3**: Open Skills
- **Alt+4**: Open Contact
- **Ctrl+W**: Close active window
- **Ctrl+M**: Minimize active window
- **F11**: Maximize active window
- **Escape**: Close start menu
- **Ctrl+Space**: Toggle start menu

To add new shortcuts, edit the `keydown` event listener in `setupKeyboardShortcuts()`.

---

## Development Workflow

### Local Development

```bash
# Option 1: Open directly
open index.html

# Option 2: Python server
python3 -m http.server 8000

# Option 3: Node.js serve
npx serve
```

### Testing Changes

1. Edit HTML/CSS/JS files
2. Refresh browser (hard refresh with Cmd+Shift+R on Mac)
3. Check browser console for errors
4. Test window management, games, themes

### Deployment

```bash
git add .
git commit -m "Your changes"
git push origin main
```

GitHub Pages auto-deploys from `main` branch.
Site live at: https://ethanzebedee.github.io

---

## Common Issues & Troubleshooting

### Windows Not Opening

- Check browser console for errors
- Verify app is registered in `js/apps/index.js`
- Verify template exists in `index.html` with correct ID
- Check `data-app` attribute matches app ID

### Games Not Working

- Check if game setup function is imported in `windows.js`
- Verify game logic file exists in `js/games/`
- Check for JavaScript errors in console
- For Wordle, verify `files/wordle.txt` exists

### Styling Issues

- Check CSS file load order in `index.html` (base → windows → apps)
- Verify CSS custom properties are defined in `:root`
- Check for conflicting CSS rules
- Use browser DevTools to inspect computed styles

### Desktop Icons Overlapping

- Check `layoutDesktopIcons()` is called in `desktopIcons.js`
- Verify taskbar height calculation
- Adjust spacing variables in `layoutDesktopIcons()`

### Theme Not Persisting

- Check localStorage in browser DevTools (Application tab)
- Verify `localStorage.setItem()` calls in `state.js`
- Check load logic in `main.js`

---

## Performance Considerations

### Boot Screen Optimization

- Uses CSS animations (GPU accelerated)
- Removed from DOM after animation completes
- 2-second delay balances UX and performance

### Window Management

- Windows use absolute positioning (no layout reflow)
- Z-index increments rather than sorting
- Minimized windows hidden with `display: none`

### Game Performance

- Canvas-based games (Pong) use `requestAnimationFrame()`
- DOM-based games (Snake) use `setInterval()` with frame limiting
- Games pause/cleanup on window close

### Lazy Loading

- Wordle word list fetched only when game opens
- Game logic only initializes when window opens

---

## Algorithm Visualiser System

The Algorithm Visualiser is one of the most comprehensive features, showcasing 30+ algorithms with interactive visualizations.

### Architecture

The visualiser uses a consistent interface for all algorithms:

```javascript
{
  step: () => boolean,    // Returns true when complete
  reset: () => void,      // Resets to initial state
  setSpeed: (speed) => void, // Updates animation speed
  stop: () => void        // Cleanup (optional)
}
```

### Adding New Algorithms

To add a custom algorithm:

1. **Add to algorithms registry** in `algorithmVisualiserWindow.js`:
```javascript
const algorithms = {
  // ... existing algorithms
  "my-algorithm": {
    name: "My Algorithm",
    category: "Sorting", // or "Search", "Pathfinding", "Other"
    setup: () => setupMyAlgorithm(visualiserCanvas),
  },
};
```

2. **Implement setup function**:
```javascript
function setupMyAlgorithm(canvas) {
  const ctx = canvas.getContext("2d");
  // ... initialization code
  
  function step() {
    // One step of algorithm
    // Return true when complete, false otherwise
  }
  
  function reset() {
    // Reset to initial state
  }
  
  function setSpeed(speed) {
    // Update speed if needed
  }
  
  return { step, reset, setSpeed, stop: () => {} };
}
```

3. **The algorithm will automatically appear** in the dropdown organized by category.

### Algorithm Categories

- **Sorting**: Visual array sorting algorithms
- **Search**: Array searching algorithms
- **Pathfinding**: Graph traversal and shortest path algorithms
- **Other**: Miscellaneous algorithms (compression, math, string matching, etc.)

---

## Future Enhancement Ideas

Potential additions (constrained to static hosting):

### Applications

- **Terminal**: Interactive command line with custom commands
- **Music Player**: Audio file playback
- **Video Player**: Video playback interface
- **Browser**: Embedded iframe for web browsing (with limitations)
- **Certifications**: Display professional certifications
- **Calendar**: Date and event management

### Enhancements

- **Sound Effects**: Window open/close, clicks, game sounds
- **Window Snapping**: Snap to edges like Windows 11
- **Virtual Desktops**: Multiple desktop workspaces
- **Right-click Menus**: Context menus for icons and windows
- **Icon Auto-Arrange**: Grid snapping for icons
- **Search**: Start menu search for apps
- **Widget Bar**: Sidebar with widgets (weather, calendar, etc.)
- **More Algorithms**: Additional algorithm visualizations
- **Algorithm Comparison**: Side-by-side algorithm performance comparison

---

## Credits & License

**Built by**: Ethan Hammond  
**Website**: https://ethanzebedee.github.io  
**GitHub**: https://github.com/ethanzebedee  
**Email**: ethan@hammond.ie

**Technology**: Vanilla HTML5, CSS3, JavaScript (ES6 Modules)  
**Hosting**: GitHub Pages  
**License**: © 2025 Ethan Hammond

---

## Quick Reference

### File You'll Edit Most Often

- `index.html` - Update content, add apps, change text
- `css/base.css` - Change colors, fonts, global styles
- `css/apps.css` - Style specific applications

### Files You'll Rarely Edit

- `js/windows.js` - Core window management (stable)
- `js/main.js` - Boot and initialization (stable)
- `js/state.js` - State management (stable)

### Adding Content Checklist

- [ ] Create template in `index.html`
- [ ] Create app config in `js/apps/`
- [ ] Register in `js/apps/index.js`
- [ ] Add desktop icon in `index.html`
- [ ] Add start menu item in `index.html`
- [ ] Add styles in `css/apps.css` (if needed)
- [ ] Add setup logic in `windows.js` (if needed)

---

**Last Updated**: January 2025  
**Version**: 2.0.0
