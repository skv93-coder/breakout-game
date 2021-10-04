const canvas = document.getElementById("myCanvas");

const ctx = canvas.getContext("2d");

let rightPressed = false;
let leftPressed = false;
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;

let lives = 3;

let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

let score = 0;

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}

let bricks = [];
for (let i = 0; i < brickColumnCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickRowCount; j++) {
    bricks[i][j] = { status: 1, x: 0, y: 0 };
  }
}
console.log(bricks);

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function drawBricks() {
  for (let i = 0; i < brickColumnCount; i++) {
    for (let j = 0; j < brickRowCount; j++) {
      const brickX = i * (brickWidth + brickPadding) + brickOffsetLeft;
      const brickY = j * (brickHeight + brickPadding) + brickOffsetTop;
      if (bricks[i][j].status === 1) {
        bricks[i][j] = { status: 1, x: brickX, y: brickY };
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

const interval = setInterval(() => {
  draw();
}, 10);

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
    console.log({ e });
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}
function collisionDetection() {
  for (let i = 0; i < brickColumnCount; i++) {
    for (let j = 0; j < brickRowCount; j++) {
      const b = bricks[i][j];
      if (
        x > b.x &&
        x < b.x + brickWidth &&
        y > b.y &&
        y < b.y + brickHeight &&
        b.status === 1
      ) {
        dy = -dy;
        bricks[i][j].status = 0;
        score++;
      }
    }
  }
}
function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status == 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score == brickRowCount * brickColumnCount) {
            alert("YOU WIN, CONGRATS!");
            document.location.reload();
            clearInterval(interval); // Needed for Chrome to end game
          }
        }
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawBricks();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      if (!lives) {
        alert("GAME OVER");
        document.location.reload();
        clearInterval(interval);
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (rightPressed) {
    paddleX += 7;
    if (paddleX + paddleWidth >= canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
  } else if (leftPressed) {
    paddleX -= 7;
    if (paddleX < 0) {
      paddleX = 0;
    }
  }
  x += dx;
  y += dy;
}
