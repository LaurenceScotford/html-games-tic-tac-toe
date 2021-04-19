// UI class
// Encapsulates the user interface for Tic Tac Toe

import { Game} from './game.js';

class Ui {
  #controls = null;

  constructor(quitHandler, newGameHandler, makeMoveHandler) {
    this.#controls = {
      'compStrengthO': document.querySelector('#compStrengthO'),
      'compStrengthX': document.querySelector('#compStrengthX'),
      'drawMsg': document.querySelector('#drawMsg'),
      'inPlayControls': document.querySelector('#inPlayControls'),
      'new': document.querySelector('#new'),
      'newGameControls': document.querySelector('#newGameControls'),
      'play': document.querySelector('#play'),
      'playerOComputer': document.querySelector('#playerOComputer'),
      'playerXComputer': document.querySelector('#playerXComputer'),
      'posWarning': document.querySelector('#posWarning'),
      'quit': document.querySelector('#quit'),
      'resultMsg': document.querySelector('#resultMsg'),
      'selectedCell': document.querySelector('#selectedCell'),
      'turn': document.querySelector('#turn'),
      'valWarning': document.querySelector('#valWarning'),
      'winMsg': document.querySelector('#winMsg'),
      'winner': document.querySelector('#winner')
    }
    this.#controls['quit'].addEventListener('click', quitHandler);
    this.#controls['new'].addEventListener('click', newGameHandler);
    this.#controls['play'].addEventListener('click', makeMoveHandler);
  }

  // Draws the board
  drawBoard(board) {
    for(let i = 0; i < board.length; i++) {
      document.querySelector('#cell' + i).innerHTML = board[i];
    }
  }

  // Displays the mark of the player whose turn it is to play
  displayTurn(mark) {
      this.#controls['turn'].innerHTML = mark;
  }

  // Displays the winner as the given mark
  displayWinner(mark) {
    this.#controls['winner'].innerHTML = mark;
    this.#showControl(this.#controls['winMsg']);
  }

  // Enables buttons so that a human player can make a move
  requestMove() {
    document.querySelector('#play').disabled = false;
    document.querySelector('#quit').disabled = false;
  }

  // Shows the listed controls
  showControls(controls) {
    this.applyControlFunction(controls, this.#showControl);
  }

  // Show control
  #showControl(control) {
    control.classList.remove('hidden');
  }

  // Hide the listed controls
  hideControls(controls) {
    this.applyControlFunction(controls, this.#hideControl);
  }

  // Hide control
  #hideControl(control) {
    control.classList.add('hidden');
  }

  // Disable the listed controls
  disableControls(controls) {
    this.applyControlFunction(controls, this.disableControl);
  }

  // Disable control
  disableControl(control) {
    control.disabled = true;
  }

  // Clear controls
  clearControls(controls) {
    this.applyControlFunction(controls, this.clearControl);
  }

  // Clear control
  clearControl(control) {
      control.value = '';
  }

  // Apply function to controls
  applyControlFunction(controls, funcToApply) {
    for (let i = 0; i < controls.length; i++) {
      funcToApply(this.#controls[controls[i]]);
    }
  }

  // Validate numeric input
  isValidNumber(control, min, max) {
    let value = this.getNumericValue(control);
    return (!(isNaN(value) || value < min || value > max));
  }

  // Gets a numeric value for a control
  getNumericValue(control) {
    return parseInt(this.#controls[control].value);
  }

  // Returns true if the indicated control is checked
  isChecked(control) {
    return this.#controls[control].checked;
  }
}

export { Ui };
