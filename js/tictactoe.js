// Javascript file for Tic Tac Toe

var tictactoe = {
  board: [],  // Holds array representing board (set in resetGame function)
  // Lines is an array with the board positions representing the possible win lines
  lines: [
    [0, 1, 2],
    [0, 4, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 4, 6],
    [2, 5, 8],
    [3, 4, 5],
    [6, 7, 8]
  ],
  turn: 'O',  // A character representing the current player
  moves: 0,   // Number of moves made in the game

  // Initialise the game on start up (set up UI handlers and begin new game)
  initialiseGame: function() {
    document.querySelector('#quit').addEventListener('click', () => {
       tictactoe.quit(true);
    });
    document.querySelector('#new').addEventListener('click', this.resetGame);
    document.querySelector('#play').addEventListener('click', this.play);
    this.resetGame();
  },

  // Draw the current board based on the contents of the board array
  drawBoard: function() {
    for(let i = 0; i < 9; i++) {
      document.querySelector('#cell' + i).innerHTML = this.board[i];
    }
    document.querySelector('#turn').innerHTML = this.turn;
  },

  // Called when a player inputs a move. Validates the move, then updates and
  // redraws the board
  play: function() {
    let valWarning = document.querySelector('#valWarning');
    let posWarning = document.querySelector('#posWarning')
    let cellInput = document.querySelector('#selectedCell')

    valWarning.classList.add('hidden');
    posWarning.classList.add('hidden');

    let selectedCell = parseInt(cellInput.value);

    // Check player entered a valid cell number
    if (isNaN(selectedCell) || selectedCell < 1 || selectedCell > 9) {
      valWarning.classList.remove('hidden');
    } else {
      selectedCell--;

      // Check entered cell is empty
      if (tictactoe.board[selectedCell] != ' ') {
        posWarning.classList.remove('hidden');
      } else {
        // if valid cell has been entered, process the move
        cellInput.value = '';

        tictactoe.board[selectedCell] = tictactoe.turn;
        tictactoe.turn = tictactoe.otherPlayer();
              tictactoe.drawBoard();

        // Check for a won game, then for a draw
        if (tictactoe.checkForWin()) {
          tictactoe.quit(true);
        } else if (++tictactoe.moves == 9) {
          tictactoe.quit(false);
        }
      }
    }
  },

  // Checks if either player has achieved a line of three marks
  checkForWin: function() {
    for (let i = 0; i < this.lines.length; i++) {
      if (this.countMarks('O', i) == 3 || this.countMarks('X', i) == 3) {
        return true;
      }
    }
    return false;
  },

  // Counts the marks for the given player in the given win line
  countMarks: function(piece, line) {
    let count = 0;
    for (let i = 0; i < this.lines[line].length; i++) {
      if (this.board[this.lines[line][i]] == piece) {
        count++;
      }
    }
    return count;
  },

  // Called when the game ends. Displays the winner or a draw message and the
  // controls to start a new game
  quit: function(gameIsWon) {
    let winMsg = document.querySelector('#winMsg');
    let drawMsg = document.querySelector('#drawMsg');
    winMsg.classList.add('hidden');
    drawMsg.classList.add('hidden');

    if(gameIsWon) {
      document.querySelector('#winner').innerHTML = this.otherPlayer();
      winMsg.classList.remove('hidden');
    } else {
      drawMsg.classList.remove('hidden');
    }

    document.querySelector('#inPlayControls').classList.add('hidden');
    document.querySelector('#outOfPlayControls').classList.remove('hidden');
  },

  // Starts a new game, clearing the board, setting the first player to 'O' and
  // showing the UI for entering moves
  resetGame: function() {
    tictactoe.board = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
    tictactoe.turn = 'O';
    tictactoe.moves = 0;
    document.querySelector('#inPlayControls').classList.remove('hidden');
    document.querySelector('#outOfPlayControls').classList.add('hidden');
    tictactoe.drawBoard();
  },

  // Returns the character of the player not currently in play
  otherPlayer: function() {
    return tictactoe.turn == 'O' ? 'X' : 'O';
  }
}
