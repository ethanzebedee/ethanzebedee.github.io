// OS Portfolio - Window Management System

// State management
const state = {
  windows: {},
  zIndexCounter: 100,
  activeWindow: null,
  theme: "modern", // 'modern' or 'win95'
  dayMode: false,
};

// App configurations
const appConfigs = {
  about: { title: "👤 About Me", template: "about-content" },
  projects: { title: "💼 Projects", template: "projects-content" },
  skills: { title: "⚡ Skills", template: "skills-content" },
  visualiser: {
    title: "📊 Algorithm Visualiser",
    template: "visualiser-content",
  },
  contact: { title: "✉️ Contact", template: "contact-content" },
  games: { title: "🎮 Games", template: "games-content" },
  settings: { title: "⚙️ Settings", template: "settings-content" },
};

// Background options
const backgrounds = {
  "gradient-blue": "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  "gradient-purple": "linear-gradient(135deg, #581c87 0%, #3b0764 100%)",
  "gradient-green": "linear-gradient(135deg, #065f46 0%, #064e3b 100%)",
  "gradient-orange": "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
  "gradient-pink": "linear-gradient(135deg, #db2777 0%, #9f1239 100%)",
  "solid-navy": "#1e3a8a",
  "solid-forest": "#14532d",
  "solid-midnight": "#1e1b4b",
};

function changeBackground(bgType) {
  const desktop = document.querySelector(".desktop");
  const background = backgrounds[bgType];

  if (background) {
    desktop.style.background = background;
    localStorage.setItem("desktop-background", bgType);
  }
}

// Wait for DOM to be ready
let startButton,
  startMenu,
  themeSwitcher,
  currentThemeLabel,
  themeToggle,
  themeIcon;

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded fired");

  // Get all DOM elements
  startButton = document.getElementById("start-button");
  startMenu = document.getElementById("start-menu");
  themeSwitcher = document.getElementById("theme-switcher");
  currentThemeLabel = document.getElementById("current-theme");
  themeToggle = document.getElementById("theme-toggle");
  themeIcon = themeToggle.querySelector(".theme-icon");

  console.log("DOM elements loaded:", {
    startButton: !!startButton,
    startMenu: !!startMenu,
    themeToggle: !!themeToggle,
  });

  // Start Menu Toggle
  startButton.addEventListener("click", (e) => {
    e.stopPropagation();
    startMenu.classList.toggle("hidden");
  });

  // Close start menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!startMenu.contains(e.target) && !startButton.contains(e.target)) {
      startMenu.classList.add("hidden");
    }
  });

  // Start menu app launchers
  document.querySelectorAll(".start-menu-item[data-app]").forEach((item) => {
    item.addEventListener("click", () => {
      const appName = item.dataset.app;
      openWindow(appName);
      startMenu.classList.add("hidden");
    });
  });

  // Theme Switcher (Modern vs Win95)
  themeSwitcher.addEventListener("click", () => {
    if (state.theme === "modern") {
      state.theme = "win95";
      document.body.classList.add("win95-theme");
      currentThemeLabel.textContent = "Windows 95";
    } else {
      state.theme = "modern";
      document.body.classList.remove("win95-theme");
      currentThemeLabel.textContent = "Modern";
    }
  });

  // Day/Night Mode Toggle
  themeToggle.addEventListener("click", () => {
    state.dayMode = !state.dayMode;
    document.body.classList.toggle("day-mode", state.dayMode);
    themeIcon.textContent = state.dayMode ? "☀️" : "🌙";
  });

  // Update taskbar time
  function updateTime() {
    const timeElement = document.getElementById("taskbar-time");
    if (timeElement) {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      timeElement.textContent = timeString;
    }
  }
  updateTime();
  setInterval(updateTime, 1000);

  // Setup desktop icons
  console.log("About to setup desktop icons");
  setupDesktopIcons();

  // Load saved background
  const savedBg = localStorage.getItem("desktop-background");
  if (savedBg && backgrounds[savedBg]) {
    changeBackground(savedBg);
  }

  console.log("DOMContentLoaded complete");
});

// Boot screen animation
window.addEventListener("load", () => {
  console.log("Window load event fired");
  setTimeout(() => {
    const bootScreen = document.getElementById("boot-screen");
    if (bootScreen) {
      console.log("Hiding boot screen");
      bootScreen.classList.add("hidden");

      // Remove from DOM after animation
      setTimeout(() => {
        bootScreen.remove();
      }, 500);
    }
  }, 2000);
});

// Keyboard Shortcuts
document.addEventListener("keydown", (e) => {
  // Alt+1-4: Open apps
  if (e.altKey && !e.ctrlKey && !e.shiftKey) {
    const appMap = { 1: "about", 2: "projects", 3: "skills", 4: "contact" };
    if (appMap[e.key]) {
      e.preventDefault();
      openWindow(appMap[e.key]);
    }
  }

  // Ctrl+W: Close active window
  if (e.ctrlKey && e.key === "w" && state.activeWindow) {
    e.preventDefault();
    closeWindow(state.activeWindow);
  }

  // Ctrl+M: Minimize active window
  if (e.ctrlKey && e.key === "m" && state.activeWindow) {
    e.preventDefault();
    toggleMinimize(state.activeWindow);
  }

  // F11: Toggle maximize active window
  if (e.key === "F11" && state.activeWindow) {
    e.preventDefault();
    toggleMaximize(state.activeWindow);
  }

  // Escape: Close start menu
  if (e.key === "Escape") {
    startMenu.classList.add("hidden");
  }

  // Ctrl+Space: Toggle start menu
  if (e.ctrlKey && e.key === " ") {
    e.preventDefault();
    startMenu.classList.toggle("hidden");
  }
});

// Desktop icon click and drag handlers
function setupDesktopIcons() {
  console.log("setupDesktopIcons called");
  const icons = document.querySelectorAll(".desktop-icon");
  console.log("Found", icons.length, "desktop icons");

  icons.forEach((icon, index) => {
    console.log(`Setting up icon ${index}:`, icon.dataset.app);
    let isDragging = false;
    let dragStartTime = 0;
    let startX, startY;
    let iconStartX, iconStartY;

    icon.addEventListener("mousedown", (e) => {
      console.log("Icon mousedown:", icon.dataset.app);

      // Don't interfere with text selection
      if (e.target.classList.contains("icon-label")) return;

      isDragging = false;
      dragStartTime = Date.now();
      startX = e.clientX;
      startY = e.clientY;

      // Get current position
      const rect = icon.getBoundingClientRect();
      const parentRect = icon.parentElement.getBoundingClientRect();
      iconStartX = rect.left - parentRect.left;
      iconStartY = rect.top - parentRect.top;

      const onMouseMove = (e) => {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        // Consider it a drag if moved more than 5px
        if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
          // Only set absolute positioning when actually dragging
          if (!isDragging) {
            isDragging = true;
            // Convert to absolute positioning at current location
            icon.style.position = "absolute";
            icon.style.left = iconStartX + "px";
            icon.style.top = iconStartY + "px";
          }

          const newX = iconStartX + deltaX;
          const newY = iconStartY + deltaY;

          // Keep within bounds
          const maxX = window.innerWidth - icon.offsetWidth - 20;
          const maxY = window.innerHeight - icon.offsetHeight - 68; // Account for taskbar

          icon.style.left = Math.max(0, Math.min(newX, maxX)) + "px";
          icon.style.top = Math.max(0, Math.min(newY, maxY)) + "px";
        }
      };

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);

        const clickDuration = Date.now() - dragStartTime;
        console.log(
          `Icon mouseup: ${icon.dataset.app}, dragging: ${isDragging}, duration: ${clickDuration}ms`
        );

        // If it wasn't a drag and was quick, treat as click
        if (!isDragging && clickDuration < 300) {
          const appName = icon.dataset.app;
          console.log("Opening window for:", appName);
          if (appName) {
            openWindow(appName);
          }
        }
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });

    // Prevent text selection on double-click
    icon.addEventListener("dblclick", (e) => {
      e.preventDefault();
      const appName = icon.dataset.app;
      console.log("Icon double-clicked:", appName);
      if (appName) {
        openWindow(appName);
      }
    });
  });

  console.log("Desktop icons setup complete");
}

// Window management functions
function openWindow(appName) {
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
  addToTaskbar(appName, config.title);

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
    setTimeout(() => setupSettingsWindow(windowElement), 50);
  }
}

// Settings window functionality
function setupSettingsWindow(windowElement) {
  const themeToggle = windowElement.querySelector("#settings-theme-toggle");
  const themeLabel = windowElement.querySelector("#settings-theme-label");
  const daynightToggle = windowElement.querySelector(
    "#settings-daynight-toggle"
  );
  const daynightLabel = windowElement.querySelector("#settings-daynight-label");

  // Update labels to match current state
  themeLabel.textContent = state.theme === "modern" ? "Modern" : "Windows 95";
  daynightLabel.textContent = state.dayMode ? "Day" : "Night";

  // Theme toggle
  themeToggle.addEventListener("click", () => {
    if (state.theme === "modern") {
      state.theme = "win95";
      document.body.classList.add("win95-theme");
      themeLabel.textContent = "Windows 95";
      currentThemeLabel.textContent = "Windows 95";
    } else {
      state.theme = "modern";
      document.body.classList.remove("win95-theme");
      themeLabel.textContent = "Modern";
      currentThemeLabel.textContent = "Modern";
    }
  });

  // Day/Night toggle
  daynightToggle.addEventListener("click", () => {
    state.dayMode = !state.dayMode;
    document.body.classList.toggle("day-mode", state.dayMode);
    daynightLabel.textContent = state.dayMode ? "Day" : "Night";
    themeIcon.textContent = state.dayMode ? "☀️" : "🌙";
  });

  // Background picker
  windowElement.querySelectorAll(".background-option").forEach((option) => {
    option.addEventListener("click", () => {
      const bgType = option.dataset.bg;
      changeBackground(bgType);

      // Visual feedback
      windowElement.querySelectorAll(".background-option").forEach((opt) => {
        opt.style.border = "2px solid transparent";
      });
      option.style.border = "2px solid white";
    });
  });
}

function setupWindowControls(windowElement) {
  const titlebar = windowElement.querySelector(".window-titlebar");
  const closeBtn = windowElement.querySelector(".close-btn");
  const minimizeBtn = windowElement.querySelector(".minimize-btn");
  const maximizeBtn = windowElement.querySelector(".maximize-btn");

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
      const startLeft = windowElement.offsetLeft;
      const startTop = windowElement.offsetTop;

      function resize(e) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

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

function closeWindow(windowElement) {
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

function toggleMinimize(windowElement) {
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

function toggleMaximize(windowElement) {
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

// Taskbar functions
function addToTaskbar(appName, title) {
  const taskbarApps = document.getElementById("taskbar-apps");

  const taskbarApp = document.createElement("div");
  taskbarApp.className = "taskbar-app active";
  taskbarApp.dataset.taskbarApp = appName;
  taskbarApp.textContent = title;

  taskbarApp.addEventListener("click", () => {
    const windowElement = state.windows[appName];
    if (!windowElement) return;

    if (windowElement.classList.contains("minimized")) {
      toggleMinimize(windowElement);
    } else if (state.activeWindow === windowElement) {
      toggleMinimize(windowElement);
    } else {
      focusWindow(windowElement);
    }
  });

  taskbarApps.appendChild(taskbarApp);
}

function removeFromTaskbar(appName) {
  const taskbarApp = document.querySelector(`[data-taskbar-app="${appName}"]`);
  if (taskbarApp) {
    taskbarApp.remove();
  }
}

function updateTaskbarActive(appName) {
  document.querySelectorAll(".taskbar-app").forEach((app) => {
    app.classList.remove("active");
  });

  const activeApp = document.querySelector(`[data-taskbar-app="${appName}"]`);
  if (activeApp && !state.windows[appName].classList.contains("minimized")) {
    activeApp.classList.add("active");
  }
}
