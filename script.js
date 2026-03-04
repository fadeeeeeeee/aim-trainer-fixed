document.addEventListener("DOMContentLoaded", () => {
  const gameArea = document.getElementById("gameArea");
  const scoreDisplay = document.getElementById("score");
  const timeDisplay = document.getElementById("time");
  const startBtn = document.getElementById("startBtn");
  const crosshair = document.getElementById("crosshair");
  const pistol = document.getElementById("pistol");
  const shootSound = document.getElementById("shootSound");
  const hitSound = document.getElementById("hitSound");

  let score = 0;
  let time = 30;
  let countdown;
  let targets = [];
  const maxTargets = 5;

  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;

  function startGame() {
    score = 0;
    time = 30;
    scoreDisplay.textContent = score;
    timeDisplay.textContent = time;
    startBtn.disabled = true;

    // Pointer lock
    gameArea.requestPointerLock();

    // Clear previous targets
    targets.forEach(t => t.remove());
    targets = [];

    for (let i = 0; i < maxTargets; i++) spawnTarget();

    countdown = setInterval(() => {
      time--;
      timeDisplay.textContent = time;
      if (time <= 0) endGame();
    }, 1000);

    requestAnimationFrame(moveTargets);
  }

  function endGame() {
    clearInterval(countdown);
    targets.forEach(t => t.remove());
    targets = [];
    startBtn.disabled = false;
    document.exitPointerLock();
    alert(`Game Over! Your score: ${score}`);
  }

  function spawnTarget() {
    const target = document.createElement("div");
    target.classList.add("target");

    // Random size to simulate distance
    const size = Math.random() * 40 + 30; // 30–70px
    target.style.width = size + "px";
    target.style.height = size + "px";

    // Random position
    target.style.top = Math.random() * (window.innerHeight - size) + "px";
    target.style.left = window.innerWidth + "px";

    // Random speed
    target.speed = Math.random() * 2 + 1; // 1–3 px/frame

    target.addEventListener("click", () => {
      score++;
      scoreDisplay.textContent = score;
      target.remove();
      targets = targets.filter(t => t !== target);
      hitSound.play();
      spawnTarget();
    });

    gameArea.appendChild(target);
    targets.push(target);
  }

  function moveTargets() {
    targets.forEach(t => {
      let x = parseFloat(t.style.left);
      x -= t.speed;
      t.style.left = x + "px";

      if (x + parseFloat(t.style.width) < 0) {
        t.remove();
        targets = targets.filter(obj => obj !== t);
        spawnTarget();
      }
    });

    if (startBtn.disabled) requestAnimationFrame(moveTargets);
  }

  // Pointer movement
  document.addEventListener("mousemove", (e) => {
    if (document.pointerLockElement === gameArea) {
      pointerX += e.movementX;
      pointerY += e.movementY;
      pointerX = Math.max(0, Math.min(window.innerWidth, pointerX));
      pointerY = Math.max(0, Math.min(window.innerHeight, pointerY));
      crosshair.style.left = pointerX + "px";
      crosshair.style.top = pointerY + "px";
    }
  });

  // Shooting
  document.addEventListener("click", () => {
    if (document.pointerLockElement === gameArea && !startBtn.disabled) {
      shootSound.play();
    }
  });

  startBtn.addEventListener("click", startGame);
});
