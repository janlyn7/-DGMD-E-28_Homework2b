
const playerLetter = ['X', 'O'];
const playerNumber = ['1', '2'];
const playerColor = ['#FA4010', 'dodgerblue'];

// colors to highlight the win condition or draw condition
const endgameColor = 'silver';
const drawColor = 'purple';

// an array storing the win conditions
const wins = [
    //horizontal wins
    [0,1,2],
    [3,4,5],
    [6,7,8],

    //vertical wins
    [0,3,6],
    [1,4,7],
    [2,5,8],

    // diagonal wins
    [0,4,8],
    [2,4,6],
];

function loadBoard() {
	let game = new Game();
	game.initAnnounce();
	game.buildBoard();
}

// Game class - builds the game board, places the ships according to the coordinates in the JSON object,
// and keeps track of number of guesses
function Game() {
	this.boardDim = 3; 	// dimension for square board
	this.squares = [];  // stores an array of Square objects
    this.turn = false;  // the 'this.turn' variable keeps track of whose turn it is, toggling between
                        // false (Player 1 represented by a red 'X') and true (Player 2 represented by a blue 'O')
	this.initAnnounce = initAnnounce;
	this.createButton = createButton;
	this.buildBoard = buildBoard;
    this.isClicked = isClicked;
    this.checkWin = checkWin;
    this.switchTurn = switchTurn;
    this.gameOver = gameOver;
	this.disableAllButtons = disableAllButtons;
	this.addRestartButton = addRestartButton;
    this.reloadBoard = reloadBoard;

}

function initAnnounce() {
    let banner = document.getElementById("banner");
    banner.innerHTML = "It is Player 1's turn";
}

function buildBoard() {
	let board = document.getElementById("board");
	let grid = document.createElement('div');
	grid.id = "grid";
	grid.setAttribute("class", "w3-display-container w3-center w3-animate-zoom w3-gray");

	// create 6x6 playing field
	for (let ii = 0; ii < Math.pow(this.boardDim,2); ii++) {
		this.createButton(ii, grid);
		this.squares.push( new Square() );
	}
	board.appendChild(grid);
}

// create a button and attach it to the grid
function createButton(numId, grid) {
	let button = document.createElement( "button");
	button.id = "button" + numId;
	button.className = "square";
	button.type = "button";
	button.innerHTML = "&nbsp;";

	button.addEventListener('click', () => {
		this.isClicked(button.id);
	});

	grid.appendChild(button);
}

function isClicked(id) {
    let pos = parseInt(id.substring(6));
    this.squares[pos].mark = (this.turn) ? playerLetter[1] : playerLetter[0];

    let btn = document.getElementById(id);
    btn.style.color = (this.turn) ? playerColor[1] : playerColor[0];
    btn.textContent = this.squares[pos].mark;
    btn.disabled = true;

    // check if any player has met the win conditions
    let winner = this.checkWin();

    // continue with the game, announcing whose turn it is
    if (winner == null) {
        this.switchTurn();
    } else {
    // game is over if there is a winner or a draw
    // make an announcement in the banner
        this.gameOver(winner);
    }
}

function switchTurn() {
    this.turn = !this.turn;

    let banner = document.getElementById("banner");
    banner.innerText = "It is Player " + ((this.turn) ? playerNumber[1] : playerNumber[0]) + "'s turn";
}

function gameOver(winner) {
    let banner = document.getElementById("banner");

    if (winner === '0') {
        banner.innerHTML = "It's a <span style=color:" + drawColor + ";font-weight:bold>Draw</span>.  Game Over!";
    } else {
        banner.innerHTML = "Congratulations! <span style=color:" + playerColor[(parseInt(winner) - 1)] +
            ";font-weight:bold> Player " + winner + "</span> has won!";
    }

    // turn off buttons to prevent user from entering more X's and O's
    this.disableAllButtons();
    // append a 'Play Again' button below the game board
    this.addRestartButton();
}

function checkWin() {

    let winner = null;
    let result = null;
    let allTaken = true;
    let boardArray =[];

    this.squares.map( sq => {
        boardArray.push(sq.mark);
        if (sq.isEmpty()) {
            allTaken = false;
        }
    });

    // loop over the win conditions
    // if there are three matching squares in a row which are not null and
    // save the winner in a return variable
    wins.forEach(win => {
        if ((result === null) &&
            (boardArray[ win[0] ] !== "") &&
            (boardArray[ win[1] ] !== "") &&
            (boardArray[ win[2] ] !== "")) {
            if ((boardArray[win[0]] === boardArray[win[1]]) &&
                (boardArray[win[1]] === boardArray[win[2]])) {

                winner = (boardArray[win[0]] === 'O') ? playerNumber[1] : playerNumber[0];
                result = win;
            }
        }
    });

    // if all the squares are taken and there is no winner, it is a stalemate, also known as a 'cat' in tic-tac-toe
    // highlight squares to make a 'C' on the board
    if ((allTaken) && (winner == null)) {
        winner = '0';
        document.getElementById("button0").style.background = endgameColor ;
        document.getElementById("button1").style.background = endgameColor ;
        document.getElementById("button2").style.background = endgameColor ;
        document.getElementById("button3").style.background = endgameColor ;
        document.getElementById("button6").style.background = endgameColor ;
        document.getElementById("button7").style.background = endgameColor ;
        document.getElementById("button8").style.background = endgameColor ;
    } else {
        if (winner !== null) {
            // highlight the winning combo
            document.getElementById("button" + result[0]).style.background = endgameColor;
            document.getElementById("button" + result[1]).style.background = endgameColor;
            document.getElementById("button" + result[2]).style.background = endgameColor;
        }
    }

    // return winner
    //   0 = Draw
    //   1 = Player 1 has won
    //   2 = Player 2 has won
    //   null = continue play
    return winner;
}


function disableAllButtons() {
	for (let ii = 0; ii < Math.pow(this.boardDim,2); ii++) {
        let btn = document.getElementById("button" + ii);
        btn.disabled = true;
        btn.style.pointerEvents = "none";
    }

}

// after the game has ended, add a button below the
// game board allowing the user to reset the board and play another game
function addRestartButton() {
    let restart = document.getElementById("restart");
    let btn = document.createElement( "button");
    btn.type = "button";
    btn.id = "playAgain";
    btn.style.fontSize = "20px";
    btn.innerText = "Play Again";
    btn.setAttribute("class", "w3-button w3-black")
    btn.addEventListener ('click', this.reloadBoard);
    restart.appendChild(btn);
}

// reload board and start a new game
function reloadBoard() {
    // remove the old board
    let div = document.getElementById("grid");
    div.parentNode.removeChild(div);

    // remove the 'Play Again' button
    div = document.getElementById("playAgain");
    div.parentNode.removeChild(div);

    // load a fresh game board
    loadBoard();
}


// Square class - stores info on whether the square/button is an 'X' or an 'O'
function Square() {
	this.mark = "";
	this.isEmpty = isEmpty;
}

function isEmpty() {
    return this.mark === "" ? true : false;

}