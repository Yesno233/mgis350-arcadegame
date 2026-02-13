const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverScreen = document.getElementById('gameOver');

const GRID = 50;
let score = 0;
let gameRunning = true;

// Frog Properties
const frog = {
    x: GRID * 4,
    y: GRID * 11,
    size: GRID - 10,
    color: '#39ff14'
};

// Enemy Configuration
class Car {
    constructor(row, speed, color) {
        this.x = Math.random() * canvas.width;
        this.y = row * GRID;
        this.width = GRID * 1.5;
        this.height = GRID - 10;
        this.speed = speed;
        this.color = color;
    }

    draw() {
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y + 5, this.width, this.height);
        ctx.shadowBlur = 0;
    }

    update() {
        this.x += this.speed;
        if (this.speed > 0 && this.x > canvas.width) this.x = -this.width;
        if (this.speed < 0 && this.x < -this.width) this.x = canvas.width;
    }
}

let enemies = [
    new Car(1, 3, '#ff0055'), new Car(1, 3, '#ff0055'),
    new Car(3, -2, '#00ffff'), new Car(3, -2, '#00ffff'),
    new Car(5, 5, '#ffff00'), 
    new Car(7, -4, '#ff8800'), new Car(7, -4, '#ff8800'),
    new Car(9, 2, '#ff00ff'), new Car(9, 2, '#ff00ff')
];

function drawFrog() {
    ctx.shadowBlur = 15;
    ctx.shadowColor = frog.color;
    ctx.fillStyle = frog.color;
    ctx.fillRect(frog.x + 5, frog.y + 5, frog.size, frog.size);
    ctx.shadowBlur = 0;
}

function handleInput(e) {
    if (!gameRunning) return;
    
    switch(e.key) {
        case 'ArrowUp': if (frog.y > 0) frog.y -= GRID; break;
        case 'ArrowDown': if (frog.y < canvas.height - GRID) frog.y += GRID; break;
        case 'ArrowLeft': if (frog.x > 0) frog.x -= GRID; break;
        case 'ArrowRight': if (frog.x < canvas.width - GRID) frog.x += GRID; break;
    }

    // Win condition (Reached the top)
    if (frog.y === 0) {
        score += 100;
        scoreElement.textContent = score;
        resetFrog();
    }
}

function resetFrog() {
    frog.x = GRID * 4;
    frog.y = GRID * 11;
}

function resetGame() {
    score = 0;
    scoreElement.textContent = score;
    gameRunning = true;
    gameOverScreen.classList.add('hidden');
    resetFrog();
    animate();
}

function checkCollision(f, c) {
    return (f.x < c.x + c.width &&
            f.x + f.size > c.x &&
            f.y < c.y + c.height &&
            f.y + f.size > c.y);
}

function animate() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background grid lines
    ctx.strokeStyle = '#1a1a1a';
    for(let i=0; i<canvas.height; i+=GRID) ctx.strokeRect(0, i, canvas.width, GRID);

    enemies.forEach(car => {
        car.update();
        car.draw();
        if (checkCollision(frog, car)) {
            gameRunning = false;
            gameOverScreen.classList.remove('hidden');
        }
    });

    drawFrog();
    requestAnimationFrame(animate);
}

window.addEventListener('keydown', handleInput);
animate();