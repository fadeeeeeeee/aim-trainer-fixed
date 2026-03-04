document.addEventListener("DOMContentLoaded", () => {
  const gameArea = document.getElementById("gameArea");
  const scoreDisplay = document.getElementById("score");
  const timeDisplay = document.getElementById("time");
  const startBtn = document.getElementById("startBtn");
  const crosshair = document.getElementById("crosshair");

  let score = 0;
  let time = 30;
  let countdown;
  let targets = [];
  const maxTargets = 5;
  const targetSpeed = 1; // pixels per frame

  let pointerX = 0;
  let pointerY = 0;

  function startGame() {
    score = 0;
    time = 30;
    scoreDisplay.textContent = score;
    timeDisplay.textContent = time;
    startBtn.disabled = true;

    // pointer lock
    gameArea.requestPointerLock();

    // clear previous targets
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

    // random position on screen
    target.style.left = Math.random() * (window.innerWidth - 50) + "px";
    target.style.top = Math.random() * (window.innerHeight - 50) + "px";

    target.addEventListener("click", () => {
      score++;
      scoreDisplay.textContent = score;
      target.remove();
      targets = targets.filter(t => t !== target);
      spawnTarget(); // replace target
    });

    gameArea.appendChild(target);
    targets.push(target);
  }

  function moveTargets() {
    targets.forEach(t => {
      let x = parseFloat(t.style.left);
      let y = parseFloat(t.style.top);

      // move slightly based on pointer movement
      x -= targetSpeed; // move left
      t.style.left = x + "px";

      if (x + 50 < 0) {
        t.remove();
        targets = targets.filter(obj => obj !== t);
        spawnTarget();
      }
    });
    if (startBtn.disabled) requestAnimationFrame(moveTargets);
  }

  // pointer movement: update crosshair offset (for visual effect)
  document.addEventListener("mousemove", (e) => {
    if (document.pointerLockElement === gameArea) {
      pointerX += e.movementX;
      pointerY += e.movementY;
      // clamp within screen
      pointerX = Math.max(0, Math.min(window.innerWidth, pointerX));
      pointerY = Math.max(0, Math.min(window.innerHeight, pointerY));
      crosshair.style.left = pointerX + "px";
      crosshair.style.top = pointerY + "px";
    }
  });

  startBtn.addEventListener("click", startGame);
});
