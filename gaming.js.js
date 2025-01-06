const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

let player = {
    x: 50,
    y: 500,
    width: 50,
    height: 50,
    color: "green",
    speed: 5,
    jumping: false,
    inAir: false,
};

let obstacles = [];
let highScore = 0;
let score=0;
let memeMeter = 1; // Meme meter as a dynamic speed multiplier
let gameRunning = true;

// DOM Elements
const highScoreTag = document.getElementById("high-score");
const ScoreTag = document.getElementById("score");
const memeMeterTag = document.getElementById("meme-meter");

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function updatePlayer() {
    if (player.jumping && player.y > 200) {
        player.y -= player.speed;
    } else if (!player.jumping && player.y < 500) {
        player.y += player.speed;
    }
}

function spawnObstacle() {
    if (!gameRunning) return;

    const obstacle = {
        x: canvas.width,
        y: 500,
        width: 50,
        height: 50,
        color: "red",
        speed: memeMeter + 2,
        passed: false,
    };
    obstacles.push(obstacle);
}

function drawObstacles() {
    obstacles.forEach((obstacle) => {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        obstacle.x -= obstacle.speed;

        // Check if the obstacle was passed
        if (!obstacle.passed && obstacle.x + obstacle.width < player.x) {
            highScore++;
            score++;    
            highScoreTag.innerText = highScore;
            ScoreTag       .innerText=highScore;
            obstacle.passed = true;
        }
    });

    // Remove obstacles that have moved out of bounds
    obstacles = obstacles.filter((obstacle) => obstacle.x + obstacle.width > 0);
}

function updateMemeMeter() {
    memeMeter += 0.005; // Increase game speed dynamically
    memeMeterTag.innerText = memeMeter.toFixed(2);
}

function checkCollision() {
    obstacles.forEach((obstacle) => {
        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            // alert(`Game Over! High Score: ${highScore}`);
            Swal.fire(`Game over! Score: ${highScore}`);
            resetGame();
        }
    });
}

function resetGame() {
    obstacles = [];
    player.y = 500;
    highScore = 0;
    memeMeter = 1;
    highScoreTag.innerText = highScore;
    memeMeterTag.innerText = memeMeter.toFixed(2);
    gameRunning = false;
}

function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    updatePlayer();
    drawObstacles();
    checkCollision();
    updateMemeMeter();

    requestAnimationFrame(gameLoop);
}

// Controls
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        player.jumping = true;
    }
});

document.addEventListener("keyup", (e) => {
    if (e.code === "Space") {
        player.jumping = false;
    }
});

// Start Game
setInterval(spawnObstacle, 2000);
gameRunning = true;
gameLoop();