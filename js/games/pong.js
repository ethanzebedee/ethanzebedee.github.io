// Simple Pong implementation using canvas

export function setupPongGameWindow(windowElement) {
  const canvas = windowElement.querySelector(".pong-canvas");
  const statusEl = windowElement.querySelector(".pong-status");
  const scoreEl = windowElement.querySelector(".pong-score");
  const resetBtn = windowElement.querySelector(".pong-reset-btn");

  if (!canvas || !statusEl || !scoreEl || !resetBtn) return;

  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  let playerY;
  let aiY;
  const paddleWidth = 10;
  const paddleHeight = 60;
  const paddleMargin = 10;

  let ballX;
  let ballY;
  let ballVX;
  let ballVY;
  const ballRadius = 6;

  let playerScore;
  let aiScore;
  let running = true;

  function resetBall(dir = 1) {
    ballX = width / 2;
    ballY = height / 2;
    ballVX = 3 * dir;
    ballVY = (Math.random() * 4 - 2) || 2;
  }

  function newGame() {
    playerY = height / 2 - paddleHeight / 2;
    aiY = height / 2 - paddleHeight / 2;
    playerScore = 0;
    aiScore = 0;
    running = true;
    statusEl.textContent = "Use W/S or ↑/↓ to move.";
    resetBall();
    draw();
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // background
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, width, height);

    // middle line
    ctx.strokeStyle = "#1f2937";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
    ctx.setLineDash([]);

    // paddles
    ctx.fillStyle = "#e5e7eb";
    ctx.fillRect(paddleMargin, playerY, paddleWidth, paddleHeight);
    ctx.fillRect(width - paddleMargin - paddleWidth, aiY, paddleWidth, paddleHeight);

    // ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  function update() {
    if (!running) return;

    ballX += ballVX;
    ballY += ballVY;

    // top/bottom
    if (ballY - ballRadius < 0 || ballY + ballRadius > height) {
      ballVY *= -1;
    }

    // paddles
    // player
    if (
      ballX - ballRadius < paddleMargin + paddleWidth &&
      ballY > playerY &&
      ballY < playerY + paddleHeight
    ) {
      ballVX = Math.abs(ballVX);
    }

    // AI
    if (
      ballX + ballRadius > width - paddleMargin - paddleWidth &&
      ballY > aiY &&
      ballY < aiY + paddleHeight
    ) {
      ballVX = -Math.abs(ballVX);
    }

    // scoring
    if (ballX < 0) {
      aiScore += 1;
      updateScore();
      resetBall(1);
    } else if (ballX > width) {
      playerScore += 1;
      updateScore();
      resetBall(-1);
    }

    // simple AI follows ball
    const target = ballY - paddleHeight / 2;
    aiY += (target - aiY) * 0.06;

    draw();
    requestAnimationFrame(update);
  }

  function updateScore() {
    scoreEl.textContent = `${playerScore} : ${aiScore}`;
  }

  function handleKey(e) {
    const key = e.key.toLowerCase();
    if (key === "arrowup" || key === "w") {
      playerY -= 12;
    } else if (key === "arrowdown" || key === "s") {
      playerY += 12;
    }
    playerY = Math.max(0, Math.min(height - paddleHeight, playerY));
  }

  window.addEventListener("keydown", handleKey);
  resetBtn.addEventListener("click", () => newGame());

  newGame();
  requestAnimationFrame(update);
}
