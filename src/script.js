const Cell = (function() {
    return function() {
        let value = 0;

        const addToken = (player) => {
            value = player;
        }

        const getValue = () => value;

        return { addToken, getValue };
    };
})();

const Player = (function() {
    return function(name, token) {
        const playerName = name;
        const playerToken = token;

        const getPlayerName = () => playerName;
        const getPlayerToken = () => playerToken;

        return { getPlayerName, getPlayerToken };
    }
})();

const Gameboard = (function () {
    const board = [];
    const sides = 3;

    for (let i = 0; i < sides; i++) {
        board[i] = [];
        for (let j = 0; j < sides; j++) {
            board[i].push(Cell());
        }
    }

    const makeBoard = () => board;

    const printBoardValues = () => {
        const boardValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.table(boardValues);
        return boardValues;
    }

    const placeToken = (row, column, player) => {
        if (row >= 0 && row < sides && column >= 0 && column < sides) {
            let tokenCell = board[row][column];
            if (tokenCell.getValue() === 0) {
                tokenCell.addToken(player);
            } else {
                console.error("This cell is taken");
            }
        } else {
            console.error("Invalid row or column");
        }
    }

    return { makeBoard, printBoardValues, placeToken };
}) ();

const GameControler = (function () {
    return function(player1Name, player1Token, player2Name, player2Token) {
        const sides = 3;
        Gameboard.makeBoard();
        Gameboard.printBoardValues();

        const players = [
            Player(player1Name, player1Token),
            Player(player2Name, player2Token)
        ];

        let activePlayer = players[0];

        const getActivePlayer = () => activePlayer;


        const switchPlayer = () => {
            activePlayer = activePlayer === players[0] ? players[1] : players[0];
        }
        

        const checkWinRow = (roundValues) => roundValues.some(roundRow => roundRow[0] !== 0 && roundRow.every(roundCell => roundCell === roundRow[0]));


        const checkWinColumn = (roundValues) => {
            for (let i = 0; i < sides; i++) {
                if (roundValues[0][i] !== 0 && roundValues[0][i] === roundValues[1][i] && roundValues[1][i] === roundValues[2][i]) {
                    return true;
                }
            }

            return false;
        };


        const checkWinDiagonal = (roundValues) => {
            if (roundValues[0][0] !== 0 && roundValues[0][0] === roundValues[1][1] && roundValues[1][1] === roundValues[2][2]) {
                return true;
            } else if (roundValues[0][2] !== 0 && roundValues[0][2] === roundValues[1][1] && roundValues[1][1] === roundValues[2][0]) {
                return true;
            } else return false;
        }


        const checkFullBoard = (roundValues) => roundValues.every(roundRow => roundRow.every(roundCell => roundCell !== 0));


        const playRound = (row, column) => {
            Gameboard.placeToken(row, column, getActivePlayer().getPlayerToken());

            let roundValues = Gameboard.printBoardValues();

            if (checkWinRow(roundValues) || checkWinColumn(roundValues) || checkWinDiagonal(roundValues)) {
                console.log(`${getActivePlayer().getPlayerName()} wins!`);
                return false; // game is over
            } else if (checkFullBoard(roundValues)) {
                console.log("Tie! Board is full!");
                return false; // game is over
            } else {
                switchPlayer();
                Gameboard.printBoardValues();
                return true;
            }
        }

        return { playRound, getActivePlayer };
    }
}) ();
