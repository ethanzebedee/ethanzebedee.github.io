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

  /* -----------------------------
     Canvas sizing (CSS-safe)
  ------------------------------ */
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Fill white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  /* -----------------------------
     UI controls
  ------------------------------ */
  colorPicker.addEventListener("input", (e) => {
    currentColor = e.target.value;
  });

  brushSize.addEventListener("input", (e) => {
    currentSize = parseInt(e.target.value, 10);
  });

  toolSelect.addEventListener("change", (e) => {
    currentTool = e.target.value;
    canvas.style.cursor = currentTool === "eraser" ? "cell" : "crosshair";
  });

  clearBtn.addEventListener("click", () => {
    if (confirm("Clear the entire canvas?")) {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, rect.width, rect.height);
    }
  });

  saveBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `paint-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  });

  /* -----------------------------
     Drawing logic
  ------------------------------ */
  function getCanvasPos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  function startDrawing(e) {
    isDrawing = true;
    const { x, y } = getCanvasPos(e);
    lastX = x;
    lastY = y;
  }

  function draw(e) {
    if (!isDrawing) return;

    const { x, y } = getCanvasPos(e);

    ctx.lineWidth = currentSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = currentColor;
    ctx.globalCompositeOperation =
      currentTool === "eraser" ? "destination-out" : "source-over";

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastX = x;
    lastY = y;
  }

  function stopDrawing() {
    isDrawing = false;
  }

  /* -----------------------------
     Mouse events
  ------------------------------ */
  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stopDrawing);
  canvas.addEventListener("mouseleave", stopDrawing);

  /* -----------------------------
     Touch events
  ------------------------------ */
  canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    const t = e.touches[0];
    startDrawing({ clientX: t.clientX, clientY: t.clientY });
  });

  canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    const t = e.touches[0];
    draw({ clientX: t.clientX, clientY: t.clientY });
  });

  canvas.addEventListener("touchend", stopDrawing);
}
