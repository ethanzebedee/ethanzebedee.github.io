import { state, backgrounds, changeBackground } from "./state.js";
import {
  initWindowManager,
  openWindow,
  closeWindow,
  toggleMinimize,
  toggleMaximize,
} from "./windows.js";
import { setupDesktopIcons } from "./desktopIcons.js";
import { initClippy } from "./clippy.js";

let startButton;
let startMenu;
let themeSwitcher;
let currentThemeLabel;
let themeToggle;
let themeIcon;
let profilePopup;
let profilePopupClose;
let profilePopupOverlay;
let bootFinished = false;

function setupProfilePopup() {
  profilePopup = document.getElementById("profile-popup");
  if (!profilePopup) return;

  profilePopupClose = profilePopup.querySelector(".profile-popup-close");
  profilePopupOverlay = profilePopup.querySelector(".profile-popup-overlay");

  profilePopupClose.addEventListener("click", closeProfilePopup);
  profilePopupOverlay.addEventListener("click", closeProfilePopup);

  const openAboutBtn = document.getElementById("open-about-btn");

  openAboutBtn?.addEventListener("click", () => {
    closeProfilePopup();
    openWindow("about");
  });
}

function openProfilePopup() {
  profilePopup?.classList.remove("hidden");
}

function closeProfilePopup() {
  profilePopup?.classList.add("hidden");
}

// Keyboard shortcuts rely on start menu and window state
function setupKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    // Alt+1-4: Open apps
    if (e.altKey && !e.ctrlKey && !e.shiftKey) {
      const appMap = {
        1: "about",
        2: "projects",
        3: "achievements",
        4: "skills",
        5: "contact",
      };
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
    if (e.key === "Escape" && startMenu) {
      startMenu.classList.add("hidden");
    }

    // Ctrl+Space: Toggle start menu
    if (e.ctrlKey && e.key === " ") {
      e.preventDefault();
      if (startMenu) {
        startMenu.classList.toggle("hidden");
      }
    }
  });
}

// Boot screen animation
function setupBootScreen() {
  function dismissBootScreen() {
    const bootScreen = document.getElementById("boot-screen");
    if (!bootScreen || bootFinished) return;
    bootFinished = true;
    bootScreen.classList.add("hidden");
    setTimeout(() => {
      bootScreen.remove();
      openProfilePopup();
    }, 500);
  }

  function showTraditionalView() {
    const bootScreen = document.getElementById("boot-screen");
    const traditionalView = document.getElementById("traditional-view");
    const desktop = document.getElementById("desktop");
    const mobileLayout = document.getElementById("mobile-layout");

    if (!bootScreen || !traditionalView) return;

    bootFinished = true;
    bootScreen.classList.add("hidden");

    // Hide default layout elements
    if (desktop) desktop.style.display = "none";
    if (mobileLayout) mobileLayout.style.display = "none";

    // Show traditional view
    traditionalView.classList.remove("hidden");

    // Setup traditional view close button
    setupTraditionalViewClosing();

    // Remove boot screen after animation
    setTimeout(() => {
      bootScreen.remove();
    }, 500);
  }

  window.addEventListener("load", () => {
    const bootScreen = document.getElementById("boot-screen");
    if (!bootScreen) return;

    // Setup button event listeners
    const quickViewBtn = document.getElementById("boot-traditional-view");
    const ethanOSBtn = document.getElementById("boot-ethan-os");

    if (quickViewBtn) {
      quickViewBtn.addEventListener("click", showTraditionalView);
    }

    if (ethanOSBtn) {
      ethanOSBtn.addEventListener("click", dismissBootScreen);
    }

    // Click anywhere on boot screen still triggers EthanOS (backward compat)
    bootScreen.addEventListener("click", (e) => {
      // Only trigger if not clicking a button
      if (e.target.tagName !== "BUTTON") {
        dismissBootScreen();
      }
    });

    // Auto-dismiss after 2 seconds
    setTimeout(dismissBootScreen, 2000);
  });
}

// Setup Traditional View Controls
function setupTraditionalViewClosing() {
  const closeBtn = document.getElementById("trad-close-btn");
  const footerLinks = document.querySelectorAll(".trad-footer a");

  const goBackToOS = () => {
    const traditionalView = document.getElementById("traditional-view");
    const desktop = document.getElementById("desktop");
    const mobileLayout = document.getElementById("mobile-layout");

    if (traditionalView) traditionalView.classList.add("hidden");
    if (desktop) desktop.style.display = "block";
    if (mobileLayout) mobileLayout.style.display = "block";

    // Re-open the profile popup
    openProfilePopup();
  };

  if (closeBtn) {
    closeBtn.addEventListener("click", goBackToOS);
  }

  // Also setup footer links
  footerLinks.forEach((link) => {
    if (link.textContent.toLowerCase().includes("back")) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        goBackToOS();
      });
    }
  });

  // Setup smooth scrolling for nav links
  const navLinks = document.querySelectorAll(".trad-nav-links a");
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });
}

// Taskbar time updater
function setupTaskbarClock() {
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
}

// Start menu interactions
function setupStartMenu() {
  // Toggle on button click
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
}

// Theme switcher (Modern vs Windows 95)
function setupThemeSwitcher() {
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
}

// Day/Night mode toggle
function setupDayNightToggle() {
  themeToggle.addEventListener("click", () => {
    state.dayMode = !state.dayMode;
    document.body.classList.toggle("day-mode", state.dayMode);
    themeIcon.textContent = state.dayMode ? "☀️" : "🌙";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded fired");

  // Get UI elements
  startButton = document.getElementById("start-button");
  startMenu = document.getElementById("start-menu");
  themeSwitcher = document.getElementById("theme-switcher");
  currentThemeLabel = document.getElementById("current-theme");
  themeToggle = document.getElementById("theme-toggle");
  themeIcon = themeToggle.querySelector(".theme-icon");

  setupProfilePopup(); // ✅ ADD THIS

  console.log("DOM elements loaded:", {
    startButton: !!startButton,
    startMenu: !!startMenu,
    themeToggle: !!themeToggle,
  });

  // Initialise window manager with shared UI references
  initWindowManager({ currentThemeLabel, themeIcon });

  // Allow any module to request opening an app via a custom event
  window.addEventListener("open-app", (event) => {
    const detail = event.detail;
    const appName = typeof detail === "string" ? detail : detail?.appId;
    if (appName) {
      openWindow(appName);
    }
  });

  setupStartMenu();
  setupThemeSwitcher();
  setupDayNightToggle();
  setupTaskbarClock();

  console.log("About to setup desktop icons");
  setupDesktopIcons({ onOpenApp: openWindow });

  // Load saved background
  const savedBg = localStorage.getItem("desktop-background");
  if (savedBg && backgrounds[savedBg]) {
    changeBackground(savedBg);
  }

  setupKeyboardShortcuts();
  setupBootScreen();

  // Initialize Clippy assistant
  initClippy();

  console.log("DOMContentLoaded complete");
});
