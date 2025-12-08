import { state, changeBackground } from "./state.js";

// Wire up controls inside the Settings window
// currentThemeLabel/themeIcon come from the taskbar/start menu UI
export function setupSettingsWindow(windowElement, { currentThemeLabel, themeIcon }) {
  const themeToggle = windowElement.querySelector("#settings-theme-toggle");
  const themeLabel = windowElement.querySelector("#settings-theme-label");
  const daynightToggle = windowElement.querySelector("#settings-daynight-toggle");
  const daynightLabel = windowElement.querySelector("#settings-daynight-label");

  if (!themeToggle || !themeLabel || !daynightToggle || !daynightLabel) return;

  // Update labels to match current state
  themeLabel.textContent = state.theme === "modern" ? "Modern" : "Windows 95";
  daynightLabel.textContent = state.dayMode ? "Day" : "Night";

  // Theme toggle
  themeToggle.addEventListener("click", () => {
    if (state.theme === "modern") {
      state.theme = "win95";
      document.body.classList.add("win95-theme");
      themeLabel.textContent = "Windows 95";
      if (currentThemeLabel) {
        currentThemeLabel.textContent = "Windows 95";
      }
    } else {
      state.theme = "modern";
      document.body.classList.remove("win95-theme");
      themeLabel.textContent = "Modern";
      if (currentThemeLabel) {
        currentThemeLabel.textContent = "Modern";
      }
    }
  });

  // Day/Night toggle
  daynightToggle.addEventListener("click", () => {
    state.dayMode = !state.dayMode;
    document.body.classList.toggle("day-mode", state.dayMode);
    daynightLabel.textContent = state.dayMode ? "Day" : "Night";
    if (themeIcon) {
      themeIcon.textContent = state.dayMode ? "☀️" : "🌙";
    }
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
