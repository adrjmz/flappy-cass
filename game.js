const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
// we will need the gamecontainer to make it blurry
// when we display the end menu
const gameContainer = document.getElementById("game-container");

const flappyImg = new Image();
flappyImg.src = "assets/flappy-cass.png";

//Game constants
const flapSpeed = -5; // original value: 5 this is the speed of the bird when we flap
const birdWidth = 40;
const birdHeight = 30;
const pipeWidth = 50;
const pipeGap = 125;

// Bird variables
let birdX = 50;
let birdY = 50;
let birdVelocity = 1; // original value: 0 this is the speed of the bird when we don't flap
let birdAcceleration = 0.25; // original value: 0.1 this is the acceleration of the bird when we don't flap

// Pipe variables
let pipeX = 400;
let pipeY = canvas.height - 200;

// score and highscore variables
let scoreDiv = document.getElementById("score-display");
let score = 0;
let highScore = 0;

// we add a bool variable, so we can check when flappy passes we increase
// the value
let scored = false;

// lets us control the bird with the space key
document.body.onkeyup = function (e) {
	if (e.code == "Space") {
		birdVelocity = flapSpeed;
	}
};

// lets us restart the game if we hit game-over
document.getElementById("restart-button").addEventListener("click", function () {
	hideEndMenu();
	resetGame();
	loop();
});

function increaseScore() {
	// increase now our counter when our flappy passes the pipes
	if (birdX > pipeX + pipeWidth && (birdY < pipeY + pipeGap || birdY + birdHeight > pipeY + pipeGap) && !scored) {
		score++;
		scoreDiv.innerHTML = score;
		scored = true;
	}

	// reset the flag, if bird passes the pipes
	if (birdX < pipeX + pipeWidth) {
		scored = false;
	}
}

function collisionCheck() {
	// Create bounding Boxes for the bird and the pipes

	const birdBox = {
		x: birdX,
		y: birdY,
		width: birdWidth,
		height: birdHeight,
	};

	const topPipeBox = {
		x: pipeX,
		y: pipeY - pipeGap + birdHeight,
		width: pipeWidth,
		height: pipeY,
	};

	const bottomPipeBox = {
		x: pipeX,
		y: pipeY + pipeGap + birdHeight,
		width: pipeWidth,
		height: canvas.height - pipeY - pipeGap,
	};

	// Check for collision with upper pipe box
	if (birdBox.x + birdBox.width > topPipeBox.x && birdBox.x < topPipeBox.x + topPipeBox.width && birdBox.y < topPipeBox.y) {
		return true;
	}

	// Check for collision with lower pipe box
	if (birdBox.x + birdBox.width > bottomPipeBox.x && birdBox.x < bottomPipeBox.x + bottomPipeBox.width && birdBox.y + birdBox.height > bottomPipeBox.y) {
		return true;
	}

	// check if bird hits boundaries
	if (birdY < 0 || birdY + birdHeight > canvas.height) {
		return true;
	}

	return false;
}

function hideEndMenu() {
	document.getElementById("end-menu").style.display = "none";
	gameContainer.classList.remove("backdrop-blur");
}

function showEndMenu() {
	document.getElementById("end-menu").style.display = "block";
	gameContainer.classList.add("backdrop-blur");
	document.getElementById("end-score").innerHTML = score;
	// This way we update always our highscore at the end of our game
	// if we have a higher high score than the previous
	if (highScore < score) {
		highScore = score;
	}
	document.getElementById("best-score").innerHTML = highScore;
}

// we reset the values to the beginning so we start
// with the bird at the beginning
function resetGame() {
	birdX = 50;
	birdY = 50;
	birdVelocity = 1; // original value: 0
	birdAcceleration = 0.25; // original value: 0.2

	pipeX = 400;
	pipeY = canvas.height - 200;

	score = 0;
}

function endGame() {
	showEndMenu();
}

function loop() {
	// reset the ctx after every loop iteration
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Draw Flappy Bird
	ctx.drawImage(flappyImg, birdX, birdY);

	// Draw Pipes
	ctx.fillStyle = "#333";
	ctx.fillRect(pipeX, -100, pipeWidth, pipeY);
	ctx.fillRect(pipeX, pipeY + pipeGap, pipeWidth, canvas.height - pipeY);

	// now we would need to add an collision check to display our end-menu
	// and end the game
	// the collisionCheck will return us true if we have a collision
	// otherwise false
	if (collisionCheck()) {
		endGame();
		return;
	}

	// forgot to move the pipes
	pipeX -= 3.5; // original value: 1.5 this is the speed of the pipes
	// if the pipe moves out of the frame we need to reset the pipe
	if (pipeX < -50) {
		pipeX = 400;
		pipeY = Math.random() * (canvas.height - pipeGap) + pipeWidth;
	}

	// apply flapSpeed to the bird and let it move
	birdVelocity += birdAcceleration;
	birdY += birdVelocity;

	// always check if you call the function ...
	increaseScore();
	requestAnimationFrame(loop);
}

loop();
