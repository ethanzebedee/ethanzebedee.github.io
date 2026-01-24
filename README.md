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
├── index.html              # Main HTML file and all "app" templates (About, Projects, Skills, etc.)
├── css/
│   ├── base.css            # Global styles, layout, desktop, boot screen, taskbar
│   ├── windows.css         # Window manager UI, taskbar apps, dragging, resizing
│   └── apps.css            # App‑specific styles (terminal, projects grid, skills, games, settings, contact)
├── js/
│   ├── main.js             # Entry point: boot screen, start menu, taskbar, theme toggles, keyboard shortcuts
│   ├── windows.js          # Window manager (open/close/minimise/maximise, z‑index, dragging)
│   ├── desktopIcons.js     # Desktop icon behaviour and wiring to app windows
│   └── state.js            # Central UI state (theme, day/night, background selection)
├── Ethan Hammond Resume.pdf# Resume file served directly by GitHub Pages
├── README.md               # Project documentation (this file)
├── WARP.md                 # Warp AI guidance
└── .gitignore              # Git ignore rules
```

Key design choice: **all "apps" (About, Projects, Skills, Contact, Games, Settings) are defined as `<template>` blocks inside `index.html`**. The window manager in `js/` clones these templates into movable windows at runtime.

---

## 🧱 Design Decisions & GitHub Pages Limitations

This project is built specifically to fit within GitHub Pages’ static hosting model. That leads to a few deliberate decisions:

### 1. Fully Static Frontend Only

- **No backend / server‑side code**: GitHub Pages only serves static files, so all behaviour is implemented in vanilla JavaScript.
- All data (bio, skills, projects, contact info) lives in `index.html` as HTML templates instead of being fetched from an API or database.
- Any future dynamic behaviour (e.g. games, visualisers) must run entirely in the browser.

### 2. No Custom Build Step

- The site is shipped as plain HTML/CSS/JS; there is **no bundler** (Webpack, Vite, etc.) and no transpilation (e.g. TypeScript → JS).
- File paths in `index.html` and `js/` are **relative and stable** so GitHub Pages can serve them directly without build‑time rewriting.
- Keeping everything unbundled makes debugging via browser dev tools straightforward when the site is live on GitHub Pages.

### 3. Single HTML Entry Point

- GitHub Pages serves `index.html` at the root. To avoid routing issues, the entire "OS" experience lives in this one file.
- New "apps" (e.g. Experience, Achievements, Notes) are added by:
  - Creating a new `<template id="app-name-content">` in `index.html`, and
  - Wiring a desktop icon / start‑menu item to that template via `desktopIcons.js` and `windows.js`.
- This keeps navigation and state entirely client‑side without needing server‑side routes.

### 4. Static Assets Only

- The resume is included as `Ethan Hammond Resume.pdf` in the project root so GitHub Pages can serve it as a direct download or link.
- Any future media (images, audio, video) should be checked into the repo and referenced by relative paths; there is no runtime upload or storage.

### 5. Email & Dynamic Integrations

- Because GitHub Pages cannot run server code, **contact** is currently handled via `mailto:` links and external profiles (GitHub, LinkedIn).
- Richer features like an in‑browser email client, auth, or persistence would require an external API / serverless backend and are not implemented here yet.

---

## 📝 Customisation Guide

### Updating Personal Information

Most of the visible content lives in `index.html` inside `<template>` elements:

- **About** window: update your role, bio, and highlighted skills.
- **Projects** window: edit project cards, descriptions, tech tags, and GitHub/README links.
- **Skills / Experience Visualiser**: adjust categories, labels, and skill levels (`data-level` attributes) to match your stack.
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

- Desktop‑style UI with draggable, focusable windows
- Boot screen and taskbar with live clock
- Start menu with quick app launchers
- Multiple themes (Modern / Windows 95) and day/night mode
- Customisable desktop backgrounds
- About, Projects, Skills, Experience Visualiser, Contact, Games (stubs), and Settings windows
- No build process required; works out‑of‑the‑box on GitHub Pages

---

## 🚧 Roadmap / Ideas

Some planned or potential enhancements (all constrained to what’s possible on static hosting):

- Algorithm visualiser app for sorting/search/pathfinding
- Promises / async‑await visualiser
- Notes app and simple file explorer simulated on the client
- Optional sound effects and background music
- In‑window README / help viewer for explaining the OS
- Add Resume pdf to desktop
- Add certifications app
- Add readme with description of project on desktop
- Add file explorer
- Add Notes app
- Add MSPaint
- Add Download resume function within about me
- Add Clippy
- Add video player function
- Add a browser?

---

## 👀 For Recruiters

A quick guide to the most relevant parts of this portfolio:

- **Experience & Impact**

  - Open the **About Me** icon or app to see a short summary of my role as an Associate Software Engineer at Optum.
  - Open the **Skills** and **Experience Visualiser** apps to see my core stack (React, TypeScript, C#/.NET, SQL, Python) and areas of focus.

- **Projects / Code Samples**

  - Open the **Projects** app (desktop icon or via the Start menu) for a curated list of projects.
  - Each project card links directly to the **GitHub repo** and **README** with implementation details and context.

- **Resume & Contact**
  - The PDF `Ethan Hammond Resume.pdf` is stored at the repo root and can be served directly by GitHub Pages.
  - The **Contact** app includes links to my GitHub profile, LinkedIn (`linkedin.com/in/ethanzebedee`) and email (`ethan@hammond.ie`).

If you only have a couple of minutes, visiting **Projects**, **About**, and **Contact** in the live site will give you a good picture of what I work on and how I work.

---

## 🛠️ Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES modules)
