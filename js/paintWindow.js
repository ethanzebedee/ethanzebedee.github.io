export function setupPaintWindow(windowElement) {
  const canvas = windowElement.querySelector(".paint-canvas");
  const ctx = canvas.getContext("2d");
  const colorPicker = windowElement.querySelector(".paint-color-picker");
  const brushSize = windowElement.querySelector(".paint-brush-size");
  const clearBtn = windowElement.querySelector(".paint-clear-btn");
  const saveBtn = windowElement.querySelector(".paint-save-btn");
  const toolSelect = windowElement.querySelector(".paint-tool-select");

  let isDrawing = false;
  let currentTool = "brush";
  let currentColor = "#000000";
  let currentSize = 5;
  let lastX = 0;
  let lastY = 0;

  // Set canvas size
  canvas.width = 800;
  canvas.height = 600;

  // Fill white background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Color picker
  colorPicker.addEventListener("input", (e) => {
    currentColor = e.target.value;
  });

  // Brush size
  brushSize.addEventListener("input", (e) => {
    currentSize = parseInt(e.target.value);
  });

  // Tool selection
  toolSelect.addEventListener("change", (e) => {
    currentTool = e.target.value;
    canvas.style.cursor = currentTool === "eraser" ? "grab" : "crosshair";
  });

  // Clear canvas
  clearBtn.addEventListener("click", () => {
    if (confirm("Clear the entire canvas?")) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  });

  // Save canvas
  saveBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `paint-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  });

  // Drawing functions
  function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
  }

  function draw(e) {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = currentSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (currentTool === "brush") {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = currentColor;
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (currentTool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    lastX = x;
    lastY = y;
  }

  function stopDrawing() {
    isDrawing = false;
  }

  // Mouse events
  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stopDrawing);
  canvas.addEventListener("mouseout", stopDrawing);

  // Touch events for mobile
  canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent("mousedown", {
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
    canvas.dispatchEvent(mouseEvent);
  });

  canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent("mousemove", {
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
    canvas.dispatchEvent(mouseEvent);
  });

  canvas.addEventListener("touchend", (e) => {
    e.preventDefault();
    const mouseEvent = new MouseEvent("mouseup", {});
    canvas.dispatchEvent(mouseEvent);
  });
}
