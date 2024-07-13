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
        const isValidCoordinate = (value) => Number.isInteger(value) && value >= 0 && value < sides;
        if (isValidCoordinate(row) && isValidCoordinate(column)) {
            let tokenCell = board[row][column];
            if (tokenCell.getValue() === 0) {
                tokenCell.addToken(player);
            } else {
                throw new Error("This cell is taken!");
            }
        } else {
            throw new Error("Invalid row or column input!");
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
                const start = roundValues[0][i];
                if (start === 0) return false;

                if (start === roundValues[1][i] && start === roundValues[2][i]) return true;
            }

            return false;
        };

        const checkWinDiagonal = (roundValues) => {
            const center = roundValues[1][1];
            if (center === 0) return false;

            return (roundValues[0][0] === center && center === roundValues[2][2]) ||
                    (roundValues[0][2] === center && center === roundValues[2][0]);
        }

        const checkFullBoard = (roundValues) => roundValues.every(roundRow => roundRow.every(roundCell => roundCell !== 0));

        const playRound = () => {
            try {
                let row = prompt(`${getActivePlayer().getPlayerName()}'s turn! Please enter row:`);
                let column = prompt(`${getActivePlayer().getPlayerName()}'s turn! PLease enter column:`);

                Gameboard.placeToken(parseInt(row), parseInt(column), getActivePlayer().getPlayerToken());
                
                let roundValues = Gameboard.printBoardValues();

                if (checkWinRow(roundValues) || checkWinColumn(roundValues) || checkWinDiagonal(roundValues)) {
                    console.log(`${getActivePlayer().getPlayerName()} wins!`);
                    return false; // game is over
                } else if (checkFullBoard(roundValues)) {
                    console.log("Tie! Board is full!");
                    return false; // game is over
                }

                switchPlayer();
                return true;
                
            } catch (error) {
                console.error(error.message);
                return true;
            }
        }

        return { playRound, getActivePlayer };
    }
}) ();


const PlayGame = (function () {
    return function () {
        console.log("Welcome to Tic Tac Toe!");
        console.log("To make a move, you'll be prompted to enter players' names, tokens, the row and column numbers.");
        console.log("The board is numbered from 0 to 2 for both rows and columns.");

        setTimeout(() => {
            let firstPlayerName = prompt("Enter first player name");
            let firstPlayerToken = prompt("Enter first player token");

            let secondPlayerName = prompt("Enter second player name");
            let secondPlayerToken = prompt("Enter second player token");

            const game = GameControler(firstPlayerName, firstPlayerToken, secondPlayerName, secondPlayerToken);

            let continueGame = true;

            while (continueGame) {
                continueGame = game.playRound();
            }

            let playAgain = prompt("Do you want to play again? yes/no").toLowerCase();

            if (playAgain === "yes") {
                console.clear();
                PlayGame();
            } else {
                console.log("Thanks for playing!");
            }
        }, 5000);
        }
}) ();


PlayGame();