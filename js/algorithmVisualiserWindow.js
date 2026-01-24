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

  // Algorithm registry - organized by category
  const algorithms = {
    // Sorting Algorithms
    "bubble-sort": { name: "Bubble Sort", category: "Sorting", setup: () => setupBubbleSort(visualiserCanvas) },
    "insertion-sort": { name: "Insertion Sort", category: "Sorting", setup: () => setupInsertionSort(visualiserCanvas) },
    "selection-sort": { name: "Selection Sort", category: "Sorting", setup: () => setupSelectionSort(visualiserCanvas) },
    "merge-sort": { name: "Merge Sort", category: "Sorting", setup: () => setupMergeSort(visualiserCanvas) },
    "quick-sort": { name: "Quick Sort", category: "Sorting", setup: () => setupQuickSort(visualiserCanvas) },
    
    // Search Algorithms
    "linear-search": { name: "Linear Search", category: "Search", setup: () => setupLinearSearch(visualiserCanvas) },
    "binary-search": { name: "Binary Search", category: "Search", setup: () => setupBinarySearch(visualiserCanvas) },
    "jump-search": { name: "Jump Search", category: "Search", setup: () => setupJumpSearch(visualiserCanvas) },
    "interpolation-search": { name: "Interpolation Search", category: "Search", setup: () => setupInterpolationSearch(visualiserCanvas) },
    "exponential-search": { name: "Exponential Search", category: "Search", setup: () => setupExponentialSearch(visualiserCanvas) },
    "stalin-sort": { name: "Stalin Sort", category: "Search", setup: () => setupStalinSort(visualiserCanvas) },
    
    // Graph Algorithms
    "dijkstra": { name: "Dijkstra's Algorithm", category: "Pathfinding", setup: () => setupDijkstra(visualiserCanvas) },
    "a-star": { name: "A* Search", category: "Pathfinding", setup: () => setupAStar(visualiserCanvas) },
    "bellman-ford": { name: "Bellman-Ford", category: "Pathfinding", setup: () => setupBellmanFord(visualiserCanvas) },
    "floyd-warshall": { name: "Floyd-Warshall", category: "Pathfinding", setup: () => setupFloydWarshall(visualiserCanvas) },
    "prims": { name: "Prim's MST", category: "Pathfinding", setup: () => setupPrims(visualiserCanvas) },
    "kruskals": { name: "Kruskal's MST", category: "Pathfinding", setup: () => setupKruskals(visualiserCanvas) },
    
    // Other Algorithms
    "top-k": { name: "Top K Elements", category: "Other", setup: () => setupTopK(visualiserCanvas) },
    "backtracking": { name: "Backtracking (N-Queens)", category: "Other", setup: () => setupBacktracking(visualiserCanvas) },
    "sliding-window": { name: "Sliding Window", category: "Other", setup: () => setupSlidingWindow(visualiserCanvas) },
    "huffman": { name: "Huffman Coding", category: "Other", setup: () => setupHuffman(visualiserCanvas) },
    "euclid": { name: "Euclid's Algorithm (GCD)", category: "Other", setup: () => setupEuclid(visualiserCanvas) },
    "union-find": { name: "Union Find", category: "Other", setup: () => setupUnionFind(visualiserCanvas) },
    "kadane": { name: "Kadane's Algorithm", category: "Other", setup: () => setupKadane(visualiserCanvas) },
    "floyd-cycle": { name: "Floyd's Cycle Detection", category: "Other", setup: () => setupFloydCycle(visualiserCanvas) },
    "kmp": { name: "KMP Pattern Matching", category: "Other", setup: () => setupKMP(visualiserCanvas) },
    "quick-select": { name: "Quick Select", category: "Other", setup: () => setupQuickSelect(visualiserCanvas) },
    "boyer-moore": { name: "Boyer-Moore", category: "Other", setup: () => setupBoyerMoore(visualiserCanvas) },
    "maze-generation": { name: "Maze Generation", category: "Other", setup: () => setupMazeGeneration(visualiserCanvas) },
  };

  // Populate algorithm selector with categories
  const categories = {};
  Object.entries(algorithms).forEach(([id, algo]) => {
    if (!categories[algo.category]) categories[algo.category] = [];
    categories[algo.category].push({ id, ...algo });
  });

  Object.entries(categories).forEach(([category, algos]) => {
    const optgroup = document.createElement("optgroup");
    optgroup.label = category;
    algos.forEach(({ id, name }) => {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = name;
      optgroup.appendChild(option);
    });
    algorithmSelect.appendChild(optgroup);
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

// Helper function for random arrays
function generateRandomArray(size, max = 400) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * max) + 10);
}

// ============================================================================
// SORTING ALGORITHMS
// ============================================================================

function setupBubbleSort(canvas) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  let array = generateRandomArray(20, height - 20);
  let i = 0, j = 0;

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const barWidth = width / array.length;
    array.forEach((value, index) => {
      ctx.fillStyle = (index === j || index === j + 1) ? "#ef4444" : "#3b82f6";
      ctx.fillRect(index * barWidth, height - value, barWidth - 1, value);
    });
  }

  function step() {
    if (i < array.length - 1) {
      if (j < array.length - i - 1) {
        if (array[j] > array[j + 1]) [array[j], array[j + 1]] = [array[j + 1], array[j]];
        j++;
      } else { j = 0; i++; }
      draw();
      return false;
    }
    draw();
    return true;
  }

  function reset() { array = generateRandomArray(20, height - 20); i = 0; j = 0; draw(); }
  function setSpeed() {}
  draw();
  return { step, reset, setSpeed, stop: () => {} };
}

function setupInsertionSort(canvas) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  let array = generateRandomArray(20, height - 20);
  let i = 1, j = 0, key = 0;

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const barWidth = width / array.length;
    array.forEach((value, index) => {
      ctx.fillStyle = index === i ? "#10b981" : index === j ? "#ef4444" : "#3b82f6";
      ctx.fillRect(index * barWidth, height - value, barWidth - 1, value);
    });
  }

  function step() {
    if (i < array.length) {
      if (j >= 0 && array[j] > key) {
        array[j + 1] = array[j];
        j--;
      } else {
        array[j + 1] = key;
        i++;
        if (i < array.length) { key = array[i]; j = i - 1; }
      }
      draw();
      return false;
    }
    draw();
    return true;
  }

  function reset() { array = generateRandomArray(20, height - 20); i = 1; j = 0; key = array[0]; draw(); }
  function setSpeed() {}
  draw();
  return { step, reset, setSpeed, stop: () => {} };
}

function setupSelectionSort(canvas) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  let array = generateRandomArray(20, height - 20);
  let i = 0, minIndex = 0, j = 1;

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
        if (array[j] < array[minIndex]) minIndex = j;
        j++;
      } else {
        if (minIndex !== i) [array[i], array[minIndex]] = [array[minIndex], array[i]];
        i++; minIndex = i; j = i + 1;
      }
      draw();
      return false;
    }
    draw();
    return true;
  }

  function reset() { array = generateRandomArray(20, height - 20); i = 0; minIndex = 0; j = 1; draw(); }
  function setSpeed() {}
  draw();
  return { step, reset, setSpeed, stop: () => {} };
}

function setupMergeSort(canvas) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  let array = generateRandomArray(20, height - 20);
  let stack = [{ left: 0, right: array.length - 1, stage: "split" }];
  let temp = [...array];
  let merging = false;
  let mergeLeft = 0, mergeMid = 0, mergeRight = 0, mergeI = 0, mergeJ = 0, mergeK = 0;

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const barWidth = width / array.length;
    array.forEach((value, index) => {
      ctx.fillStyle = "#3b82f6";
      if (stack.length > 0 && stack[0].left <= index && index <= stack[0].right) ctx.fillStyle = "#ef4444";
      ctx.fillRect(index * barWidth, height - value, barWidth - 1, value);
    });
  }

  function step() {
    if (stack.length === 0) { draw(); return true; }
    const current = stack[0];
    if (current.stage === "split") {
      if (current.left < current.right) {
        const mid = Math.floor((current.left + current.right) / 2);
        stack.unshift({ left: mid + 1, right: current.right, stage: "split" });
        stack.unshift({ left: current.left, right: mid, stage: "split" });
        stack.push({ left: current.left, right: current.right, mid, stage: "merge" });
      }
      stack.shift();
    } else {
      if (!merging) {
        merging = true;
        mergeLeft = current.left;
        mergeMid = current.mid;
        mergeRight = current.right;
        mergeI = mergeLeft;
        mergeJ = mergeMid + 1;
        mergeK = mergeLeft;
      }
      if (mergeI <= mergeMid && mergeJ <= mergeRight) {
        if (temp[mergeI] <= temp[mergeJ]) {
          array[mergeK] = temp[mergeI++];
        } else {
          array[mergeK] = temp[mergeJ++];
        }
        mergeK++;
      } else {
        while (mergeI <= mergeMid) array[mergeK++] = temp[mergeI++];
        while (mergeJ <= mergeRight) array[mergeK++] = temp[mergeJ++];
        temp = [...array];
        merging = false;
        stack.shift();
      }
    }
    draw();
    return false;
  }

  function reset() {
    array = generateRandomArray(20, height - 20);
    temp = [...array];
    stack = [{ left: 0, right: array.length - 1, stage: "split" }];
    merging = false;
    draw();
  }
  function setSpeed() {}
  draw();
  return { step, reset, setSpeed, stop: () => {} };
}

function setupQuickSort(canvas) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  let array = generateRandomArray(20, height - 20);
  let stack = [{ low: 0, high: array.length - 1 }];
  let current = null;

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const barWidth = width / array.length;
    array.forEach((value, index) => {
      let color = "#3b82f6";
      if (current && index >= current.low && index <= current.high) color = "#ef4444";
      if (current && index === current.pivot) color = "#10b981";
      ctx.fillStyle = color;
      ctx.fillRect(index * barWidth, height - value, barWidth - 1, value);
    });
  }

  function step() {
    if (stack.length === 0 && !current) { draw(); return true; }
    if (!current && stack.length > 0) {
      current = stack.pop();
      current.pivot = current.high;
    }
    if (current.low < current.high) {
      const pivotValue = array[current.pivot];
      let i = current.low - 1;
      for (let j = current.low; j < current.high; j++) {
        if (array[j] < pivotValue) {
          i++;
          [array[i], array[j]] = [array[j], array[i]];
        }
      }
      [array[i + 1], array[current.pivot]] = [array[current.pivot], array[i + 1]];
      stack.push({ low: current.low, high: i });
      stack.push({ low: i + 2, high: current.high });
      current = null;
    } else {
      current = null;
    }
    draw();
    return false;
  }

  function reset() { array = generateRandomArray(20, height - 20); stack = [{ low: 0, high: array.length - 1 }]; current = null; draw(); }
  function setSpeed() {}
  draw();
  return { step, reset, setSpeed, stop: () => {} };
}

// ============================================================================
// SEARCH ALGORITHMS
// ============================================================================

function setupLinearSearch(canvas) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  let array = generateRandomArray(20, height - 20).sort((a, b) => a - b);
  let target = array[Math.floor(Math.random() * array.length)];
  let index = 0;

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const barWidth = width / array.length;
    array.forEach((value, i) => {
      ctx.fillStyle = i === index ? "#ef4444" : value === target ? "#10b981" : "#3b82f6";
      ctx.fillRect(i * barWidth, height - value, barWidth - 1, value);
    });
    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.fillText(`Target: ${target}`, 10, 20);
  }

  function step() {
    if (index < array.length) {
      if (array[index] === target) { draw(); return true; }
      index++;
      draw();
      return false;
    }
    draw();
    return true;
  }

  function reset() {
    array = generateRandomArray(20, height - 20).sort((a, b) => a - b);
    target = array[Math.floor(Math.random() * array.length)];
    index = 0;
    draw();
  }
  function setSpeed() {}
  draw();
  return { step, reset, setSpeed, stop: () => {} };
}

function setupBinarySearch(canvas) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  let array = generateRandomArray(20, height - 20).sort((a, b) => a - b);
  let target = array[Math.floor(Math.random() * array.length)];
  let left = 0, right = array.length - 1, mid = 0;

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const barWidth = width / array.length;
    array.forEach((value, i) => {
      let color = "#3b82f6";
      if (i >= left && i <= right) color = "#ef4444";
      if (i === mid) color = "#f59e0b";
      if (value === target) color = "#10b981";
      ctx.fillStyle = color;
      ctx.fillRect(i * barWidth, height - value, barWidth - 1, value);
    });
    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.fillText(`Target: ${target}`, 10, 20);
  }

  function step() {
    if (left <= right) {
      mid = Math.floor((left + right) / 2);
      if (array[mid] === target) { draw(); return true; }
      if (array[mid] < target) left = mid + 1;
      else right = mid - 1;
      draw();
      return false;
    }
    draw();
    return true;
  }

  function reset() {
    array = generateRandomArray(20, height - 20).sort((a, b) => a - b);
    target = array[Math.floor(Math.random() * array.length)];
    left = 0;
    right = array.length - 1;
    mid = 0;
    draw();
  }
  function setSpeed() {}
  draw();
  return { step, reset, setSpeed, stop: () => {} };
}

function setupJumpSearch(canvas) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  let array = generateRandomArray(20, height - 20).sort((a, b) => a - b);
  let target = array[Math.floor(Math.random() * array.length)];
  let step = Math.floor(Math.sqrt(array.length));
  let prev = 0, curr = step;

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const barWidth = width / array.length;
    array.forEach((value, i) => {
      let color = "#3b82f6";
      if (i === curr) color = "#f59e0b";
      if (i === prev) color = "#ef4444";
      if (value === target) color = "#10b981";
      ctx.fillStyle = color;
      ctx.fillRect(i * barWidth, height - value, barWidth - 1, value);
    });
    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.fillText(`Target: ${target}`, 10, 20);
  }

  function stepFunc() {
    if (curr < array.length && array[curr] < target) {
      prev = curr;
      curr += step;
      draw();
      return false;
    }
    for (let i = prev; i <= Math.min(curr, array.length - 1); i++) {
      if (array[i] === target) { draw(); return true; }
    }
    draw();
    return true;
  }

  function reset() {
    array = generateRandomArray(20, height - 20).sort((a, b) => a - b);
    target = array[Math.floor(Math.random() * array.length)];
    step = Math.floor(Math.sqrt(array.length));
    prev = 0;
    curr = step;
    draw();
  }
  function setSpeed() {}
  draw();
  return { step: stepFunc, reset, setSpeed, stop: () => {} };
}

function setupInterpolationSearch(canvas) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  let array = generateRandomArray(20, height - 20).sort((a, b) => a - b);
  let target = array[Math.floor(Math.random() * array.length)];
  let left = 0, right = array.length - 1, pos = 0;

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const barWidth = width / array.length;
    array.forEach((value, i) => {
      let color = "#3b82f6";
      if (i >= left && i <= right) color = "#ef4444";
      if (i === pos) color = "#f59e0b";
      if (value === target) color = "#10b981";
      ctx.fillStyle = color;
      ctx.fillRect(i * barWidth, height - value, barWidth - 1, value);
    });
    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.fillText(`Target: ${target}`, 10, 20);
  }

  function step() {
    if (left <= right && target >= array[left] && target <= array[right]) {
      pos = left + Math.floor(((target - array[left]) * (right - left)) / (array[right] - array[left]));
      if (array[pos] === target) { draw(); return true; }
      if (array[pos] < target) left = pos + 1;
      else right = pos - 1;
      draw();
      return false;
    }
    draw();
    return true;
  }

  function reset() {
    array = generateRandomArray(20, height - 20).sort((a, b) => a - b);
    target = array[Math.floor(Math.random() * array.length)];
    left = 0;
    right = array.length - 1;
    pos = 0;
    draw();
  }
  function setSpeed() {}
  draw();
  return { step, reset, setSpeed, stop: () => {} };
}

function setupExponentialSearch(canvas) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  let array = generateRandomArray(20, height - 20).sort((a, b) => a - b);
  let target = array[Math.floor(Math.random() * array.length)];
  let i = 1, stage = "exponential";

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const barWidth = width / array.length;
    array.forEach((value, index) => {
      let color = "#3b82f6";
      if (index === i) color = "#f59e0b";
      if (value === target) color = "#10b981";
      ctx.fillStyle = color;
      ctx.fillRect(index * barWidth, height - value, barWidth - 1, value);
    });
    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.fillText(`Target: ${target}`, 10, 20);
  }

  function step() {
    if (stage === "exponential") {
      if (i < array.length && array[i] < target) {
        i *= 2;
        draw();
        return false;
      }
      stage = "binary";
    } else {
      const left = Math.floor(i / 2);
      const right = Math.min(i, array.length - 1);
      const mid = Math.floor((left + right) / 2);
      if (array[mid] === target) { draw(); return true; }
      if (left >= right) { draw(); return true; }
      if (array[mid] < target) i = mid + 1;
      else i = mid - 1;
      draw();
      return false;
    }
    return false;
  }

  function reset() {
    array = generateRandomArray(20, height - 20).sort((a, b) => a - b);
    target = array[Math.floor(Math.random() * array.length)];
    i = 1;
    stage = "exponential";
    draw();
  }
  function setSpeed() {}
  draw();
  return { step, reset, setSpeed, stop: () => {} };
}

function setupStalinSort(canvas) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  let array = generateRandomArray(20, height - 20);
  let result = [];
  let i = 0, last = -Infinity;

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const barWidth = width / array.length;
    array.forEach((value, index) => {
      ctx.fillStyle = index === i ? "#ef4444" : result.includes(index) ? "#10b981" : "#3b82f6";
      ctx.fillRect(index * barWidth, height - value, barWidth - 1, value);
    });
  }

  function step() {
    if (i < array.length) {
      if (array[i] >= last) {
        result.push(i);
        last = array[i];
      }
      i++;
      draw();
      return false;
    }
    draw();
    return true;
  }

  function reset() { array = generateRandomArray(20, height - 20); result = []; i = 0; last = -Infinity; draw(); }
  function setSpeed() {}
  draw();
  return { step, reset, setSpeed, stop: () => {} };
}

// ============================================================================
// PATHFINDING ALGORITHMS
// ============================================================================

function setupDijkstra(canvas) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const gridSize = 10;
  const cellSize = Math.min(width, height) / gridSize;
  let grid = Array(gridSize).fill().map(() => Array(gridSize).fill(1));
  let start = [0, 0], end = [gridSize - 1, gridSize - 1];
  let distances = Array(gridSize).fill().map(() => Array(gridSize).fill(Infinity));
  let visited = Array(gridSize).fill().map(() => Array(gridSize).fill(false));
  let queue = [[0, 0, 0]];
  distances[0][0] = 0;

  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        ctx.fillStyle = visited[i][j] ? "#10b981" : distances[i][j] < Infinity ? "#3b82f6" : "#e5e7eb";
        if (i === start[0] && j === start[1]) ctx.fillStyle = "#f59e0b";
        if (i === end[0] && j === end[1]) ctx.fillStyle = "#ef4444";
        ctx.fillRect(j * cellSize, i * cellSize, cellSize - 1, cellSize - 1);
      }
    }
  }

  function step() {
    if (queue.length === 0) { draw(); return true; }
    queue.sort((a, b) => a[2] - b[2]);
    const [x, y, dist] = queue.shift();
    if (visited[x][y]) return step();
    visited[x][y] = true;
    if (x === end[0] && y === end[1]) { draw(); return true; }
    [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dx, dy]) => {
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize && !visited[nx][ny] && grid[nx][ny] === 1) {
        const newDist = dist + 1;
        if (newDist < distances[nx][ny]) {
          distances[nx][ny] = newDist;
          queue.push([nx, ny, newDist]);
        }
      }
    });
    draw();
    return false;
  }

  function reset() {
    grid = Array(gridSize).fill().map(() => Array(gridSize).fill(1));
    distances = Array(gridSize).fill().map(() => Array(gridSize).fill(Infinity));
    visited = Array(gridSize).fill().map(() => Array(gridSize).fill(false));
    queue = [[0, 0, 0]];
    distances[0][0] = 0;
    draw();
  }
  function setSpeed() {}
  draw();
  return { step, reset, setSpeed, stop: () => {} };
}

function setupAStar(canvas) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const gridSize = 10;
  const cellSize = Math.min(width, height) / gridSize;
  let grid = Array(gridSize).fill().map(() => Array(gridSize).fill(1));
  let start = [0, 0], end = [gridSize - 1, gridSize - 1];
  let openSet = [[0, 0, 0, 0]];
  let closedSet = Array(gridSize).fill().map(() => Array(gridSize).fill(false));
  let gScore = Array(gridSize).fill().map(() => Array(gridSize).fill(Infinity));
  gScore[0][0] = 0;

  function heuristic(x, y) {
    return Math.abs(x - end[0]) + Math.abs(y - end[1]);
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        ctx.fillStyle = closedSet[i][j] ? "#10b981" : openSet.some(([x, y]) => x === i && y === j) ? "#3b82f6" : "#e5e7eb";
        if (i === start[0] && j === start[1]) ctx.fillStyle = "#f59e0b";
        if (i === end[0] && j === end[1]) ctx.fillStyle = "#ef4444";
        ctx.fillRect(j * cellSize, i * cellSize, cellSize - 1, cellSize - 1);
      }
    }
  }

  function step() {
    if (openSet.length === 0) { draw(); return true; }
    openSet.sort((a, b) => a[3] - b[3]);
    const [x, y] = openSet.shift();
    if (closedSet[x][y]) return step();
    closedSet[x][y] = true;
    if (x === end[0] && y === end[1]) { draw(); return true; }
    [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dx, dy]) => {
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize && !closedSet[nx][ny] && grid[nx][ny] === 1) {
        const tentativeG = gScore[x][y] + 1;
        if (tentativeG < gScore[nx][ny]) {
          gScore[nx][ny] = tentativeG;
          const fScore = tentativeG + heuristic(nx, ny);
          if (!openSet.some(([ox, oy]) => ox === nx && oy === ny)) {
            openSet.push([nx, ny, tentativeG, fScore]);
          }
        }
      }
    });
    draw();
    return false;
  }

  function reset() {
    grid = Array(gridSize).fill().map(() => Array(gridSize).fill(1));
    openSet = [[0, 0, 0, 0]];
    closedSet = Array(gridSize).fill().map(() => Array(gridSize).fill(false));
    gScore = Array(gridSize).fill().map(() => Array(gridSize).fill(Infinity));
    gScore[0][0] = 0;
    draw();
  }
  function setSpeed() {}
  draw();
  return { step, reset, setSpeed, stop: () => {} };
}

function setupBellmanFord(canvas) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const nodes = 8;
  let edges = [];
  let distances = Array(nodes).fill(Infinity);
  distances[0] = 0;
  let iteration = 0, edgeIndex = 0;

  // Create graph
  for (let i = 0; i < nodes; i++) {
    for (let j = i + 1; j < Math.min(i + 3, nodes); j++) {
      edges.push([i, j, Math.floor(Math.random() * 10) + 1]);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const nodeSpacing = width / nodes;
    edges.forEach(([from, to, weight], idx) => {
      const x1 = from * nodeSpacing + nodeSpacing / 2;
      const y1 = height / 2;
      const x2 = to * nodeSpacing + nodeSpacing / 2;
      const y2 = height / 2;
      ctx.strokeStyle = idx === edgeIndex ? "#ef4444" : "#3b82f6";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.fillStyle = "#000";
      ctx.font = "10px Arial";
      ctx.fillText(weight, (x1 + x2) / 2, (y1 + y2) / 2 - 5);
    });
    for (let i = 0; i < nodes; i++) {
      ctx.fillStyle = distances[i] < Infinity ? "#10b981" : "#ef4444";
      ctx.beginPath();
      ctx.arc(i * nodeSpacing + nodeSpacing / 2, height / 2, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(i, i * nodeSpacing + nodeSpacing / 2, height / 2 + 4);
      ctx.fillText(distances[i] === Infinity ? "∞" : distances[i], i * nodeSpacing + nodeSpacing / 2, height / 2 + 20);
    }
  }

  function step() {
    if (iteration >= nodes - 1) { draw(); return true; }
    if (edgeIndex < edges.length) {
      const [from, to, weight] = edges[edgeIndex];
      if (distances[from] !== Infinity && distances[from] + weight < distances[to]) {
        distances[to] = distances[from] + weight;
      }
      edgeIndex++;
      draw();
      return false;
    }
    edgeIndex = 0;
    iteration++;
    draw();
    return false;
  }

  function reset() {
    edges = [];
    for (let i = 0; i < nodes; i++) {
      for (let j = i + 1; j < Math.min(i + 3, nodes); j++) {
        edges.push([i, j, Math.floor(Math.random() * 10) + 1]);
      }
    }
    distances = Array(nodes).fill(Infinity);
    distances[0] = 0;
    iteration = 0;
    edgeIndex = 0;
    draw();
  }
  function setSpeed() {}
  draw();
  return { step, reset, setSpeed, stop: () => {} };
}

function setupFloydWarshall(canvas) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const nodes = 6;
  let dist = Array(nodes).fill().map(() => Array(nodes).fill(Infinity));
  let k = 0, i = 0, j = 0;

  // Initialize
  for (let i = 0; i < nodes; i++) dist[i][i] = 0;
  for (let i = 0; i < nodes; i++) {
    for (let j = i + 1; j < Math.min(i + 2, nodes); j++) {
      dist[i][j] = Math.floor(Math.random() * 10) + 1;
      dist[j][i] = dist[i][j];
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const cellSize = Math.min(width, height) / nodes;
    for (let i = 0; i < nodes; i++) {
      for (let j = 0; j < nodes; j++) {
        ctx.fillStyle = (i === k || j === k) ? "#ef4444" : "#3b82f6";
        ctx.fillRect(j * cellSize, i * cellSize, cellSize - 1, cellSize - 1);
        ctx.fillStyle = "#fff";
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        ctx.fillText(dist[i][j] === Infinity ? "∞" : dist[i][j], j * cellSize + cellSize / 2, i * cellSize + cellSize / 2);
      }
    }
    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.fillText(`k=${k}, i=${i}, j=${j}`, 10, height - 10);
  }

  function step() {
    if (k < nodes) {
      if (i < nodes) {
        if (j < nodes) {
          if (dist[i][k] !== Infinity && dist[k][j] !== Infinity) {
            dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
          }
          j++;
        } else {
          j = 0;
          i++;
        }
      } else {
        i = 0;
        j = 0;
        k++;
      }
      draw();
      return false;
    }
    draw();
    return true;
  }

  function reset() {
    dist = Array(nodes).fill().map(() => Array(nodes).fill(Infinity));
    for (let i = 0; i < nodes; i++) dist[i][i] = 0;
    for (let i = 0; i < nodes; i++) {
      for (let j = i + 1; j < Math.min(i + 2, nodes); j++) {
        dist[i][j] = Math.floor(Math.random() * 10) + 1;
        dist[j][i] = dist[i][j];
      }
    }
    k = 0; i = 0; j = 0;
    draw();
  }
  function setSpeed() {}
  draw();
  return { step, reset, setSpeed, stop: () => {} };
}

function setupPrims(canvas) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const nodes = 8;
  let edges = [];
  let mst = [];
  let inMST = Array(nodes).fill(false);
  inMST[0] = true;
  let minEdge = null, minIndex = -1;

  // Create graph
  for (let i = 0; i < nodes; i++) {
    for (let j = i + 1; j < nodes; j++) {
      if (Math.random() > 0.7) {
        edges.push([i, j, Math.floor(Math.random() * 20) + 1]);
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const nodeSpacing = width / nodes;
    edges.forEach(([from, to, weight], idx) => {
      const x1 = from * nodeSpacing + nodeSpacing / 2;
      const y1 = height / 2;
      const x2 = to * nodeSpacing + nodeSpacing / 2;
      const y2 = height / 2;
      const inMSTEdge = mst.some(([f, t]) => (f === from && t === to) || (f === to && t === from));
      ctx.strokeStyle = inMSTEdge ? "#10b981" : idx === minIndex ? "#ef4444" : "#e5e7eb";
      ctx.lineWidth = inMSTEdge ? 3 : 1;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    });
    for (let i = 0; i < nodes; i++) {
      ctx.fillStyle = inMST[i] ? "#10b981" : "#3b82f6";
      ctx.beginPath();
      ctx.arc(i * nodeSpacing + nodeSpacing / 2, height / 2, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(i, i * nodeSpacing + nodeSpacing / 2, height / 2 + 4);
    }
  }

  function step() {
    if (mst.length >= nodes - 1) { draw(); return true; }
    minEdge = null;
    minIndex = -1;
    edges.forEach(([from, to, weight], idx) => {
      if ((inMST[from] && !inMST[to]) || (!inMST[from] && inMST[to])) {
        if (!minEdge || weight < minEdge[2]) {
          minEdge = [from, to, weight];
          minIndex = idx;
        }
      }
    });
    if (minEdge) {
      mst.push(minEdge);
      inMST[minEdge[0]] = true;
      inMST[minEdge[1]] = true;
    }
    draw();
    return mst.length >= nodes - 1 || !minEdge;
  }

  function reset() {
    edges = [];
    for (let i = 0; i < nodes; i++) {
      for (let j = i + 1; j < nodes; j++) {
        if (Math.random() > 0.7) {
          edges.push([i, j, Math.floor(Math.random() * 20) + 1]);
        }
      }
    }
    mst = [];
    inMST = Array(nodes).fill(false);
    inMST[0] = true;
    minEdge = null;
    minIndex = -1;
    draw();
  }
  function setSpeed() {}
  draw();
  return { step, reset, setSpeed, stop: () => {} };
}

function setupKruskals(canvas) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const nodes = 8;
  let edges = [];
  let mst = [];
  let parent = Array(nodes).fill().map((_, i) => i);
  let edgeIndex = 0;

  function find(x) {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }

  function union(x, y) {
    parent[find(x)] = find(y);
  }

  // Create graph
  for (let i = 0; i < nodes; i++) {
    for (let j = i + 1; j < nodes; j++) {
      if (Math.random() > 0.7) {
        edges.push([i, j, Math.floor(Math.random() * 20) + 1]);
      }
    }
  }
  edges.sort((a, b) => a[2] - b[2]);

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const nodeSpacing = width / nodes;
    edges.forEach(([from, to, weight], idx) => {
      const x1 = from * nodeSpacing + nodeSpacing / 2;
      const y1 = height / 2;
      const x2 = to * nodeSpacing + nodeSpacing / 2;
      const y2 = height / 2;
      const inMSTEdge = mst.some(([f, t]) => (f === from && t === to) || (f === to && t === from));
      ctx.strokeStyle = inMSTEdge ? "#10b981" : idx === edgeIndex ? "#ef4444" : "#e5e7eb";
      ctx.lineWidth = inMSTEdge ? 3 : 1;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    });
    for (let i = 0; i < nodes; i++) {
      ctx.fillStyle = "#3b82f6";
      ctx.beginPath();
      ctx.arc(i * nodeSpacing + nodeSpacing / 2, height / 2, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(i, i * nodeSpacing + nodeSpacing / 2, height / 2 + 4);
    }
  }

  function step() {
    if (mst.length >= nodes - 1 || edgeIndex >= edges.length) { draw(); return true; }
    const [from, to, weight] = edges[edgeIndex];
    if (find(from) !== find(to)) {
      union(from, to);
      mst.push([from, to, weight]);
    }
    edgeIndex++;
    draw();
    return mst.length >= nodes - 1 || edgeIndex >= edges.length;
  }

  function reset() {
    edges = [];
    for (let i = 0; i < nodes; i++) {
      for (let j = i + 1; j < nodes; j++) {
        if (Math.random() > 0.7) {
          edges.push([i, j, Math.floor(Math.random() * 20) + 1]);
        }
      }
    }
    edges.sort((a, b) => a[2] - b[2]);
    mst = [];
    parent = Array(nodes).fill().map((_, i) => i);
    edgeIndex = 0;
    draw();
  }
  function setSpeed() {}
  draw();
  return { step, reset, setSpeed, stop: () => {} };
}

// ============================================================================
// OTHER ALGORITHMS
// ============================================================================

function setupTopK(canvas) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  let array = generateRandomArray(20, height - 20);
  let k = 5;
  let heap = [];
  let i = 0;

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const barWidth = width / array.length;
    array.forEach((value, index) => {
      ctx.fillStyle = heap.includes(index) ? "#10b981" : index === i ? "#ef4444" : "#3b82f6";
      ctx.fillRect(index * barWidth, height - value, barWidth - 1, value);
    });
    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.fillText(`Top ${k} elements`, 10, 20);
  }

  function step() {
    if (i < array.length) {
      if (heap.length < k) {
        heap.push(i);
      } else {
        const minIdx = heap.reduce((min, idx) => array[idx] < array[min] ? idx : min, heap[0]);
        if (array[i] > array[minIdx]) {
          heap[heap.indexOf(minIdx)] = i;
        }
      }
      i++;
      draw();
      return false;
    }
    draw();
    return true;
  }

  function reset() { array = generateRandomArray(20, height - 20); heap = []; i = 0; draw(); }
  function setSpeed() {}
  draw();
  return { step, reset, setSpeed, stop: () => {} };
}

function setupBacktracking(canvas) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const n = 8;
  let board = Array(n).fill(-1);
  let row = 0, col = 0;

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const cellSize = Math.min(width, height) / n;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        ctx.fillStyle = (i + j) % 2 === 0 ? "#f3f4f6" : "#d1d5db";
        if (i === row && j === col) ctx.fillStyle = "#ef4444";
        if (board[i] === j) ctx.fillStyle = "#10b981";
        ctx.fillRect(j * cellSize, i * cellSize, cellSize - 1, cellSize - 1);
        if (board[i] === j) {
          ctx.fillStyle = "#000";
          ctx.font = "20px Arial";
          ctx.textAlign = "center";
          ctx.fillText("♕", j * cellSize + cellSize / 2, i * cellSize + cellSize / 2 + 7);
        }
      }
    }
  }

  function isValid(row, col) {
    for (let i = 0; i < row; i++) {
      if (board[i] === col || Math.abs(board[i] - col) === Math.abs(i - row)) return false;
    }
    return true;
  }

  function step() {
    if (row >= n) { draw(); return true; }
    if (col < n) {
      if (isValid(row, col)) {
        board[row] = col;
        row++;
        col = 0;
      } else {
        col++;
      }
      draw();
      return false;
    } else {
      board[row] = -1;
      row--;
      if (row >= 0) col = board[row] + 1;
      draw();
      return row < 0;
    }
  }

  function reset() { board = Array(n).fill(-1); row = 0; col = 0; draw(); }
  function setSpeed() {}
  draw();
  return { step, reset, setSpeed, stop: () => {} };
}

function setupSlidingWindow(canvas) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  let array = generateRandomArray(15, height - 20);
  let k = 3;
  let windowStart = 0, windowEnd = k - 1;
  let maxSum = -Infinity, currentSum = 0;

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const barWidth = width / array.length;
    array.forEach((value, index) => {
      ctx.fillStyle = index >= windowStart && index <= windowEnd ? "#10b981" : "#3b82f6";
      ctx.fillRect(index * barWidth, height - value, barWidth - 1, value);
    });
    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.fillText(`Window size: ${k}, Max sum: ${maxSum === -Infinity ? '...' : maxSum}`, 10, 20);
  }

  function step() {
    if (windowEnd < array.length) {
      if (windowStart === 0) {
        currentSum = array.slice(0, k).reduce((a, b) => a + b, 0);
        maxSum = currentSum;
      } else {
        currentSum = currentSum - array[windowStart - 1] + array[windowEnd];
        maxSum = Math.max(maxSum, currentSum);
      }
      windowStart++;
      windowEnd++;
      draw();
      return false;
    }
    draw();
    return true;
  }

  function reset() {
    array = generateRandomArray(15, height - 20);
    windowStart = 0;
    windowEnd = k - 1;
    maxSum = -Infinity;
    currentSum = 0;
    draw();
  }
  function setSpeed() {}
  draw();
  return { step, reset, setSpeed, stop: () => {} };
}

function setupHuffman(canvas) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  let text = "HELLO WORLD";
  let freq = {};
  let nodes = [];
  let stepIndex = 0;

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.fillText(`Text: ${text}`, 10, 20);
    let y = 50;
    Object.entries(freq).sort((a, b) => b[1] - a[1]).forEach(([char, count], idx) => {
      ctx.fillText(`${char}: ${count}`, 10, y + idx * 20);
    });
    if (nodes.length > 0) {
      ctx.fillText(`Nodes: ${nodes.length}`, 10, height - 30);
    }
  }

  function step() {
    if (stepIndex === 0) {
      for (let char of text) freq[char] = (freq[char] || 0) + 1;
      stepIndex = 1;
    } else if (stepIndex === 1) {
      nodes = Object.entries(freq).map(([char, freq]) => ({ char, freq, left: null, right: null }));
      stepIndex = 2;
    } else if (nodes.length > 1) {
      nodes.sort((a, b) => a.freq - b.freq);
      const left = nodes.shift();
      const right = nodes.shift();
      nodes.push({ char: null, freq: left.freq + right.freq, left, right });
      draw();
      return false;
    } else {
      draw();
      return true;
    }
    draw();
    return false;
  }

  function reset() {
    text = "HELLO WORLD";
    freq = {};
    nodes = [];
    stepIndex = 0;
    draw();
  }
  function setSpeed() {}
  draw();
  return { step, reset, setSpeed, stop: () => {} };
}

function setupEuclid(canvas) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  let a = Math.floor(Math.random() * 100) + 50;
  let b = Math.floor(Math.random() * 100) + 50;
  let steps = [];

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";
    ctx.fillText(`GCD(${a}, ${b})`, 10, 30);
    let y = 60;
    steps.forEach((step, idx) => {
      ctx.fillText(step, 10, y + idx * 25);
    });
  }

  function step() {
    if (b !== 0) {
      const temp = b;
      b = a % b;
      steps.push(`${a} = ${Math.floor(a / temp)} × ${temp} + ${b}`);
      a = temp;
      draw();
      return false;
    }
    steps.push(`GCD = ${a}`);
    draw();
    return true;
  }

  function reset() {
    a = Math.floor(Math.random() * 100) + 50;
    b = Math.floor(Math.random() * 100) + 50;
    steps = [];
    draw();
  }
  function setSpeed() {}
  draw();
  return { step, reset, setSpeed, stop: () => {} };
}

function setupUnionFind(canvas) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const n = 8;
  let parent = Array(n).fill().map((_, i) => i);
  let rank = Array(n).fill(0);
  let operations = [[0, 1], [2, 3], [4, 5], [6, 7], [1, 2], [3, 4], [5, 6]];
  let opIndex = 0;

  function find(x) {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }

  function union(x, y) {
    const px = find(x), py = find(y);
    if (px === py) return;
    if (rank[px] < rank[py]) parent[px] = py;
    else if (rank[px] > rank[py]) parent[py] = px;
    else { parent[py] = px; rank[px]++; }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const nodeSpacing = width / n;
    for (let i = 0; i < n; i++) {
      const root = find(i);
      ctx.fillStyle = root === 0 ? "#10b981" : root === 1 ? "#3b82f6" : root === 2 ? "#f59e0b" : "#ef4444";
      ctx.beginPath();
      ctx.arc(i * nodeSpacing + nodeSpacing / 2, height / 2, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(i, i * nodeSpacing + nodeSpacing / 2, height / 2 + 4);
      ctx.fillText(`p:${parent[i]}`, i * nodeSpacing + nodeSpacing / 2, height / 2 + 30);
    }
    if (opIndex < operations.length) {
      ctx.fillStyle = "#000";
      ctx.font = "14px Arial";
      ctx.fillText(`Union(${operations[opIndex][0]}, ${operations[opIndex][1]})`, 10, 20);
    }
  }

  function step() {
    if (opIndex < operations.length) {
      union(operations[opIndex][0], operations[opIndex][1]);
      opIndex++;
      draw();
      return false;
    }
    draw();
    return true;
  }

  function reset() {
    parent = Array(n).fill().map((_, i) => i);
    rank = Array(n).fill(0);
    opIndex = 0;
    draw();
  }
  function setSpeed() {}
  draw();
  return { step, reset, setSpeed, stop: () => {} };
}

function setupKadane(canvas) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  let array = generateRandomArray(15, 100).map(x => x - 50);
  let maxSoFar = -Infinity;
  let maxEndingHere = 0;
  let i = 0;

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const barWidth = width / array.length;
    const zeroY = height / 2;
    array.forEach((value, index) => {
      ctx.fillStyle = index === i ? "#ef4444" : "#3b82f6";
      const barHeight = Math.abs(value);
      const y = value >= 0 ? zeroY - barHeight : zeroY;
      ctx.fillRect(index * barWidth, y, barWidth - 1, barHeight);
    });
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, zeroY);
    ctx.lineTo(width, zeroY);
    ctx.stroke();
    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.fillText(`Max subarray sum: ${maxSoFar === -Infinity ? '...' : maxSoFar}`, 10, 20);
  }

  function step() {
    if (i < array.length) {
      maxEndingHere = Math.max(array[i], maxEndingHere + array[i]);
      maxSoFar = Math.max(maxSoFar, maxEndingHere);
      i++;
      draw();
      return false;
    }
    draw();
    return true;
  }

  function reset() {
    array = generateRandomArray(15, 100).map(x => x - 50);
    maxSoFar = -Infinity;
    maxEndingHere = 0;
    i = 0;
    draw();
  }
  function setSpeed() {}
  draw();
  return { step, reset, setSpeed, stop: () => {} };
}

function setupFloydCycle(canvas) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  let array = Array.from({ length: 10 }, (_, i) => i);
  let cycleStart = 5;
  array[array.length - 1] = cycleStart;
  let slow = 0, fast = 0;
  let stage = "detect";

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const nodeSpacing = width / array.length;
    for (let i = 0; i < array.length; i++) {
      ctx.fillStyle = i === slow ? "#10b981" : i === fast ? "#ef4444" : "#3b82f6";
      ctx.beginPath();
      ctx.arc(i * nodeSpacing + nodeSpacing / 2, height / 2, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(i, i * nodeSpacing + nodeSpacing / 2, height / 2 + 4);
      if (i < array.length - 1) {
        ctx.strokeStyle = "#3b82f6";
        ctx.beginPath();
        ctx.moveTo(i * nodeSpacing + nodeSpacing, height / 2);
        ctx.lineTo((i + 1) * nodeSpacing, height / 2);
        ctx.stroke();
      }
    }
    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.fillText(`Stage: ${stage}`, 10, 20);
  }

  function step() {
    if (stage === "detect") {
      if (slow === fast && slow !== 0) {
        stage = "find-start";
        slow = 0;
      } else {
        slow = array[slow];
        fast = array[array[fast]];
      }
      draw();
      return false;
    } else {
      if (slow === fast) {
        draw();
        return true;
      }
      slow = array[slow];
      fast = array[fast];
      draw();
      return false;
    }
  }

  function reset() {
    array = Array.from({ length: 10 }, (_, i) => i);
    cycleStart = 5;
    array[array.length - 1] = cycleStart;
    slow = 0;
    fast = 0;
    stage = "detect";
    draw();
  }
  function setSpeed() {}
  draw();
  return { step, reset, setSpeed, stop: () => {} };
}

function setupKMP(canvas) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  let text = "ABABDABACDABABCABCABAB";
  let pattern = "ABABCABAB";
  let lps = Array(pattern.length).fill(0);
  let i = 0, j = 0;
  let stage = "build-lps";

  function buildLPS() {
    let len = 0;
    lps[0] = 0;
    i = 1;
    while (i < pattern.length) {
      if (pattern[i] === pattern[len]) {
        len++;
        lps[i] = len;
        i++;
      } else {
        if (len !== 0) len = lps[len - 1];
        else { lps[i] = 0; i++; }
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#000";
    ctx.font = "12px Arial";
    ctx.fillText(`Text: ${text}`, 10, 20);
    ctx.fillText(`Pattern: ${pattern}`, 10, 40);
    if (stage === "build-lps") {
      ctx.fillText(`Building LPS array...`, 10, 60);
      pattern.split('').forEach((char, idx) => {
        ctx.fillText(`${char}:${lps[idx]}`, 10 + idx * 30, 80);
      });
    } else {
      ctx.fillText(`i=${i}, j=${j}`, 10, 60);
      text.split('').forEach((char, idx) => {
        ctx.fillStyle = idx === i ? "#ef4444" : idx >= i - j && idx < i ? "#10b981" : "#3b82f6";
        ctx.fillText(char, 10 + idx * 15, 80);
      });
    }
  }

  function step() {
    if (stage === "build-lps") {
      buildLPS();
      stage = "search";
      i = 0;
      j = 0;
      draw();
      return false;
    } else {
      if (i < text.length) {
        if (text[i] === pattern[j]) {
          i++;
          j++;
        }
        if (j === pattern.length) {
          draw();
          return true;
        } else if (i < text.length && text[i] !== pattern[j]) {
          if (j !== 0) j = lps[j - 1];
          else i++;
        }
        draw();
        return false;
      }
      draw();
      return true;
    }
  }

  function reset() {
    text = "ABABDABACDABABCABCABAB";
    pattern = "ABABCABAB";
    lps = Array(pattern.length).fill(0);
    i = 0;
    j = 0;
    stage = "build-lps";
    draw();
  }
  function setSpeed() {}
  draw();
  return { step, reset, setSpeed, stop: () => {} };
}

function setupQuickSelect(canvas) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  let array = generateRandomArray(20, height - 20);
  let k = 5;
  let left = 0, right = array.length - 1;
  let pivotIndex = 0;

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const barWidth = width / array.length;
    array.forEach((value, index) => {
      let color = "#3b82f6";
      if (index === pivotIndex) color = "#10b981";
      if (index >= left && index <= right) color = "#ef4444";
      ctx.fillStyle = color;
      ctx.fillRect(index * barWidth, height - value, barWidth - 1, value);
    });
    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.fillText(`Finding ${k}th smallest element`, 10, 20);
  }

  function step() {
    if (left <= right) {
      const pivot = array[right];
      let i = left;
      for (let j = left; j < right; j++) {
        if (array[j] < pivot) {
          [array[i], array[j]] = [array[j], array[i]];
          i++;
        }
      }
      [array[i], array[right]] = [array[right], array[i]];
      pivotIndex = i;
      if (i === k - 1) {
        draw();
        return true;
      } else if (i < k - 1) {
        left = i + 1;
      } else {
        right = i - 1;
      }
      draw();
      return false;
    }
    draw();
    return true;
  }

  function reset() {
    array = generateRandomArray(20, height - 20);
    k = 5;
    left = 0;
    right = array.length - 1;
    pivotIndex = 0;
    draw();
  }
  function setSpeed() {}
  draw();
  return { step, reset, setSpeed, stop: () => {} };
}

function setupBoyerMoore(canvas) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  let text = "THIS IS A TEST TEXT";
  let pattern = "TEXT";
  let badChar = {};
  let i = 0, j = pattern.length - 1;

  function buildBadChar() {
    for (let i = 0; i < pattern.length; i++) {
      badChar[pattern[i]] = i;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#000";
    ctx.font = "12px Arial";
    ctx.fillText(`Text: ${text}`, 10, 20);
    ctx.fillText(`Pattern: ${pattern}`, 10, 40);
    ctx.fillText(`i=${i}, j=${j}`, 10, 60);
    text.split('').forEach((char, idx) => {
      ctx.fillStyle = idx === i ? "#ef4444" : idx >= i && idx < i + pattern.length ? "#10b981" : "#3b82f6";
      ctx.fillText(char, 10 + idx * 15, 80);
    });
  }

  function step() {
    if (i <= text.length - pattern.length) {
      if (j >= 0 && text[i + j] === pattern[j]) {
        j--;
      } else {
        if (j < 0) {
          draw();
          return true;
        }
        const skip = badChar[text[i + j]] !== undefined ? Math.max(1, j - badChar[text[i + j]]) : j + 1;
        i += skip;
        j = pattern.length - 1;
      }
      draw();
      return false;
    }
    draw();
    return true;
  }

  function reset() {
    text = "THIS IS A TEST TEXT";
    pattern = "TEXT";
    buildBadChar();
    i = 0;
    j = pattern.length - 1;
    draw();
  }
  function setSpeed() {}
  buildBadChar();
  draw();
  return { step, reset, setSpeed, stop: () => {} };
}

function setupMazeGeneration(canvas) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const gridSize = 15;
  const cellSize = Math.min(width, height) / gridSize;
  let grid = Array(gridSize).fill().map(() => Array(gridSize).fill(1));
  let stack = [[1, 1]];
  grid[1][1] = 0;

  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        ctx.fillStyle = grid[i][j] === 0 ? "#fff" : "#000";
        ctx.fillRect(j * cellSize, i * cellSize, cellSize - 1, cellSize - 1);
      }
    }
    if (stack.length > 0) {
      const [x, y] = stack[stack.length - 1];
      ctx.fillStyle = "#10b981";
      ctx.fillRect(y * cellSize, x * cellSize, cellSize - 1, cellSize - 1);
    }
  }

  function step() {
    if (stack.length === 0) { draw(); return true; }
    const [x, y] = stack[stack.length - 1];
    const neighbors = [[-2,0],[2,0],[0,-2],[0,2]].filter(([dx, dy]) => {
      const nx = x + dx, ny = y + dy;
      return nx > 0 && nx < gridSize - 1 && ny > 0 && ny < gridSize - 1 && grid[nx][ny] === 1;
    });
    if (neighbors.length > 0) {
      const [dx, dy] = neighbors[Math.floor(Math.random() * neighbors.length)];
      const nx = x + dx, ny = y + dy;
      grid[nx][ny] = 0;
      grid[x + dx/2][y + dy/2] = 0;
      stack.push([nx, ny]);
    } else {
      stack.pop();
    }
    draw();
    return false;
  }

  function reset() {
    grid = Array(gridSize).fill().map(() => Array(gridSize).fill(1));
    stack = [[1, 1]];
    grid[1][1] = 0;
    draw();
  }
  function setSpeed() {}
  draw();
  return { step, reset, setSpeed, stop: () => {} };
}
