const container = document.getElementById("cards");
let moves = document.getElementById("moves");
let time = document.getElementById("time");
let countMoves = 0;

let numbers = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
let firstCard = null;
let secondCard = null;
let matchedPairs = 0;
let lock = false;

let data = {
  TotalGamePlayed: 0,
  TotalWins: 0,
  LowestMoves: 0,
};

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
  firstCard = null;
  secondCard = null;
  matchedPairs = 0;
  lock = 0;
  time = 0;
  createCards();
});

container.addEventListener("click", function (e) {
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
