const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = 3000;

app.use(express.static(__dirname));

let players = [];
let gameState = {
    grid: Array(10).fill(null).map(() => Array(10).fill('')),
    currentPlayer: 0,
    lastWord: '',
    direction: 'right',
    remaining: 15
};

io.on('connection', (socket) => {
    console.log('ユーザー接続:', socket.id);

    socket.on('join', (name) => {
        players.push({ id: socket.id, name });
        io.emit('updatePlayers', players);
        socket.emit('init', gameState);
    });

    socket.on('placeWord', (word, startChar) => {
        // ここに単語配置ロジック（簡略版）を入れる
        let remaining = gameState.remaining - word.length;
        gameState.remaining = remaining >= 0 ? remaining : 0;
        gameState.lastWord = word;
        gameState.direction = gameState.direction === 'right' ? 'down' : 'right';
        gameState.currentPlayer = (gameState.currentPlayer + 1) % players.length;

        io.emit('updateGame', gameState);
    });
});

http.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
