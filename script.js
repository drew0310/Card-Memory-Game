const cards = document.querySelectorAll('.memory-card');
let game = document.getElementsByClassName('memory-game')[0];
let alertBox = document.getElementById("alert-box");
let matches = 1, moves = 1;
let hasFlippedCard;
let lockBoard;
let firstCard, secondCard;
let timeLeft = 0;
let isSet = false;
let isStarted = false;

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function zoomout() {
    game.classList.remove("visible");
    game.classList.add("hidden");
}

function zoomin() {
    game.classList.remove("hidden");
    game.classList.add("visible");
}

document.getElementById("moves").textContent = "0";
cards.forEach(card => {
    card.classList.remove('flip');
});

zoomin();
alertBox.className = "hidden";
shuffleCards();

matches = 0, moves = 0;
hasFlippedCard = false;
lockBoard = true;
firstCard = null;
secondCard = null;

function startGame() {
    if (isStarted === true) return;
    isStarted = true;
    let increment = -1;
    if (isSet === false) return;
    zoomout();
    lockBoard = false;
    let downloadTimer = setInterval(function () {
        timeLeft += increment;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById("timer").textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        if (timeLeft <= 0 || matches === cards.length / 2) {
            increment = 0;
            lockBoard = true;
        }
        if (timeLeft <= 0) {
            alertBox.className = "failure";
            alertBox.innerHTML = "YOU LOSE!";
            zoomin();
        }

    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;


    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
    if (isMatch) {
        disableCards();
        matches++;
        if (matches === cards.length / 2) {
            alertBox.className = "success";
            alertBox.innerHTML = "YOU WIN!";
            zoomin();
        }
    }
    else {
        unflipCards();
    }
    moves++;
    document.getElementById("moves").textContent = `${moves}`;
}



function disableCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        resetBoard();
    }, 200);

}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 700);
}

function shuffleCards() {
    cards.forEach(card => {
        let ramdomPos = Math.floor(Math.random() * 12);
        card.style.order = ramdomPos;
    });
};

function setLevel(level) {
    if (isSet === true) {
        return;
    }
    isSet = true;
    if (level === "easy") {
        timeLeft = 120;
    }
    else if (level === "medium") {
        timeLeft = 90;
    }
    else if (level === "hard") {
        timeLeft = 60;
    }
    document.getElementById("difficulty").innerHTML = capitalize(level);
}

document.getElementById("easy").addEventListener("click", function () { setLevel("easy"); });
document.getElementById("medium").addEventListener("click", function () { setLevel("medium"); });
document.getElementById("hard").addEventListener("click", function () { setLevel("hard"); });

cards.forEach(card => card.addEventListener('click', flipCard));
document.getElementById("start-game").addEventListener("click", startGame);