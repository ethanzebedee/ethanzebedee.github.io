// Desktop icon layout helper
function layoutDesktopIcons() {
  const container = document.querySelector(".desktop-icons");
  const desktop = document.querySelector(".desktop");
  const icons = Array.from(document.querySelectorAll(".desktop-icon"));

  if (!container || !desktop || icons.length === 0) return;

  const desktopRect = desktop.getBoundingClientRect();
  const taskbar = document.querySelector(".taskbar");
  const taskbarHeight = taskbar
    ? taskbar.getBoundingClientRect().height
    : 48; // fallback

  const paddingTop = 20;
  const paddingLeft = 20;
  const paddingBottom = 20;
  const verticalSpacing = 16;
  const horizontalSpacing = 40;

  const maxHeight =
    desktopRect.height - taskbarHeight - paddingTop - paddingBottom;

  const sampleIcon = icons[0];
  const iconHeight = sampleIcon.offsetHeight || 72;
  const iconWidth = sampleIcon.offsetWidth || 72;

  const iconsPerColumn = Math.max(
    1,
    Math.floor((maxHeight + verticalSpacing) / (iconHeight + verticalSpacing))
  );

  icons.forEach((icon, index) => {
    const column = Math.floor(index / iconsPerColumn);
    const row = index % iconsPerColumn;

    const top = paddingTop + row * (iconHeight + verticalSpacing);
    const left = paddingLeft + column * (iconWidth + horizontalSpacing);

    icon.style.position = "absolute";
    icon.style.top = `${top}px`;
    icon.style.left = `${left}px`;
  });
}

// Desktop icon click and drag handlers
// onOpenApp: function(appName: string) => void
export function setupDesktopIcons({ onOpenApp }) {
  console.log("setupDesktopIcons called");
  const icons = document.querySelectorAll(".desktop-icon");
  console.log("Found", icons.length, "desktop icons");

  // Initial auto-layout so icons don't overlap the taskbar
  layoutDesktopIcons();

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

      const onMouseMove = (moveEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;

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
          if (appName && typeof onOpenApp === "function") {
            onOpenApp(appName);
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
      if (appName && typeof onOpenApp === "function") {
        onOpenApp(appName);
      }
    });
  });

  console.log("Desktop icons setup complete");
}
