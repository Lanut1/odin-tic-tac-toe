// Cell module: Represents a single cell in the game board
const Cell = (function() {
    return function() {
        let value = 0;

        const addToken = (player) => {
            value = player;
        }

        const clearCell = () => {
            value = 0;
        }

        const getValue = () => value;

        return { addToken, clearCell, getValue };
    };
})();


// Player module: Represents a player in the game
const Player = (function() {
    return function(name, token) {
        const playerName = name;
        const playerToken = token;

        const getPlayerName = () => playerName;
        const getPlayerToken = () => playerToken;

        return { getPlayerName, getPlayerToken };
    }
})();


// Gameboard module: Manages the game board state
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

    const clearBoard = () => {
        board.map(row => row.map(cell => cell.clearCell()));
    }

    const printBoardValues = () => {
        const boardValues = board.map((row) => row.map((cell) => cell.getValue()));
        return boardValues;
    }

    // Place a player's token and validate the input
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

    return { makeBoard, clearBoard, printBoardValues, placeToken };
}) ();


// GameController module: Manages the game logic and flow
const GameControler = (function () {
    return function(players) {
        const sides = 3;
        Gameboard.makeBoard();
        Gameboard.printBoardValues();

        let activePlayer = players[0];

        const getActivePlayer = () => activePlayer;

        const switchPlayer = () => {
            activePlayer = activePlayer === players[0] ? players[1] : players[0];
        }
        
        // Check the win or tie state of the board
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

        // Reset the game state and UI
        const resetGame = () => {
            const cells = document.querySelectorAll(".board-cell");
            cells.forEach(cell => cell.innerText = "");

            Gameboard.clearBoard();

            const gameBoard = document.querySelector(".game-board");
            gameBoard.classList.remove("show");

            const message = document.querySelector(".message-container");
            message.style.display = "none";

            const firstPlayerInfo = document.querySelector(".first-player-info");
            firstPlayerInfo.style.display = "none";

            const secondPlayerInfo = document.querySelector(".second-player-info");
            secondPlayerInfo.style.display = "none";

            const startGameButton = document.querySelector("#start-button");
            const firstPlayerForm = document.querySelector(".first-player");
            firstPlayerForm.reset();
            const secondPlayerForm = document.querySelector(".second-player");
            secondPlayerForm.reset();

            firstPlayerForm.style.display = "block";
            secondPlayerForm.style.display = "block";
            startGameButton.style.display = "block";

        }

        // Show the result dialog with a message
        const showResultDialog = (message) => {
            const dialogWindow = document.querySelector("#result-dialog");
            const resultMessage = document.querySelector("#result-message");
            const restartButton = document.querySelector("#restart-game");
            
            resultMessage.innerText = message;
            dialogWindow.showModal();
            dialogWindow.classList.add("show");

            restartButton.addEventListener("click", function() {
                dialogWindow.classList.remove("show");
                dialogWindow.classList.add("hide");
                resetGame();
                setTimeout(() => {
                    dialogWindow.close();
                    dialogWindow.classList.remove("hide")
                    PlayGame();
                }, 700);
            })
        }

        // Handle a single round of the game
        const playRound = (row, column) => {
            const messageContainer = document.querySelector(".message-container");
            try {
                Gameboard.placeToken(row, column, getActivePlayer().getPlayerToken());
                
                let roundValues = Gameboard.printBoardValues();

                if (checkWinRow(roundValues) || checkWinColumn(roundValues) || checkWinDiagonal(roundValues)) {
                    showResultDialog(`${getActivePlayer().getPlayerName()} wins!`);
                    return { status: "gameOver", message: "win" };
                } else if (checkFullBoard(roundValues)) {
                    showResultDialog("Tie! Board is full!");
                    return { status: "gameOver", message: "tie" };
                }

                switchPlayer();
                messageContainer.innerText = `${getActivePlayer().getPlayerName()}'s turn!`;
                return { status: "continue", message: "success" };
            } catch (error) {
                messageContainer.innerText = error.message;
                return { status: "continue", message: "error" };
            }
        }

        return { playRound, getActivePlayer };
    }
}) ();


// PlayGame module: Handles game initialization and UI setup
const PlayGame = (function () {
    return function () {
        // Validate players's form
        const firstPlayerForm = document.querySelector(".first-player");
        const secondPlayerForm = document.querySelector(".second-player");
        const isFirstPlayerFormValid = firstPlayerForm.checkValidity();
        const isSecondPlayerFormValid = secondPlayerForm.checkValidity();

        if (!isFirstPlayerFormValid) {
            firstPlayerForm.reportValidity();
            return;
        }else if (!isSecondPlayerFormValid) {
            secondPlayerForm.reportValidity();
            return;
        }

        // Get players' information
        const firstPlayerName = document.querySelector("#first-player-name").value;
        const firstPlayerToken = document.querySelector('input[name="coffee-icons"]:checked').value;
        const secondPlayerName = document.querySelector("#second-player-name").value;
        const secondPlayerToken = document.querySelector('input[name="tea-icons"]:checked').value;

        // Hide forms and start button
        firstPlayerForm.style.display = "none";
        secondPlayerForm.style.display = "none";
        startGameButton.style.display = "none";

        // Show game board and players info
        const firstPlayerInfo = document.querySelector(".first-player-info");
        const gameBoard = document.querySelector(".game-board");
        const secondPlayerInfo = document.querySelector(".second-player-info");
        const messageContainer = document.querySelector(".message-container");

        const firstNameContainer = document.querySelector(".first-player-name-container");
        firstNameContainer.innerText = firstPlayerName;
        const firstTokenImage = document.querySelector(".first-player-token-image");
        firstTokenImage.src = `src/${firstPlayerToken}.png`;

        const mediaQuery = window.matchMedia('(max-width: 780px)');

        if (mediaQuery.matches) {
            firstPlayerInfo.style.display = "flex";
        } else {
            firstPlayerInfo.style.display = "block";
        }

        gameBoard.classList.add("show");

        const secondNameContainer = document.querySelector(".second-player-name-container");
        secondNameContainer.innerText = secondPlayerName;
        const secondTokenImage = document.querySelector(".second-player-token-image");
        secondTokenImage.src = `src/${secondPlayerToken}.png`;

        if (mediaQuery.matches) {
            secondPlayerInfo.style.display = "flex";
        } else {
            secondPlayerInfo.style.display = "block";
        }

        messageContainer.style.display = "block";

        // Initialize players and game
        const players = [
            Player(firstPlayerName, firstPlayerToken),
            Player(secondPlayerName, secondPlayerToken)
        ];

        const game = GameControler(players);

        let continueGame = true;

        messageContainer.innerText = `${game.getActivePlayer().getPlayerName()}'s turn! Place your token!`;

        // Add click event listeners to board cells
        document.querySelectorAll(".board-cell").forEach(cell => {
            cell.addEventListener("click", function() {
                if (continueGame) {
                    const row = parseInt(this.dataset.row);
                    const column = parseInt(this.dataset.column);
                    const currentPlayer = game.getActivePlayer().getPlayerToken();
                    let roundResult = game.playRound(row, column);
                    if (roundResult.message !== "error") {
                        const img = document.createElement("img");
                        img.src = `src/${currentPlayer}.png`;
                        img.classList.add("gameboard-token-image");
                        this.appendChild(img); 
                        if (roundResult.status === "gameOver") {
                            continueGame = false;
                        }
                    }
                }
            })
        })
    }
}) ();


// Add click event listener to start game button
const startGameButton = document.querySelector("#start-button");

startGameButton.addEventListener("click", function(event) {
    event.preventDefault();
    PlayGame();
})