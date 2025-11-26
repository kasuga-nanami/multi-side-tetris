const socket = io();

const gridDiv = document.getElementById('grid');
const wordInput = document.getElementById('wordInput');
const submitBtn = document.getElementById('submitWord');
const info = document.getElementById('info');

let gameState = null;

// 初期化
socket.on('init', (state) => {
    gameState = state;
    drawGrid();
});

socket.on('updateGame', (state) => {
    gameState = state;
    drawGrid();
    info.textContent = `残りマス: ${gameState.remaining} | 次のプレイヤー: ${gameState.currentPlayer+1}`;
});

submitBtn.addEventListener('click', () => {
    const word = wordInput.value.trim();
    if(word) {
        const startChar = gameState.lastWord ? gameState.lastWord[0] : word[0];
        socket.emit('placeWord', word, startChar);
        wordInput.value = '';
    }
});

function drawGrid() {
    gridDiv.innerHTML = '';
    for(let row=0; row<gameState.grid.length; row++) {
        for(let col=0; col<gameState.grid[row].length; col++) {
            const cell = document.createElement('div');
            cell.textContent = gameState.grid[row][col] || '';
            gridDiv.appendChild(cell);
        }
    }
}
