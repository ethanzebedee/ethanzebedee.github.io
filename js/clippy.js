// Clippy - Desktop Assistant
export function initClippy() {
  const desktop = document.querySelector(".desktop");
  if (!desktop) return;

  // Create Clippy element
  const clippy = document.createElement("div");
  clippy.id = "clippy";
  clippy.className = "clippy";
  clippy.innerHTML = `
    <div class="clippy-body">📎</div>
    <div class="clippy-speech hidden">
      <div class="clippy-speech-content"></div>
      <button class="clippy-close">×</button>
    </div>
  `;

  desktop.appendChild(clippy);

  const clippyBody = clippy.querySelector(".clippy-body");
  const speechBubble = clippy.querySelector(".clippy-speech");
  const speechContent = clippy.querySelector(".clippy-speech-content");
  const closeBtn = clippy.querySelector(".clippy-close");

  let currentMessageIndex = 0;
  let isVisible = false;

  // Tips and messages
  const messages = [
    "Hi! I'm Clippy, your helpful assistant! 👋",
    "Try opening different apps from the desktop!",
    "You can drag windows around by their title bars.",
    "Press Ctrl+W to close windows quickly!",
    "Check out the Games app for some fun!",
    "The Notes app saves automatically to your browser!",
    "You can customize your desktop background in Settings!",
    "Try the Algorithm Visualiser to see sorting in action!",
    "MS Paint lets you create and save drawings!",
    "The File Explorer shows all your files!",
  ];

  // Show random tip
  function showTip() {
    if (isVisible) return;
    isVisible = true;
    const message = messages[Math.floor(Math.random() * messages.length)];
    speechContent.textContent = message;
    speechBubble.classList.remove("hidden");

    // Auto-hide after 5 seconds
    setTimeout(() => {
      hideTip();
    }, 5000);
  }

  function hideTip() {
    isVisible = false;
    speechBubble.classList.add("hidden");
  }

  // Click Clippy to show tip
  clippyBody.addEventListener("click", () => {
    if (isVisible) {
      hideTip();
    } else {
      showTip();
    }
  });

  // Close button
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    hideTip();
  });

  // Show initial tip after 3 seconds
  setTimeout(() => {
    showTip();
  }, 3000);

  // Show new tip every 30 seconds if not visible
  setInterval(() => {
    if (!isVisible && Math.random() > 0.7) {
      showTip();
    }
  }, 30000);

  // Make Clippy draggable
  let isDragging = false;
  let startX, startY, initialX, initialY;

  clippyBody.addEventListener("mousedown", (e) => {
    if (e.target === closeBtn) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    const rect = clippy.getBoundingClientRect();
    const desktopRect = desktop.getBoundingClientRect();
    initialX = rect.left - desktopRect.left;
    initialY = rect.top - desktopRect.top;

    document.addEventListener("mousemove", dragClippy);
    document.addEventListener("mouseup", stopDragClippy);
  });

  function dragClippy(e) {
    if (!isDragging) return;
    const desktopRect = desktop.getBoundingClientRect();
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    const newX = initialX + deltaX;
    const newY = initialY + deltaY;

    // Keep within desktop bounds
    const maxX = desktopRect.width - clippy.offsetWidth;
    const maxY = desktopRect.height - clippy.offsetHeight - 48; // Account for taskbar

    clippy.style.left = Math.max(0, Math.min(newX, maxX)) + "px";
    clippy.style.top = Math.max(0, Math.min(newY, maxY)) + "px";
  }

  function stopDragClippy() {
    isDragging = false;
    document.removeEventListener("mousemove", dragClippy);
    document.removeEventListener("mouseup", stopDragClippy);
  }

  // Initial position (bottom right)
  setTimeout(() => {
    const desktopRect = desktop.getBoundingClientRect();
    clippy.style.position = "absolute";
    clippy.style.right = "20px";
    clippy.style.bottom = "80px"; // Above taskbar
  }, 100);
}
