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
  AIThresholds: [100, 50, 10, 3, 0],
  playerChars: ['O', 'X'],  // The characters representing the two players
  turn: 0,  // A character representing the current player
  moves: 0,   // Number of moves made in the game
  players: ['H', 'H'],  // Holds the player for O and X respectively ('H' = human, 'C' = computer)
  AIStrengths: [0, 0],  // Holds the AI strengths for O and X respectively

  // Initialise the game on start up (set up UI handlers and begin new game)
  initialiseGame: function() {
    document.querySelector('#quit').addEventListener('click', () => {
       tictactoe.quit(true);
    });
    document.querySelector('#new').addEventListener('click', this.resetGame);
    document.querySelector('#play').addEventListener('click', this.play);
  },

  // Draw the current board based on the contents of the board array
  drawBoard: function() {
    for(let i = 0; i < 9; i++) {
      document.querySelector('#cell' + i).innerHTML = this.board[i];
    }
    document.querySelector('#turn').innerHTML = this.playerChars[this.turn];
  },

  // Gets the next move from a computer or human player
  getMove: function() {
    // If the current player is a computer player, make the next move
    if (this.players[this.turn] == 'C') {
      this.AIMove();
    } else {
      // Otherwise, enable the input controls for a human player
      document.querySelector('#play').disabled = false;
      document.querySelector('#quit').disabled = false;
    }
  },

  // Calculate the AI player's move
  AIMove: function() {
    // Create empty array for scores
    let scores = [];

    // Set the maximum score to 0
    let maxScore = 0;

    // Loop through the locations and generate a score for each
    for (let i = 0; i < 9; i++) {
      // If this space on the board is occupied ...
      if (this.board[i] != ' ') {
        // Give it a negative score
        scores[i] = -1;
      } else {
        // Calculate a score for this location
        // Set intial value to 0
        scores[i] = 0;

        // Find each line that contains the current position
        for (let j = 0; j < this.lines.length; j++) {
          if (this.lines[j].includes(i)) {
            // Count number of marks in line made by AI player and other player
            let ownMarks = this.countMarks(this.turn, j);
            let opponentMarks = this.countMarks(this.otherPlayer(), j);
            if (ownMarks == 0) {
              if (opponentMarks == 0) {
                scores[i]++;
              } else {
                scores[i] += opponentMarks == 2 ? 10 : 1;
              }
            } else if (opponentMarks == 0) {
              scores[i] += ownMarks == 2 ? 20 : 2;
            }
          }
        }

        // Adjust value based on AI threshold (strength)
        if (scores [i] <= this.AIThresholds[this.AIStrengths[this.turn]]) {
          scores[i] = 0;
        }

        // Update max score if necessary
        maxScore = Math.max(maxScore, scores[i]);
      }
    }

    // Collect all the locations that have the maximum score
    let possibleMoves = [];
    for (let i = 0; i < scores.length; i++) {
      if (scores[i] == maxScore) {
        possibleMoves.push(i);
      }
    }

    // Select a move at random from those available
    this.processMove(possibleMoves[Math.floor(Math.random() * possibleMoves.length)]);
  },

  // Called when a player inputs a move. Validates the move, then updates and
  // redraws the board
  play: function() {
    let valWarning = document.querySelector('#valWarning');
    let posWarning = document.querySelector('#posWarning')
    let cellInput = document.querySelector('#selectedCell')

    valWarning.classList.add('hidden');
    posWarning.classList.add('hidden');
    document.querySelector('#play').disabled = true;
    document.querySelector('#quit').disabled = true;

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
        tictactoe.processMove(selectedCell);
      }
    }
  },

  // Checks if either player has achieved a line of three marks
  checkForWin: function() {
    for (let i = 0; i < this.lines.length; i++) {
      if (this.countMarks(0, i) == 3 || this.countMarks(1, i) == 3) {
        return true;
      }
    }
    return false;
  },

  // Counts the marks for the given player in the given win line
  countMarks: function(piece, line) {
    let count = 0;
    for (let i = 0; i < this.lines[line].length; i++) {
      if (this.board[this.lines[line][i]] == this.playerChars[piece]) {
        count++;
      }
    }
    return count;
  },

  // Process a move for the current player
  processMove: function(selectedCell) {
    this.board[selectedCell] = tictactoe.playerChars[tictactoe.turn];
    this.turn = tictactoe.otherPlayer();
    this.drawBoard();

    // Check for a won game, then for a draw
    if (this.checkForWin()) {
      this.quit(true);
    } else if (++this.moves == 9) {
      this.quit(false);
    } else {
      // If neither, get next move
      this.getMove();
    }
  },

  // Called when the game ends. Displays the winner or a draw message and the
  // controls to start a new game
  quit: function(gameIsWon) {
    let winMsg = document.querySelector('#winMsg');
    let drawMsg = document.querySelector('#drawMsg');
    winMsg.classList.add('hidden');
    drawMsg.classList.add('hidden');

    if(gameIsWon) {
      document.querySelector('#winner').innerHTML = this.playerChars[this.otherPlayer()];
      winMsg.classList.remove('hidden');
    } else {
      drawMsg.classList.remove('hidden');
    }

    document.querySelector('#inPlayControls').classList.add('hidden');
    document.querySelector('#resultMsg').classList.remove('hidden');
    document.querySelector('#newGameControls').classList.remove('hidden');
  },

  // Starts a new game, clearing the board, setting the first player to 'O' and
  // showing the UI for entering moves
  resetGame: function() {
    tictactoe.board = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
    tictactoe.turn = 0;
    tictactoe.moves = 0;
    tictactoe.players[0] = document.querySelector('#playerOComputer').checked ? 'C' : 'H';
    tictactoe.players[1] = document.querySelector('#playerXComputer').checked ? 'C' : 'H';
    tictactoe.AIStrengths[0] = parseInt(document.querySelector('#compStrengthO').value);
    tictactoe.AIStrengths[1] = parseInt(document.querySelector('#compStrengthX').value);
    document.querySelector('#inPlayControls').classList.remove('hidden');
    document.querySelector('#resultMsg').classList.add('hidden');
    document.querySelector('#newGameControls').classList.add('hidden');
    tictactoe.drawBoard();
    tictactoe.getMove();
  },

  // Returns the index number of the player not currently in play
  otherPlayer: function() {
    return 1 - tictactoe.turn;
  }
}
