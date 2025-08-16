class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.gameMode = '2p';
        this.scores = { X: 0, O: 0 };
        this.winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];
        
        this.initializeGame();
    }

    initializeGame() {
        this.boardElement = document.getElementById('board');
        this.statusElement = document.getElementById('status');
        this.scoreXElement = document.getElementById('score-x');
        this.scoreOElement = document.getElementById('score-o');
        
        this.createBoard();
        this.bindEvents();
        this.updateDisplay();
    }

    createBoard() {
        this.boardElement.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = i;
            cell.addEventListener('click', (e) => this.handleClick(e));
            this.boardElement.appendChild(cell);
        }
    }

    bindEvents() {
        document.getElementById('new-game').addEventListener('click', () => this.newGame());
        document.getElementById('reset-scores').addEventListener('click', () => this.resetScores());
        
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.changeMode(e.target.dataset.mode));
        });
    }

    handleClick(event) {
        if (!this.gameActive) return;
        
        const index = parseInt(event.target.dataset.index);
        if (this.board[index] !== '') return;

        this.makeMove(index);
    }

    makeMove(index) {
        this.board[index] = this.currentPlayer;
        this.updateBoard();
        
        if (this.checkWin()) {
            this.handleWin();
        } else if (this.isDraw()) {
            this.handleDraw();
        } else {
            this.switchPlayer();
            if (this.gameMode === 'ai' && this.currentPlayer === 'O') {
                setTimeout(() => this.makeAIMove(), 500);
            }
        }
    }

    makeAIMove() {
        if (!this.gameActive) return;
        
        const emptyCells = this.board.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
        if (emptyCells.length === 0) return;
        
        // Simple AI: try to win, block opponent, or make random move
        let move = this.findWinningMove('O');
        if (move === null) {
            move = this.findWinningMove('X'); // Block opponent
        }
        if (move === null) {
            move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        }
        
        this.makeMove(move);
    }

    findWinningMove(player) {
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                const testBoard = [...this.board];
                testBoard[i] = player;
                if (this.checkWinForBoard(testBoard)) {
                    return i;
                }
            }
        }
        return null;
    }

    updateBoard() {
        const cells = this.boardElement.children;
        for (let i = 0; i < 9; i++) {
            cells[i].textContent = this.board[i];
            cells[i].className = `cell ${this.board[i].toLowerCase()}`;
        }
    }

    checkWin() {
        return this.checkWinForBoard(this.board);
    }

    checkWinForBoard(board) {
        return this.winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return board[a] && board[a] === board[b] && board[a] === board[c];
        });
    }

    isDraw() {
        return this.board.every(cell => cell !== '');
    }

    handleWin() {
        this.gameActive = false;
        this.scores[this.currentPlayer]++;
        this.statusElement.textContent = `Player ${this.currentPlayer} wins!`;
        this.updateScores();
    }

    handleDraw() {
        this.gameActive = false;
        this.statusElement.textContent = "It's a draw!";
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateDisplay();
    }

    updateDisplay() {
        this.statusElement.textContent = `Player ${this.currentPlayer}'s turn`;
        this.updateScores();
    }

    updateScores() {
        this.scoreXElement.textContent = this.scores.X;
        this.scoreOElement.textContent = this.scores.O;
    }

    newGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.updateBoard();
        this.updateDisplay();
    }

    resetScores() {
        this.scores = { X: 0, O: 0 };
        this.updateScores();
        this.newGame();
    }

    changeMode(mode) {
        this.gameMode = mode;
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        this.newGame();
    }
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});