// Game class
// Represents a game

import { Ui } from './ui.js';
import { Board } from './board.js';
import { Player } from './player.js';
import { AiPlayer } from './aiPlayer.js';

class Game {
  #board = null;  // The board object for the game
  #players = [];  // Holds the player objects for O and X respectively
  #turn = 0;      // The index number for the current player

  // Constructor expects a player type for each player - 'A' for AI or 'H' for
  // human and a playing strength from 0 to 4 (this will be ignored for human)
  // players
  constructor(type1, strength1, type2, strength2) {
    this.#board = new Board();

    // Set up players
    this.#players[0] = type1 == 'A' ? new AiPlayer('O', strength1) : new Player('O');
    this.#players[1] = type2 == 'A' ? new AiPlayer('X', strength2) : new Player('X');
  }

  // Returns the mark at index
  getMarkAt(index) {
    return this.#board.getMarkAt(index);
  }

  // Returns the mark for the current player
  getMarkForCurrentPlayer() {
    return this.#players[this.#turn].getMark();
  }

  // Gets the next move from a computer or human player
  getMove() {
    // If the current player is a computer player, make the next move and
    // indicate move is complete
    let currentPlayer = this.#players[this.#turn];
    if (currentPlayer instanceof AiPlayer) {
      return this.processMove(currentPlayer.AIMove(this.#board, currentPlayer.getMark()));
    } else {
      // Otherwise, indicate the current move needs human input to complete
      return [this.#board.getBoard(), 'P', ' '];
    }
  }

  // Checks if a move is valid (i.e. into an empty cell)
  isValidMove(selectedCell) {
    return this.#board.cellIsEmpty(selectedCell);
  }

  // Process a move for the current player (human or AI)
  processMove(selectedCell) {
    let currentPlayerMark = this.#players[this.#turn].getMark();
    this.#board.setMarkAt(selectedCell, currentPlayerMark);
    this.#turn = this.#otherPlayer(this.#turn);
    let outcome = [this.#board.getBoard()];

    // Check for a won game, then for a draw
    if (this.#board.checkForWin(currentPlayerMark)) {
      //quit(true);
      outcome = outcome.concat(['W', currentPlayerMark]);
    } else if (this.#board.checkForComplete()) {
      // quit(false);
      outcome = outcome.concat(['D', ' ']);
    } else {
      // If neither, get next move
      //getMove();
      outcome = outcome.concat(['C', this.#players[this.#turn].getMark()]);
    }

    return outcome;
  }

  // Returns the index number of the opponent to player
  #otherPlayer(player) {
    return 1 - player;
  }
}

export { Game };
