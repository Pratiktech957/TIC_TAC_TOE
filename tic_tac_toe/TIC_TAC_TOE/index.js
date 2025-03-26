let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameOver = false;
const cells = document.querySelectorAll('.cell');
const restartBtn = document.getElementById('restartBtn');
const titleHeader = document.getElementById('titleHeader');
const xPlayerDisplay = document.getElementById('xPlayerDisplay');
const oPlayerDisplay = document.getElementById('oPlayerDisplay');
const popup = document.getElementById('popup');
const popupMessage = document.getElementById('popupMessage');

function choosePlayer(player) {
    if (gameOver) return;
    currentPlayer = player;
    xPlayerDisplay.classList.remove('player-active');
    oPlayerDisplay.classList.remove('player-active');
    if (player === 'X') {
        xPlayerDisplay.classList.add('player-active');
    } else {
        oPlayerDisplay.classList.add('player-active');
    }
    titleHeader.textContent = `${player}'s Turn`;
}

function handleCellClick(index) {
    if (board[index] !== '' || gameOver) return;
    board[index] = currentPlayer;
    cells[index].textContent = currentPlayer;
    cells[index].style.pointerEvents = 'none';

    if (checkWinner()) {
        showPopup(`${currentPlayer} Wins!`);
        gameOver = true;
        restartBtn.style.visibility = 'visible';
    } else if (board.every(cell => cell !== '')) {
        showPopup('It\'s a Draw!');
        gameOver = true;
        restartBtn.style.visibility = 'visible';
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        titleHeader.textContent = `${currentPlayer}'s Turn`;
    }
}

function checkWinner() {
    const winningCombination = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    return winningCombination.some(combination => {
        const [a, b, c] = combination;
        return board[a] && board[a] === board[b] && board[a] === board[c];
    });
}

function showPopup(message) {
    popupMessage.textContent = message;
    popup.style.display = 'flex';
}

function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.pointerEvents = 'auto';
    });
    currentPlayer = 'X';
    gameOver = false;
    titleHeader.textContent = 'Choose';
    restartBtn.style.visibility = 'hidden';
    xPlayerDisplay.classList.add('player-active');
    oPlayerDisplay.classList.remove('player-active');
    popup.style.display = 'none';
}

cells.forEach((cell, index) => {
    cell.addEventListener('click', () => handleCellClick(index));
});

restartBtn.addEventListener('click', restartGame);
