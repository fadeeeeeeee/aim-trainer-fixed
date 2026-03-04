document.addEventListener("DOMContentLoaded", () => {
  const gameArea = document.getElementById("gameArea");
  const scoreDisplay = document.getElementById("score");
  const timeDisplay = document.getElementById("time");
  const startBtn = document.getElementById("startBtn");

  let score = 0;
  let time = 30;
  let countdown;

  function startGame() {
    score = 0;
    time = 30;
    scoreDisplay.textContent = score;
    timeDisplay.textContent = time;
    startBtn.disabled = true;
    gameArea.innerHTML = "";

    spawnTarget();

    countdown = setInterval(() => {
      time--;
      timeDisplay.textContent = time;
      if (time <= 0) endGame();
    }, 1000);
  }

  function endGame() {
    clearInterval(countdown);
    gameArea.innerHTML = "";
    startBtn.disabled = false;
    alert(`Game Over! Your score: ${score}`);
  }

  function spawnTarget() {
    const target = document.createElement("div");
    target.classList.add("target");

    const maxX = gameArea.clientWidth - 40;
    const maxY = gameArea.clientHeight - 40;

    target.style.left = Math.random() * maxX + "px";
    target.style.top = Math.random() * maxY + "px";

    target.addEventListener("click", () => {
      score++;
      scoreDisplay.textContent = score;
      target.remove();
      spawnTarget();
    });

    gameArea.appendChild(target);
  }

  startBtn.addEventListener("click", startGame);
});
