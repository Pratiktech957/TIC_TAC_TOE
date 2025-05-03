document.addEventListener('DOMContentLoaded', () => {
    // Game state variables
    let currentPlayer = 'X';
    let gameBoard = Array(9).fill('');
    let gameActive = true;
    let gameMode = 'pvp'; // pvp, pvc, timed
    let aiDifficulty = 2; // 1: Easy, 2: Medium, 3: Hard
    let moveHistory = [];
    let timerInterval;
    let timeLeft = 15;
    let stats = {
        xWins: 0,
        oWins: 0,
        draws: 0
    };
    let gameHistory = [];
    let soundEnabled = true;

    // DOM Elements
    const cells = document.querySelectorAll('.cell');
    const gameStatus = document.getElementById('gameStatus');
    const restartBtn = document.getElementById('restartBtn');
    const undoBtn = document.getElementById('undoBtn');
    const themeToggle = document.getElementById('themeToggle');
    const soundToggle = document.getElementById('soundToggle');
    const modeButtons = document.querySelectorAll('.mode-btn');
    const playerOptions = document.querySelectorAll('.player-option');
    const difficultySlider = document.getElementById('difficultySlider');
    const timerContainer = document.getElementById('timerContainer');
    const timerDisplay = document.getElementById('timer');
    const statValues = {
        xWins: document.getElementById('xWins'),
        oWins: document.getElementById('oWins'),
        draws: document.getElementById('draws')
    };
    const historyList = document.getElementById('historyList');
    const gameHistoryElement = document.getElementById('gameHistory');

    // Modal elements
    const resultModal = new bootstrap.Modal(document.getElementById('resultModal'));
    const resultMessage = document.getElementById('resultMessage');
    const modalBody = document.getElementById('modalBody');
    const newGameBtn = document.getElementById('newGameBtn');

    // Sound effects
    const sounds = {
        click: new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAkJCQkJCQkJCQkJCQkJCQwMDAwMDAwMDAwMDAwMDAwMD09PT09PT09PT09PT09PT0//////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAYaAAAAAAAAsAAizU3q/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/jOMQACdwJvzBFAAZMSM7KrAIlEkgIJEUiqoAaOafQ4dFCpDhA6QDlfQ4c6PyHFgxjGMYxlVVVKqqqqsYxjGMYAAAAABiMYxjGVVVVVVVVjGMYxjAAAABiMYxjGOqqqqqqrGMYxjGAAAAAGIxjGMY6qqqqqsYxjGMYAAAAYjGMYxjqqqqqqsYxjGMYAAAAAGMYxjGOqqqqqqxjGMYxgAAAABVVVVVVXKqqqqqqqqqqqqqqqqqqqqr/4zjEAgmkSYyVdCGwq1SzKKesWIiqqqqqqruq7ru7qu7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7g=='),
        win: new Audio('data:audio/mp3;base64,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.UvF0IA'),
        draw: new Audio('data:audio/mp3;base64,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')
    };

    // Initialize the game
    initializeGame();
    loadFromLocalStorage();

    // Event listeners
    cells.forEach(cell => {
        cell.addEventListener('click', () => handleCellClick(cell));
    });

    restartBtn.addEventListener('click', restartGame);
    undoBtn.addEventListener('click', undoMove);
    themeToggle.addEventListener('click', toggleTheme);
    soundToggle.addEventListener('click', toggleSound);
    newGameBtn.addEventListener('click', restartGame);

    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            modeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            gameMode = button.getAttribute('data-mode');
            
            // Show/hide difficulty slider for AI mode
            if (gameMode === 'pvc') {
                difficultySlider.classList.add('show');
            } else {
                difficultySlider.classList.remove('show');
            }
            
            // Show/hide timer for timed mode
            if (gameMode === 'timed') {
                timerContainer.classList.add('show');
            } else {
                timerContainer.classList.remove('show');
                clearInterval(timerInterval);
            }
            
            restartGame();
        });
    });

    playerOptions.forEach(option => {
        option.addEventListener('click', () => {
            playerOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            currentPlayer = option.getAttribute('data-player');
            updateGameStatus();
            
            if (gameMode === 'pvc' && currentPlayer === 'O') {
                // If AI goes first
                makeAIMove();
            }
        });
    });

    document.getElementById('difficulty').addEventListener('input', (e) => {
        aiDifficulty = parseInt(e.target.value);
    });

    // Function to initialize the game
    function initializeGame() {
        gameBoard = Array(9).fill('');
        gameActive = true;
        moveHistory = [];
        clearInterval(timerInterval);
        timeLeft = 15;
        
        if (gameMode === 'timed') {
            startTimer();
        }
        
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'highlight', 'disabled', 'cell-reveal');
        });
        
        updateGameStatus();
    }

    // Function to handle cell click
    function handleCellClick(cell) {
        const index = cell.getAttribute('data-index');
    
        // Prevent action if game over or cell already filled
        if (gameBoard[index] !== '' || !gameActive) {
            return;
        }
    
        // In PvP mode, ensure only the correct player plays their turn
        if (gameMode === 'pvp') {
            const currentPlayerTurn = currentPlayer;
            if (currentPlayerTurn === 'X' && cell.classList.contains('o')) {
                alert("It's X's turn! Let Player X make a move.");
                return;
            } else if (currentPlayerTurn === 'O' && cell.classList.contains('x')) {
                alert("It's O's turn! Let Player O make a move.");
                return;
            }
        }
    
        // Proceed with move
        gameBoard[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase(), 'cell-reveal');
        playSound('click');
    
        moveHistory.push(index);
        checkGameResult();
    
        if (gameActive) {
            if (gameMode === 'pvc') {
                setTimeout(makeAIMove, 300);
            } else if (gameMode === 'timed') {
                resetTimer();
            } else {
                togglePlayer();
                updateGameStatus();
            }
        }
    }
    
    

    function togglePlayer() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }

    function updateGameStatus() {
        gameStatus.textContent = gameActive
            ? `Player ${currentPlayer}'s Turn`
            : '';
    }

    function checkGameResult() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        let winner = null;
        winPatterns.forEach(pattern => {
            const [a, b, c] = pattern;
            if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                winner = gameBoard[a];
                [a, b, c].forEach(i => cells[i].classList.add('highlight'));
            }
        });

        if (winner) {
            gameActive = false;
            showResult(`${winner} Wins!`);
            playSound('win');
            stats[`${winner.toLowerCase()}Wins`]++;
        } else if (!gameBoard.includes('')) {
            gameActive = false;
            showResult(`It's a Draw!`);
            playSound('draw');
            stats.draws++;
        }

        updateStats();
        saveToLocalStorage();
    }

    function showResult(message) {
        resultMessage.textContent = message;
        resultModal.show();
        gameHistory.push([...gameBoard]);
        updateHistory();
    }

    function updateStats() {
        statValues.xWins.textContent = stats.xWins;
        statValues.oWins.textContent = stats.oWins;
        statValues.draws.textContent = stats.draws;
    }

    function restartGame() {
        initializeGame();
        updateGameStatus();

        if (gameMode === 'pvc' && currentPlayer === 'O') {
            makeAIMove();
        }
    }

    function undoMove() {
        if (!gameActive || moveHistory.length === 0) return;

        const lastMove = moveHistory.pop();
        gameBoard[lastMove] = '';
        cells[lastMove].textContent = '';
        cells[lastMove].classList.remove('x', 'o', 'highlight', 'cell-reveal');

        togglePlayer();
        updateGameStatus();

        if (gameMode === 'timed') resetTimer();
    }

    function playSound(type) {
        if (!soundEnabled) return;
        if (sounds[type]) sounds[type].play();
    }

    function toggleTheme() {
        document.body.classList.toggle('dark');
    }

    function toggleSound() {
        soundEnabled = !soundEnabled;
        soundToggle.textContent = soundEnabled ? '🔊' : '🔇';
    }

    function makeAIMove() {
        if (!gameActive || currentPlayer !== 'O') return; // Only move if it's AI's turn
    
        let move;
        if (aiDifficulty === 1) {
            move = getRandomMove();
        } else {
            move = getBestMove();
        }
    
        if (move !== undefined) {
            gameBoard[move] = currentPlayer;
            const cell = cells[move];
            cell.textContent = currentPlayer;
            cell.classList.add(currentPlayer.toLowerCase(), 'cell-reveal');
            playSound('click');
            moveHistory.push(move);
    
            checkGameResult();
    
            if (gameActive) {
                togglePlayer();
                updateGameStatus();
            }
        }
    }
    

    function getRandomMove() {
        const available = gameBoard.map((val, i) => val === '' ? i : null).filter(i => i !== null);
        return available[Math.floor(Math.random() * available.length)];
    }

    function getBestMove() {
        // Simple AI for now; placeholder for more complex strategy (e.g., Minimax)
        return getRandomMove(); // Can be improved based on difficulty
    }

    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        const winner = currentPlayer === 'X' ? 'O' : 'X'; // Correct winner
        gameActive = false;
        showResult(`${currentPlayer} ran out of time!`);
        stats[`${winner.toLowerCase()}Wins`]++; // Assign win to correct player
        updateStats();
        saveToLocalStorage();
    }
    

    function resetTimer() {
        timeLeft = 15;
        startTimer();
    }

    function updateHistory() {
        historyList.innerHTML = '';
        gameHistory.slice().reverse().forEach((board, idx) => {
            const li = document.createElement('li');
            li.textContent = `Game ${gameHistory.length - idx}`;
            li.addEventListener('click', () => showHistory(board));
            historyList.appendChild(li);
        });
    }

    function showHistory(board) {
        modalBody.innerHTML = '';
        board.forEach((cell, index) => {
            const div = document.createElement('div');
            div.classList.add('cell', cell.toLowerCase());
            div.textContent = cell;
            modalBody.appendChild(div);
        });
    }

    function saveToLocalStorage() {
        const data = {
            stats,
            gameHistory
        };
        localStorage.setItem('ticTacToeData', JSON.stringify(data));
    }

    function loadFromLocalStorage() {
        const data = JSON.parse(localStorage.getItem('ticTacToeData'));
        if (data) {
            stats = data.stats || stats;
            gameHistory = data.gameHistory || gameHistory;
            updateStats();
            updateHistory();
        }
    }
});
