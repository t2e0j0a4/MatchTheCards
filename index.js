let flipSound = document.querySelector('.flipSound');
let gameTime = document.querySelector('.gameTime');
let gameBoard = document.querySelector(".gameBoard");
let soundBtn = document.querySelector(".toggleGameSound");
let resetBtn = document.querySelector(".toggleResetButton");
let soundIcon = document.querySelector(".toggleGameSound ion-icon");

let imagesPaths = [
    "./Assets/Pic1.svg", "./Assets/Pic2.svg", "./Assets/Pic3.svg", "./Assets/Pic4.svg", "./Assets/Pic5.svg", "./Assets/Pic6.svg", "./Assets/Pic7.svg", "./Assets/Pic8.svg"
];

let timeInterval;
let hours = 0, minutes = 0, seconds = 0;

const randomWorld = (path) => {
    const newWorld = path.reduce((acc, cur) => {
        acc.push(cur, cur);
        return acc;
    }, []);
    for (let i = newWorld.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newWorld[i], newWorld[j]] = [
            newWorld[j],
            newWorld[i],
        ];
    }
    return newWorld;
}

let selectedCards = [];

function stopTimerGameEnd() {
    let allCards = Array.from(document.querySelectorAll(".card"));
    let openedCards = [];
    allCards.forEach((card) => {
        if (card.classList.contains('active')){
            openedCards.push(card);
        }
    })
    if (openedCards.length === 16) {
        clearInterval(timeInterval);
    }
}

function handleCardClick () {

    flipSound.play();
    flipSound.currentTime = 0;
    this.classList.add('active');
    selectedCards.push(this);
    if (selectedCards.length === 2) {
        let card1Id = selectedCards[0].dataset.cardid;
        let card2Id = selectedCards[1].dataset.cardid;
        if (card1Id !== card2Id) {
            setTimeout(() => {
                selectedCards.forEach((card) => card.classList.remove('active'));
                selectedCards = [];
            }, 1000);
        }
        else {
            stopTimerGameEnd();
            selectedCards = [];
        }
    }

    
}

soundBtn.addEventListener('click', function() {
    if (soundIcon.name === 'volume-high'){
        soundIcon.name = "volume-mute";
        flipSound.volume = 0;
    }
    else {
        soundIcon.name = "volume-high";
        flipSound.volume = 1;
    }
})

function loadCards() {

    let mainImages = randomWorld(imagesPaths);

    mainImages.forEach((image) => {
        let imgId = image.replace('./Assets/','');
        imgId = imgId.replace('.svg','');
        let eachCard = document.createElement('div');
        eachCard.classList.add('card');
        eachCard.setAttribute('data-cardid', imgId);

        eachCard.addEventListener('click', handleCardClick);

        let eachCardContent = document.createElement("div");
        eachCardContent.classList.add('cardContent');

        let frontSide = document.createElement('div');
        frontSide.classList.add('cardFront');
        let frontImage = document.createElement('img');
        frontImage.setAttribute('src', './Assets/front.png');
        frontImage.setAttribute('alt', 'card-front');
        frontSide.append(frontImage);

        let backSide = document.createElement('div');
        backSide.classList.add('cardBack');
        let ourImage = document.createElement('img');
        ourImage.classList.add('ourImage');
        ourImage.setAttribute('src',image);
        ourImage.setAttribute('alt','card-image');
        backSide.append(ourImage);

        eachCardContent.append(frontSide, backSide);
        eachCard.append(eachCardContent);

        gameBoard.append(eachCard);
    })
}

function startTimer () {
    timeInterval = setInterval(() => {
        seconds = parseInt(seconds);
        if (seconds === 60) {
            seconds = 0;
            if (minutes === 60) {
                minutes = 0;
                hours = hours + 1;
            }
            minutes = minutes + 1;
        }
        seconds = seconds + 1;
        seconds = seconds.toString();
        let updatedHours = hours.length === 2 ? hours : `0${hours}`;
        let updatedMinutes = minutes.length === 2 ? minutes : `0${minutes}`;
        let updatedSeconds = seconds.length === 2 ? seconds : `0${seconds}`;
        gameTime.innerHTML = `Time - ${updatedHours}:${updatedMinutes}:${updatedSeconds}`;
    }, 1000);
}

resetBtn.addEventListener('click', function() {
    document.querySelectorAll('.card').forEach((card) => {card.classList.remove('active')});
    document.querySelector('.gameTime').innerHTML = "Time - 00:00:00";
    clearInterval(timeInterval);
    [hours, minutes, seconds] = [0,0,0];
    startTimer();
})

window.addEventListener('load', function() {
    window.location.href = "#game";
    loadCards();
    startTimer();
});