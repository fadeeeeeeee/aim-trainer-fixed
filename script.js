document.addEventListener("DOMContentLoaded", () => {
  const gameArea = document.getElementById("gameArea");
  const scoreDisplay = document.getElementById("score");
  const timeDisplay = document.getElementById("time");
  const startBtn = document.getElementById("startBtn");

  let score = 0;
  let time = 30;
  let countdown;
  let targets = [];
  const maxTargets = 5;

  function startGame() {
    score = 0;
    time = 30;
    scoreDisplay.textContent = score;
    timeDisplay.textContent = time;
    startBtn.disabled = true;

    // clear previous targets
    targets.forEach(t => t.remove());
    targets = [];

    for (let i = 0; i < maxTargets; i++) spawnTarget();

    countdown = setInterval(() => {
      time--;
      timeDisplay.textContent = time;
      if (time <= 0) endGame();
    }, 1000);
  }

  function endGame() {
    clearInterval(countdown);
    targets.forEach(t => t.remove());
    targets = [];
    startBtn.disabled = false;
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

  startBtn.addEventListener("click", startGame);
});
