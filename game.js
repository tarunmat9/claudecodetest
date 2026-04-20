const HUMAN = 'X';
const COMPUTER = 'O';
const WIN_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
];

const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const resetBtn = document.getElementById('reset');
const difficultyEl = document.getElementById('difficulty');
const scoreXEl = document.getElementById('score-x');
const scoreOEl = document.getElementById('score-o');
const scoreDEl = document.getElementById('score-d');
const cells = document.querySelectorAll('.cell');

let board = Array(9).fill('');
let gameOver = false;
let humanTurn = true;
const scores = { X: 0, O: 0, D: 0 };

function checkWinner(b) {
    for (const line of WIN_LINES) {
        const [a, c, d] = line;
        if (b[a] && b[a] === b[c] && b[a] === b[d]) {
            return { winner: b[a], line };
        }
    }
    if (b.every(cell => cell !== '')) return { winner: 'D', line: null };
    return null;
}

function availableMoves(b) {
    return b.reduce((acc, cell, i) => (cell === '' ? acc.concat(i) : acc), []);
}

function minimax(b, isMaximizing) {
    const result = checkWinner(b);
    if (result) {
        if (result.winner === COMPUTER) return { score: 10 };
        if (result.winner === HUMAN) return { score: -10 };
        return { score: 0 };
    }

    const moves = availableMoves(b);
    let bestMove = null;
    let bestScore = isMaximizing ? -Infinity : Infinity;

    for (const move of moves) {
        b[move] = isMaximizing ? COMPUTER : HUMAN;
        const { score } = minimax(b, !isMaximizing);
        b[move] = '';

        if (isMaximizing && score > bestScore) {
            bestScore = score;
            bestMove = move;
        } else if (!isMaximizing && score < bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }

    return { score: bestScore, move: bestMove };
}

function findWinningMove(b, player) {
    for (const move of availableMoves(b)) {
        b[move] = player;
        const result = checkWinner(b);
        b[move] = '';
        if (result && result.winner === player) return move;
    }
    return null;
}

function pickComputerMove() {
    const difficulty = difficultyEl.value;
    const moves = availableMoves(board);

    if (difficulty === 'easy') {
        return moves[Math.floor(Math.random() * moves.length)];
    }

    if (difficulty === 'medium') {
        const win = findWinningMove(board, COMPUTER);
        if (win !== null) return win;
        const block = findWinningMove(board, HUMAN);
        if (block !== null) return block;
        return moves[Math.floor(Math.random() * moves.length)];
    }

    return minimax([...board], true).move;
}

function render() {
    cells.forEach((cell, i) => {
        cell.textContent = board[i];
        cell.classList.remove('x', 'o', 'win');
        if (board[i] === HUMAN) cell.classList.add('x');
        if (board[i] === COMPUTER) cell.classList.add('o');
        cell.classList.toggle('taken', board[i] !== '');
        cell.classList.toggle('disabled', !humanTurn || gameOver);
    });
}

function endGame(result) {
    gameOver = true;
    if (result.line) {
        result.line.forEach(i => cells[i].classList.add('win'));
    }
    if (result.winner === HUMAN) {
        statusEl.textContent = 'You win!';
        scores.X += 1;
    } else if (result.winner === COMPUTER) {
        statusEl.textContent = 'Computer wins!';
        scores.O += 1;
    } else {
        statusEl.textContent = "It's a draw!";
        scores.D += 1;
    }
    scoreXEl.textContent = scores.X;
    scoreOEl.textContent = scores.O;
    scoreDEl.textContent = scores.D;
}

function computerMove() {
    if (gameOver) return;
    const move = pickComputerMove();
    if (move === undefined || move === null) return;
    board[move] = COMPUTER;
    humanTurn = true;

    const result = checkWinner(board);
    if (result) {
        render();
        endGame(result);
        return;
    }

    statusEl.textContent = 'Your turn';
    render();
}

function handleCellClick(e) {
    const index = Number(e.currentTarget.dataset.index);
    if (gameOver || !humanTurn || board[index] !== '') return;

    board[index] = HUMAN;
    humanTurn = false;
    render();

    const result = checkWinner(board);
    if (result) {
        endGame(result);
        return;
    }

    statusEl.textContent = 'Computer thinking...';
    setTimeout(computerMove, 400);
}

function resetGame() {
    board = Array(9).fill('');
    gameOver = false;
    humanTurn = true;
    statusEl.textContent = 'Your turn';
    render();
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);
difficultyEl.addEventListener('change', resetGame);

render();
