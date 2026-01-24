# Ethan Hammond - Portfolio (EthanOS)

Personal portfolio website presented as a mini desktop operating system and hosted on GitHub Pages.

The site is fully static (HTML/CSS/JS only) and is designed around the constraints of GitHub Pages: no backend, no server‑side code, and no custom build pipeline.

## 🚀 Quick Start

This is a static site that requires **no build process**. You can open it directly or run a simple static server.

### Local Development

1. Clone the repository
2. From the project root, either:

   - Open `index.html` directly in your browser, **or**
   - Run a local server:

   ```bash
   python3 -m http.server 8000
   # or
   npx serve
   ```

3. Visit `http://localhost:8000` in your browser.

### Deployment

GitHub Pages automatically deploys from the `main` branch. Simply push your changes:

```bash
git add .
git commit -m "Update portfolio"
git push origin main
```

Your site will be live at: https://ethanzebedee.github.io

---

## 📁 File Structure

The project is intentionally flat and static so it works seamlessly with GitHub Pages.

```text
.
├── index.html              # Main HTML file and all "app" templates
├── css/
│   ├── base.css            # Global styles, layout, desktop, boot screen, taskbar, Clippy
│   ├── windows.css         # Window manager UI, taskbar apps, dragging, resizing
│   └── apps.css            # App-specific styles (all applications)
├── js/
│   ├── main.js             # Entry point: boot screen, start menu, taskbar, theme toggles, keyboard shortcuts
│   ├── windows.js          # Window manager (open/close/minimise/maximise, z-index, dragging)
│   ├── desktopIcons.js     # Desktop icon behaviour and wiring to app windows
│   ├── state.js            # Central UI state (theme, day/night, background selection)
│   ├── clippy.js           # Clippy assistant logic
│   ├── notesWindow.js      # Notes app (localStorage-based)
│   ├── fileExplorerWindow.js # File Explorer app
│   ├── algorithmVisualiserWindow.js # Algorithm Visualiser (30+ algorithms)
│   ├── paintWindow.js      # MS Paint app
│   ├── settingsWindow.js   # Settings window logic
│   ├── gamesWindow.js      # Games hub launcher
│   ├── apps/               # App configurations
│   └── games/              # Individual game implementations
├── files/
│   ├── Ethan Hammond Resume.pdf # Resume PDF
│   ├── profile.png         # Profile image
│   └── wordle.txt          # Word list for Wordle game
├── README.md               # Project documentation (this file)
├── DOCUMENTATION.md        # Comprehensive technical documentation
└── .gitignore              # Git ignore rules
```

Key design choice: **all "apps" (About, Projects, Skills, Contact, Games, Settings, Notes, File Explorer, Algorithm Visualiser, Paint) are defined as `<template>` blocks inside `index.html`**. The window manager in `js/` clones these templates into movable windows at runtime.

---

## 🧱 Design Decisions & GitHub Pages Limitations

This project is built specifically to fit within GitHub Pages' static hosting model. That leads to a few deliberate decisions:

### 1. Fully Static Frontend Only

- **No backend / server‑side code**: GitHub Pages only serves static files, so all behaviour is implemented in vanilla JavaScript.
- All data (bio, skills, projects, contact info) lives in `index.html` as HTML templates instead of being fetched from an API or database.
- Any dynamic behaviour (games, visualisers, notes) runs entirely in the browser using localStorage for persistence.

### 2. No Custom Build Step

- The site is shipped as plain HTML/CSS/JS; there is **no bundler** (Webpack, Vite, etc.) and no transpilation (e.g. TypeScript → JS).
- File paths in `index.html` and `js/` are **relative and stable** so GitHub Pages can serve them directly without build‑time rewriting.
- Keeping everything unbundled makes debugging via browser dev tools straightforward when the site is live on GitHub Pages.

### 3. Single HTML Entry Point

- GitHub Pages serves `index.html` at the root. To avoid routing issues, the entire "OS" experience lives in this one file.
- New "apps" are added by:
  - Creating a new `<template id="app-name-content">` in `index.html`, and
  - Wiring a desktop icon / start‑menu item to that template via `desktopIcons.js` and `windows.js`.
- This keeps navigation and state entirely client‑side without needing server‑side routes.

### 4. Static Assets Only

- The resume is included as `files/Ethan Hammond Resume.pdf` and can be accessed via the File Explorer or Resume desktop icon.
- Any media (images, audio, video) should be checked into the repo and referenced by relative paths; there is no runtime upload or storage.

### 5. Email & Dynamic Integrations

- Because GitHub Pages cannot run server code, **contact** is currently handled via `mailto:` links and external profiles (GitHub, LinkedIn).
- Richer features like an in‑browser email client, auth, or server-side persistence would require an external API / serverless backend and are not implemented here yet.

---

## 📝 Customisation Guide

### Updating Personal Information

Most of the visible content lives in `index.html` inside `<template>` elements:

- **About** window: update your role, bio, and highlighted skills.
- **Projects** window: edit project cards, descriptions, tech tags, and GitHub/README links.
- **Skills**: adjust categories, labels, and skill levels (`data-level` attributes) to match your stack.
- **Contact** window: update GitHub, LinkedIn, and email links.

### Theming & Layout

- Global colours and layout primitives live in `css/base.css`.
- Window styling and the taskbar live in `css/windows.css`.
- App‑specific styling (terminal look, cards, grids) is in `css/apps.css`.
- Theme toggles (Modern vs Windows 95, Day vs Night) and wallpaper selection are managed in `js/main.js` and `js/state.js`.

When customising, you generally:

1. Edit content in `index.html` (templates).
2. Adjust visuals in the appropriate CSS file.
3. If you add a new app, hook it up in `desktopIcons.js` / `windows.js` so it opens in a window.

---

## ✨ Current Features

### Core Desktop Environment
- Desktop‑style UI with draggable, focusable windows
- Boot screen with animated loading
- Taskbar with running apps, live clock, and theme toggles
- Start menu with quick app launchers
- **Clippy Assistant**: Interactive desktop helper with tips and jokes
- Multiple themes (Modern / Windows 95) and day/night mode
- Customisable desktop backgrounds (8 options)

### Applications
- **About Me**: Terminal-style bio and experience
- **Projects**: Grid of project cards with links
- **Achievements**: Leadership and awards showcase
- **Skills**: Animated skill bars
- **Contact**: Links to GitHub, LinkedIn, and email
- **Games Hub**: Launcher for 6 playable games (Snake, Minesweeper, Pong, Chess, Sudoku, Wordle)
- **Notes**: localStorage-based note-taking app with auto-save
- **File Explorer**: Simulated file system for browsing and downloading files
- **Algorithm Visualiser**: Interactive visualization of 30+ algorithms including:
  - **Sorting**: Bubble, Insertion, Selection, Merge, Quick Sort
  - **Search**: Linear, Binary, Jump, Interpolation, Exponential, Stalin Sort
  - **Pathfinding**: Dijkstra's, A*, Bellman-Ford, Floyd-Warshall, Prim's MST, Kruskal's MST
  - **Other**: Top K Elements, Backtracking (N-Queens), Sliding Window, Huffman Coding, Euclid's Algorithm, Union Find, Kadane's Algorithm, Floyd's Cycle Detection, KMP Pattern Matching, Quick Select, Boyer-Moore, Maze Generation
- **MS Paint**: Canvas-based drawing application with brush, eraser, color picker, and save functionality
- **Settings**: Theme and background customization
- **Resume**: Direct PDF download from desktop

### Games
- **Snake**: Classic snake game with arrow keys/WASD controls
- **Minesweeper**: Grid-based puzzle with flagging
- **Pong**: Canvas-based paddle game with AI opponent
- **Chess**: Full chess board with move validation
- **Sudoku**: Puzzle generator with auto-solve
- **Wordle**: Word guessing game with color-coded feedback

### Keyboard Shortcuts
- Alt+1-5: Quick app launch
- Ctrl+W: Close active window
- Ctrl+M: Minimize active window
- F11: Maximize active window
- Escape: Close start menu
- Ctrl+Space: Toggle start menu

### Technical Features
- No build process required; works out‑of‑the‑box on GitHub Pages
- Fully responsive design
- localStorage persistence for notes and preferences
- Extensible algorithm visualiser architecture

---

## 🚧 Future Enhancements

Potential additions (all constrained to static hosting):

- Video player app
- Music player app
- Certifications showcase app
- Promises / async‑await visualiser
- Optional sound effects and background music
- Window snapping (like Windows 11)
- Virtual desktops
- Right-click context menus
- Start menu search functionality

---

## 👀 For Recruiters

A quick guide to the most relevant parts of this portfolio:

### Experience & Impact

- Open the **About Me** icon or app to see a short summary of my role as an Associate Software Engineer at Optum.
- Open the **Skills** app to see my core stack (React, TypeScript, C#/.NET, SQL, Python) and areas of focus.

### Projects / Code Samples

- Open the **Projects** app (desktop icon or via the Start menu) for a curated list of projects.
- Each project card links directly to the **GitHub repo** and **README** with implementation details and context.

### Technical Skills Demonstration

- **Algorithm Visualiser**: Showcases understanding of fundamental algorithms and data structures with 30+ interactive visualizations
- **File Explorer**: Demonstrates UI/UX design and state management
- **Notes App**: Shows localStorage usage and data persistence
- **MS Paint**: Canvas API and graphics programming
- **Games**: Interactive JavaScript game development

### Resume & Contact

- The PDF `Ethan Hammond Resume.pdf` is accessible via the **Resume** desktop icon or File Explorer
- The **Contact** app includes links to my GitHub profile, LinkedIn (`linkedin.com/in/ethanzebedee`) and email (`ethan@hammond.ie`)

If you only have a couple of minutes, visiting **Projects**, **About**, **Algorithm Visualiser**, and **Contact** in the live site will give you a good picture of what I work on and how I work.

---

## 🛠️ Tech Stack

- **HTML5**: Single-page application with template elements
- **CSS3**: Modular stylesheets with CSS custom properties
- **Vanilla JavaScript (ES6 Modules)**: No frameworks, transpilers, or bundlers
- **Canvas API**: For games and algorithm visualizations
- **localStorage API**: For data persistence
- **GitHub Pages**: Static hosting (no server-side code)

---

## 📚 Documentation

For detailed technical documentation, architecture details, and development guides, see [DOCUMENTATION.md](./DOCUMENTATION.md).
