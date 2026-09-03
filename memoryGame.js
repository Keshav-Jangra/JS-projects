let savedData = localStorage.getItem("memoryData");

let data = {
  TotalGamePlayed: 0,
  TotalWins: 0,
  BestTime: 0,
  LowestMoves: 0,
  gameHistory: [],
};

if (savedData !== null) {
  data = JSON.parse(savedData);

  if (!data.gameHistory) {
    data.gameHistory = [];
  }
}

const container = document.getElementById("cards");
const moves = document.getElementById("moves");
const time = document.getElementById("time");
const totalGames = document.getElementById("total-games");
const totalWins = document.getElementById("total-wins");
const bestTime = document.getElementById("best-time");
const currentBestTime = document.getElementById("current-best-time");
const lowestMoves = document.getElementById("lowest-moves");
const historyList = document.getElementById("history-list");
const reset = document.getElementById("reset");

let countMoves = 0;
let timenow = 0;
let timerInterval = null;

let numbers = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
numbers.sort(() => Math.random() - 0.5);

let firstCard = null;
let secondCard = null;
let matchedPairs = 0;
let lock = false;
let timeFlag = true;

function updateStats() {
  totalGames.textContent = data.TotalGamePlayed;
  totalWins.textContent = data.TotalWins;
  bestTime.textContent = data.BestTime + "s";
  currentBestTime.textContent = data.BestTime + "s";
  lowestMoves.textContent = data.LowestMoves;
  displayHistory();
}

function saveData() {
  localStorage.setItem("memoryData", JSON.stringify(data));
}

function startTimer() {
  if (timerInterval !== null) return;

  timerInterval = setInterval(() => {
    timenow++;
    time.textContent = timenow + "s";
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  stopTimer();
  timenow = 0;
  time.textContent = timenow + "s";
  timeFlag = true;
}

function createCards() {
  container.innerHTML = "";

  numbers.forEach((number, index) => {
    const card = document.createElement("button");
    card.className = "h-14 bg-gray-500 text-white text-3xl rounded-lg";
    card.dataset.number = number;
    card.dataset.index = index;
    card.textContent = "?";
    container.appendChild(card);
  });
}

function newGame() {
  stopTimer();
  data.TotalGamePlayed++;

  numbers.sort(() => Math.random() - 0.5);

  firstCard = null;
  secondCard = null;
  matchedPairs = 0;
  lock = false;
  countMoves = 0;
  moves.textContent = countMoves;
  timenow = 0;
  time.textContent = timenow + "s";
  timeFlag = true;

  createCards();
  updateStats();
}

function checking() {
  const firstnum = firstCard.dataset.number;
  const secondnum = secondCard.dataset.number;

  if (firstnum === secondnum) {
    firstCard.classList.remove("bg-gray-500");
    firstCard.classList.add("bg-green-500");
    secondCard.classList.remove("bg-gray-500");
    secondCard.classList.add("bg-green-500");
    firstCard.disabled = true;
    secondCard.disabled = true;
    matchedPairs++;
    firstCard = null;
    secondCard = null;

    if (matchedPairs === numbers.length / 2) {
      stopTimer();

      data.TotalWins++;

      if (data.BestTime === 0 || timenow < data.BestTime) {
        data.BestTime = timenow;
      }
      if (data.LowestMoves === 0 || countMoves < data.LowestMoves) {
        data.LowestMoves = countMoves;
      }

      let score = 1000;
      score -= timenow * 10;
      score -= countMoves * 20;

      if (score < 0) {
        score = 0;
      }

      let stars = 1;

      if (timenow <= 30 && countMoves <= 20) {
        stars = 3;
      } else if (timenow <= 60 && countMoves <= 30) {
        stars = 2;
      }

      data.gameHistory.unshift({
        date: new Date().toLocaleString(),
        time: timenow,
        moves: countMoves,
        score: score,
      });

      data.gameHistory = data.gameHistory.slice(0, 10);

      saveData();
      updateStats();

      setTimeout(() => {
        let starText = "⭐".repeat(stars);

        Swal.fire({
          title: "You Won! 🎉",
          html: `
      <p>Total Time: <b>${timenow}s</b></p>
      <p>Total Moves: <b>${countMoves}</b></p>
      <p>Score: <b>${score}</b></p>
      <p class="text-2xl mt-2">${starText}</p>
    `,
          icon: "success",
          confirmButtonText: "Restart",
          confirmButtonColor: "#22c55e",
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            newGame();
          }
        });
      }, 100);
    }
  } else {
    lock = true;

    setTimeout(() => {
      firstCard.textContent = "?";
      secondCard.textContent = "?";
      firstCard = null;
      secondCard = null;

      lock = false;
    }, 600);
  }
}

function displayHistory() {
  historyList.innerHTML = "";

  if (data.gameHistory.length === 0) {
    historyList.innerHTML = "<p>No games played yet.</p>";
    return;
  }

  data.gameHistory.forEach((game, index) => {
    const history = document.createElement("div");

    history.className = "bg-white rounded-lg p-2 mb-2";

    history.innerHTML = `
      <p><b>Game ${index + 1}</b></p>
      <p>Date: ${game.date}</p>
      <p>Time: ${game.time}s</p>
      <p>Moves: ${game.moves}</p>
      <p>Score: ${game.score}</p>
    `;

    historyList.appendChild(history);
  });
}

container.addEventListener("click", function (e) {
  const card = e.target;

  if (card.tagName !== "BUTTON") return;
  if (lock) return;
  if (card.disabled) return;
  if (card === firstCard) return;

  if (timeFlag) {
    timeFlag = false;
    startTimer();
  }

  card.textContent = card.dataset.number;

  if (firstCard === null) {
    firstCard = card;
    return;
  }

  secondCard = card;
  countMoves++;
  moves.textContent = countMoves;

  checking();
});

reset.addEventListener("click", function () {
  newGame();
});

updateStats();
createCards();
saveData();
