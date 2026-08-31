let savedData = localStorage.getItem("memoryData");
if (savedData !== null) {
  data = JSON.parse(savedData);
}

const container = document.getElementById("cards");
let moves = document.getElementById("moves");
let time = document.getElementById("time");
let countMoves = 0;
let timenow = 0;

let numbers = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
numbers.sort(() => Math.random() - 0.5);
let firstCard = null;
let secondCard = null;
let matchedPairs = 0;
let lock = false;
let timeFlag = true;

let totalGames = document.getElementById("total-games");
let totalWins = document.getElementById("total-wins");
let bestTime = document.getElementById("best-time");
let lowestMoves = document.getElementById("lowest-moves");

let data = {
  TotalGamePlayed: 0,
  TotalWins: 0,
  BestTime: 0,
  LowestMoves: 0,
};

totalGames.textContent = `${data.TotalGamePlayed}`;
totalWins.textContent = `${data.TotalWins}`;
bestTime.textContent = `${data.BestTime}`;
lowestMoves.textContent = `${data.LowestMoves}`;

function createCards() {
  container.innerHTML = "";
  numbers.forEach((number, index) => {
    let card = document.createElement("button");
    card.className = "h-15 bg-gray-500 text-white text-3xl rounded-lg";
    card.dataset.number = number;
    card.dataset.index = index;
    card.textContent = "?";
    container.appendChild(card);
  });
}

function checking() {
  const firstnum = firstCard.dataset.number;
  const secondnum = secondCard.dataset.number;
  if (firstnum == secondnum) {
    firstCard.classList.remove("bg-gray-500");
    firstCard.classList.add("bg-green-500");

    secondCard.classList.remove("bg-gray-500");
    secondCard.classList.add("bg-green-500");

    firstCard.disabled = true;
    secondCard.disabled = true;
    matchedPairs++;

    firstCard = null;
    secondCard = null;

    setTimeout(() => {
      if (matchedPairs === numbers.length / 2) {
        countMoves = 0;
        alert("You won !");
        firstCard = null;
        secondCard = null;
        matchedPairs = 0;
        lock = 0;
        time = 0;
        countMoves = 0;
        moves.textContent = countMoves;
        timeFlag = true;

        data.TotalGamePlayed++;

        localStorage.setItem("dataStore", JSON.stringify(data));
        createCards();
      }
    }, 100);
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

let reset = document.getElementById("reset");
reset.addEventListener("click", function () {
  numbers.sort(() => Math.random() - 0.5);
  firstCard = null;
  secondCard = null;
  matchedPairs = 0;
  lock = 0;
  time = 0;
  countMoves = 0;
  moves.textContent = countMoves;
  timenow = 0;
  time.textContent = timenow;
  timeFlag = true;

  createCards();
});

container.addEventListener("click", function (e) {
  if (timeFlag) {
    timeFlag = false;
    setInterval(() => {
      time.textContent = timenow;
      timenow = timenow + 1;
    }, 1000);
  }
  const card = e.target;
  if (lock) return;
  if (card == firstCard) return;

  card.textContent = card.dataset.number;

  if (firstCard == null) {
    firstCard = card;
    return;
  }
  if (secondCard == null) {
    secondCard = card;
    countMoves += 1;
    moves.textContent = countMoves;
    checking();
  }
});

createCards();
