import { state } from "./state.js";

// Add an app button to the taskbar
// toggleMinimize, focusWindow are callbacks from the window manager
export function addToTaskbar(appName, title, toggleMinimize, focusWindow) {
  const taskbarApps = document.getElementById("taskbar-apps");
  if (!taskbarApps) return;

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

// Remove an app button from the taskbar
export function removeFromTaskbar(appName) {
  const taskbarApp = document.querySelector(`[data-taskbar-app="${appName}"]`);
  if (taskbarApp) {
    taskbarApp.remove();
  }
}

// Update which taskbar app is marked active
export function updateTaskbarActive(appName) {
  document.querySelectorAll(".taskbar-app").forEach((app) => {
    app.classList.remove("active");
  });

  const activeApp = document.querySelector(`[data-taskbar-app="${appName}"]`);
  if (activeApp && !state.windows[appName].classList.contains("minimized")) {
    activeApp.classList.add("active");
  }
}
