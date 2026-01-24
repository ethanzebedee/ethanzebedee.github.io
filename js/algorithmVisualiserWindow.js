// Algorithm Visualiser - Extensible architecture for custom algorithms
export function setupAlgorithmVisualiserWindow(windowElement) {
  const algorithmSelect = windowElement.querySelector(".algorithm-select");
  const visualiserCanvas = windowElement.querySelector(".algorithm-canvas");
  const controls = windowElement.querySelector(".algorithm-controls");
  const playBtn = windowElement.querySelector(".algorithm-play-btn");
  const resetBtn = windowElement.querySelector(".algorithm-reset-btn");
  const speedSlider = windowElement.querySelector(".algorithm-speed-slider");
  const speedLabel = windowElement.querySelector(".algorithm-speed-label");

  let currentAlgorithm = null;
  let animationId = null;
  let isPlaying = false;

  // Algorithm registry - add your custom algorithms here
  const algorithms = {
    "bubble-sort": {
      name: "Bubble Sort",
      setup: () => setupBubbleSort(visualiserCanvas),
    },
    "quick-sort": {
      name: "Quick Sort",
      setup: () => setupQuickSort(visualiserCanvas),
    },
    "selection-sort": {
      name: "Selection Sort",
      setup: () => setupSelectionSort(visualiserCanvas),
    },
  };

  // Populate algorithm selector
  Object.entries(algorithms).forEach(([id, algo]) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = algo.name;
    algorithmSelect.appendChild(option);
  });

  // Speed control
  speedSlider.addEventListener("input", (e) => {
    const speed = parseInt(e.target.value);
    speedLabel.textContent = `Speed: ${speed}ms`;
    if (currentAlgorithm && currentAlgorithm.setSpeed) {
      currentAlgorithm.setSpeed(speed);
    }
  });

  // Algorithm selection
  algorithmSelect.addEventListener("change", (e) => {
    stopAnimation();
    const algoId = e.target.value;
    if (algorithms[algoId]) {
      currentAlgorithm = algorithms[algoId].setup();
      resetBtn.click();
    }
  });

  // Play/Pause button
  playBtn.addEventListener("click", () => {
    if (!currentAlgorithm) return;

    if (isPlaying) {
      pauseAnimation();
    } else {
      startAnimation();
    }
  });

  // Reset button
  resetBtn.addEventListener("click", () => {
    stopAnimation();
    if (currentAlgorithm && currentAlgorithm.reset) {
      currentAlgorithm.reset();
    }
  });

  function startAnimation() {
    if (!currentAlgorithm || !currentAlgorithm.step) return;
    isPlaying = true;
    playBtn.textContent = "⏸️ Pause";
    animate();
  }

  function pauseAnimation() {
    isPlaying = false;
    playBtn.textContent = "▶️ Play";
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  function stopAnimation() {
    pauseAnimation();
    if (currentAlgorithm && currentAlgorithm.stop) {
      currentAlgorithm.stop();
    }
  }

  function animate() {
    if (!isPlaying || !currentAlgorithm) return;

    const speed = parseInt(speedSlider.value);
    const done = currentAlgorithm.step();

    if (done) {
      stopAnimation();
      playBtn.textContent = "✅ Complete";
    } else {
      animationId = setTimeout(() => {
        requestAnimationFrame(animate);
      }, speed);
    }
  }

  // Initialize with first algorithm
  if (Object.keys(algorithms).length > 0) {
    const firstAlgo = Object.keys(algorithms)[0];
    algorithmSelect.value = firstAlgo;
    currentAlgorithm = algorithms[firstAlgo].setup();
  }
}

// Example algorithm implementations
function setupBubbleSort(canvas) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  let array = generateRandomArray(20);
  let i = 0;
  let j = 0;
  let speed = 50;

  function generateRandomArray(size) {
    return Array.from({ length: size }, () => Math.floor(Math.random() * height));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const barWidth = width / array.length;

    array.forEach((value, index) => {
      ctx.fillStyle = index === j || index === j + 1 ? "#ef4444" : "#3b82f6";
      ctx.fillRect(index * barWidth, height - value, barWidth - 1, value);
    });
  }

  function step() {
    if (i < array.length - 1) {
      if (j < array.length - i - 1) {
        if (array[j] > array[j + 1]) {
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
        }
        j++;
      } else {
        j = 0;
        i++;
      }
      draw();
      return false;
    }
    draw();
    return true;
  }

  function reset() {
    array = generateRandomArray(20);
    i = 0;
    j = 0;
    draw();
  }

  function setSpeed(newSpeed) {
    speed = newSpeed;
  }

  draw();

  return { step, reset, setSpeed, stop: () => {} };
}

function setupQuickSort(canvas) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  let array = generateRandomArray(20);
  let stack = [];
  let currentStep = null;
  let speed = 50;

  function generateRandomArray(size) {
    return Array.from({ length: size }, () => Math.floor(Math.random() * height));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const barWidth = width / array.length;

    array.forEach((value, index) => {
      let color = "#3b82f6";
      if (currentStep) {
        if (index === currentStep.pivot) color = "#10b981";
        if (currentStep.low !== null && index >= currentStep.low && index <= currentStep.high) color = "#ef4444";
      }
      ctx.fillStyle = color;
      ctx.fillRect(index * barWidth, height - value, barWidth - 1, value);
    });
  }

  function step() {
    // Simplified quicksort visualization
    if (stack.length === 0 && !currentStep) {
      stack.push({ low: 0, high: array.length - 1 });
    }

    if (currentStep) {
      const { low, high, pivot } = currentStep;
      if (low < high) {
        const pivotValue = array[pivot];
        let i = low - 1;

        for (let j = low; j < high; j++) {
          if (array[j] < pivotValue) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
          }
        }
        [array[i + 1], array[high]] = [array[high], array[i + 1]];

        stack.push({ low, high: i });
        stack.push({ low: i + 2, high });
      }
      currentStep = null;
    } else if (stack.length > 0) {
      currentStep = stack.pop();
      currentStep.pivot = currentStep.high;
    } else {
      draw();
      return true;
    }

    draw();
    return false;
  }

  function reset() {
    array = generateRandomArray(20);
    stack = [];
    currentStep = null;
    draw();
  }

  function setSpeed(newSpeed) {
    speed = newSpeed;
  }

  draw();

  return { step, reset, setSpeed, stop: () => {} };
}

function setupSelectionSort(canvas) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  let array = generateRandomArray(20);
  let i = 0;
  let minIndex = 0;
  let j = 1;
  let speed = 50;

  function generateRandomArray(size) {
    return Array.from({ length: size }, () => Math.floor(Math.random() * height));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const barWidth = width / array.length;

    array.forEach((value, index) => {
      let color = "#3b82f6";
      if (index === i) color = "#10b981";
      if (index === minIndex) color = "#f59e0b";
      if (index === j) color = "#ef4444";
      ctx.fillStyle = color;
      ctx.fillRect(index * barWidth, height - value, barWidth - 1, value);
    });
  }

  function step() {
    if (i < array.length - 1) {
      if (j < array.length) {
        if (array[j] < array[minIndex]) {
          minIndex = j;
        }
        j++;
      } else {
        if (minIndex !== i) {
          [array[i], array[minIndex]] = [array[minIndex], array[i]];
        }
        i++;
        minIndex = i;
        j = i + 1;
      }
      draw();
      return false;
    }
    draw();
    return true;
  }

  function reset() {
    array = generateRandomArray(20);
    i = 0;
    minIndex = 0;
    j = 1;
    draw();
  }

  function setSpeed(newSpeed) {
    speed = newSpeed;
  }

  draw();

  return { step, reset, setSpeed, stop: () => {} };
}
