const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreText = document.getElementById("score");

const boxSize = 20;
const canvasSize = 400;

let snake;
let direction;
let food;
let score;
let game;

function startGame() {
  snake = [{ x: 200, y: 200 }];
  direction = "RIGHT";
  score = 0;
  scoreText.textContent = score;
  food = createFood();

  clearInterval(game);
  game = setInterval(updateGame, 120);
}

function createFood() {
  return {
    x: Math.floor(Math.random() * (canvasSize / boxSize)) * boxSize,
    y: Math.floor(Math.random() * (canvasSize / boxSize)) * boxSize
  };
}

function updateGame() {
  ctx.clearRect(0, 0, canvasSize, canvasSize);
  moveSnake();
  drawFood();
  drawSnake();
  checkGameOver();
}

function moveSnake() {
  const head = { ...snake[0] };

  if (direction === "UP") head.y -= boxSize;
  if (direction === "DOWN") head.y += boxSize;
  if (direction === "LEFT") head.x -= boxSize;
  if (direction === "RIGHT") head.x += boxSize;

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreText.textContent = score;
    food = createFood();
  } else {
    snake.pop();
  }
}

function drawSnake() {
  ctx.fillStyle = "lime";
  snake.forEach(part => {
    ctx.fillRect(part.x, part.y, boxSize, boxSize);
  });
}

function drawFood() {
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, boxSize, boxSize);
}

function checkGameOver() {
  const head = snake[0];

  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= canvasSize ||
    head.y >= canvasSize
  ) {
    endGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      endGame();
    }
  }
}

function endGame() {
  clearInterval(game);
  alert("Game Over! Score: " + score);
}

function resetGame() {
  startGame();
}

document.addEventListener("keydown", event => {
  if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});


startGame();
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener("touchstart", e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

document.addEventListener("touchend", e => {
  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;

  const diffX = touchEndX - touchStartX;
  const diffY = touchEndY - touchStartY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    // Left or Right
    if (diffX > 0 && direction !== "LEFT") direction = "RIGHT";
    if (diffX < 0 && direction !== "RIGHT") direction = "LEFT";
  } else {
    // Up or Down
    if (diffY > 0 && direction !== "UP") direction = "DOWN";
    if (diffY < 0 && direction !== "DOWN") direction = "UP";
  }
});
