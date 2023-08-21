/*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A',];
const unshuffledDeck = buildUnshuffledDeck();

/*----- state variables -----*/
let shuffledDeck;
let player;
let dealer;
let outcome; // pBlackjackW, pWin, pLose, push

/*----- cached elements  -----*/
const userCardsEl = document.getElementById('u-cards');
const dealerCardsEl = document.getElementById('d-cards');
const wagerInputEl = document.getElementById('wager-input');

/*----- event listeners -----*/
document.getElementById('stay-btn').addEventListener('click', handleStay);
document.getElementById('wager-btn').addEventListener('click', handleWager);
document.getElementById('hit-btn').addEventListener('click', handleHit);

/*----- functions -----*/
init();

function init() {
    shuffledDeck = shuffleNewDeck();
    player = {
        hand: [],
        imgLookup: [],
        wallet: 200,
        handVal: 0
    }
    dealer = {
        hand: [],
        imgLookup: [],
        handVal: 0
    }
    outcome = null;
    render();
}


function handleHit() {
    dealCards(1, player);
    checkBust();
}


function handleWager() { //checks to see if player has enough money, removes money from wallet
    const wagerAmt = parseInt(wagerInputEl.value)
    if (wagerAmt > player.wallet) {
        alert('not enough money');

    }
    else {
        player.wallet -= parseInt(wagerInputEl.value);
        dealCards(2, player);
        dealCards(2, dealer);
        checkBlackjack();
    }
}
function dealCards(amount, user) {
    for (let i = 0; i < amount; i++) {
        let nextCard = shuffledDeck.shift()
        user.hand.push(nextCard.value);
        user.imgLookup.push(nextCard.face)
    }
    render();
}

function handleStay() {
    getHandTotal(dealer);

    while (getHandTotal(dealer) < 17) {
        dealCards(1, dealer);
        // getHandTotal(dealer);
    }
    checkOutcome();
    render();
}
function getHandTotal(user) {
    user.handVal = 0;
    aceCount = 0;
    user.hand.forEach(function (card, idx) {
        user.handVal += card;
        if (card === 11) {
            aceCount++;
        }
        if (aceCount && user.handVal > 21) {
            user.handVal -= 10 * aceCount;
            user.hand[idx - 1] = 1;
        }
    })
    return user.handVal;
}


function render() {
    renderCards();
    renderWalletMsg();
    if (outcome) {
        renderWinner();
    }
}

function renderWinner() {
    const winnerEl = document.querySelector('p')
    console.log(outcome)
    if (outcome === 'pWin') {
        winnerEl.innerText = 'Player Wins!'
    } else if (outcome === 'pLose') {
        winnerEl.innerText = 'Dealer Wins!'
    } else {
        winnerEl.innerText = "It's a draw!"
    }
}

function checkBlackjack() {
    getHandTotal(dealer);
    getHandTotal(player);

    if (player.handVal === 21 && dealer.handVal === 21) {
        outcome = 'push';
    }
    else if (player.handVal === 21) {
        outcome = 'pBlackjackW'
    }
    else if (dealer.handVal === 21) {
        outcome = 'pLose'
    }
    render();
}

function checkBust() {
    getHandTotal(player);
    if (player.handVal > 21) {
        outcome = 'pLose';
    }
    render();
}

function checkOutcome() {
    getHandTotal(player);
    getHandTotal(dealer);
    console.log(player.handVal, 'player')
    console.log(dealer.handVal, 'dealer')
    if (player.handVal > 21) {
        outcome = 'pLose'
    } else if (dealer.handVal > 21) {
        outcome = 'pWin';
    } else if (player.handVal > dealer.handVal) {
        outcome = 'pWin';
    } else if (player.handVal === dealer.handVal) {
        outcome = 'push';
    } else {
        outcome = 'pLose';
    }
    render();
}

function renderWalletMsg() {

}

function renderCards() {//clears html/card imgs, renders all cards currently in player and dealer hand
    userCardsEl.innerHTML = '';
    dealerCardsEl.innerHTML = '';
    player.imgLookup.forEach(function (face) {
        userCardsEl.innerHTML += `<div class="card ${face} u-xlarge shadow"></div>`;
    })
    dealer.imgLookup.forEach(function (face) {
        if (face === dealer.imgLookup[0]) {
            dealerCardsEl.innerHTML += `<div class="card ${face} d-xlarge shadow"></div>`;
        } else {
            dealerCardsEl.innerHTML += `<div class="card ${face} d-xlarge shadow"></div>`;
        }
    })
}

function buildUnshuffledDeck() {//creates a clean deck
    const deck = [];
    suits.forEach(function (suit) {
        ranks.forEach(function (rank) {
            deck.push({
                face: `${suit}${rank}`,
                value: Number(rank) || (rank === 'A' ? 11 : 10)
            });
        });
    });
    return deck;
}
function shuffleNewDeck() {//shuffles a clean deck
    const tempDeck = [...unshuffledDeck];
    const newShuffledDeck = [];
    while (tempDeck.length) {
        const rndIdx = Math.floor(Math.random() * tempDeck.length);
        newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
    }
    return newShuffledDeck;
}
