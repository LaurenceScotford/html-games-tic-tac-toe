// Javascript file for Tic Tac Toe
import css from '../css/tictactoe.css';
import { Ui } from './ui.js';
import { Game } from './game.js';

let ui = null;    // Object encapsulating the UI for the game
let game = null;  // Object representing the game state

// Initialise the game on start up (set up UI handlers and begin new game)
function initialiseGame() {
  ui = new Ui(() => {
    quit(game.getMarkForCurrentPlayer() == 'O' ? 'X' : 'O');
  }, resetGame, play);
}

  // Gets the next move from a computer or human player
  function getMove() {
    processOutcome(game.getMove());
  }

  function processOutcome(outcome) {
    ui.drawBoard(outcome[0]);

    switch (outcome[1]) {
      case 'P':
        // If the game can't complete the current move (because it's a human
        // player's turn to play, then request move input from the UI)
        ui.requestMove();
        break;
      case 'W':
      case 'D':
        //  Game was won or drawn
        quit(outcome[2]);
        break;
      default:
        // Game is still in play
        ui.displayTurn(outcome[2]);
        getMove();
        break;
    }
  }

  // Called when a player inputs a move. Validates the move, then send the
  // move to the game to process if valid
  function play() {
    let valid = true;
    let selectedCell;
    ui.hideControls(['valWarning', 'posWarning']);

    // Check player entered a valid cell number
    if (ui.isValidNumber('selectedCell', 1, 9)) {
      selectedCell = ui.getNumericValue('selectedCell') - 1;

      // Check entered cell is empty
      if (!game.isValidMove(selectedCell)) {
        ui.showControls(['posWarning']);
        valid = false;
      }
    } else {
      ui.showControls(['valWarning']);
      valid = false;
    }

    // if valid cell has been entered, pass the move to the game for processing
    if (valid) {
      ui.disableControls(['play', 'quit']);
      ui.clearControls(['selectedCell']);
      processOutcome(game.processMove(selectedCell));
    }
  }

  // Called when the game ends. Displays the winner or a draw message and the
  // controls to start a new game
  function quit(outcome) {
    ui.hideControls(['winMsg', 'drawMsg']);

    if(outcome == 'O' || outcome == 'X') {
      ui.displayWinner(outcome);
    } else {
      ui.showControls(['drawMsg']);
    }

    ui.hideControls(['inPlayControls']);
    ui.showControls(['resultMsg', 'newGameControls']);
  }

  // Starts a new game, clearing the board, setting the first player to 'O' and
  // showing the UI for entering moves
  function resetGame() {
    let type1 = ui.isChecked('playerOComputer') ? 'A' : 'H';
    let type2 = ui.isChecked('playerXComputer') ? 'A' : 'H';
    let strength1 = ui.getNumericValue('compStrengthO');
    let strength2 = ui.getNumericValue('compStrengthX');
    game = new Game(type1, strength1, type2, strength2);

    // Hide new game dialog and show in game controls
    ui.hideControls(['resultMsg', 'newGameControls']);
    ui.clearControls(['selectedCell']);
    ui.showControls(['inPlayControls']);

    // Drawe the initial board and display the turn and get first move
    ui.drawBoard(game);
    ui.displayTurn(game.getMarkForCurrentPlayer());
    getMove();
  }

(() => {document.addEventListener('DOMContentLoaded', function () {
  initialiseGame();
})})();