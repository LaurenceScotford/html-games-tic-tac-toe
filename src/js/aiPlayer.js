// AiPlayer class
// A subclass of Player that represents an AI player

import { Player } from './player.js';
import { Board } from './board.js';

class AiPlayer extends Player {
  #strength = 0;
  #maxDepths = [0, 2, 4, 6, 10];  // Holds the maximum search depths for the different AI strengths
  #scoreThresholds = [101, 100, 6, 3, 0]; // Holds the score threshold for the different AI strengths

  constructor (mark, strength) {
    super(mark);
    this.#strength = strength; // Holds the AI strength for this AI player
  }

  // Calculate the AI player's move
  AIMove(board, mark) {
    let bestScore = -101;
    let scores = [];

    // Cycle through all the positions on the board
    for (let i = 0; i < 9; i++) {
      // If a cell is currently empty...
      if (board.cellIsEmpty(i)) {

        // Default to a score of -101 (this will be applied only if minimax
        // is not used because the AI player is weak)
        scores[i] = -101;

        // If the AI player is strong enough to warrant the minimax algorithm...
        if (this.#maxDepths[this.#strength] > 0) {
          // Play to the current position
          board.setMarkAt(i, mark);
          // Get a score using the minimax algorithm
          let score = this.#minimax(board, (mark == 'O' ? 'X' : 'O'), false, 1);
          scores[i] = score;
          board.setMarkAt(i, ' ');  // Remove mark from current position
          // If score is better then current best score then update this
          bestScore = Math.max(bestScore, score);
        }

      } else {
        // The position is not empty so apply a large negative score to ensure
        // this position will never be selected
        scores[i] = -1000;
      }
    }

    // Collect all the locations that have the maximum score
    let possibleMoves = [];

    for (let i = 0; i < scores.length; i++) {
      if (scores[i] == bestScore) {
        possibleMoves.push(i);
      }
    }

    // Return a move at random from all those delivering the best result
    return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  }

  // Apply the minimax algorithm to determine the best score achievable from the given position
  #minimax(board, mark, isMax, depth) {
    // Evaluate the current board to check for wins for either player
    let score = this.#adjustScore(this.#evalBoard(board, isMax ? mark : (mark == 'O' ? 'X' : 'O')), depth);

    // If score is 0 there has been no win, so check for a draw ...
    if (score != 0 || board.checkForComplete()) {
      // if it's a draw, it scores 0, so just return this
      return score;
    }

    // Set an initial value for best score based on whether this is a
    // maximising or minimising player
    let bestScore = isMax ? -101 : 101;

    // If we haven't yet reached the maximum depth for this AI player...
    if (depth < this.#maxDepths[this.#strength]) {
      // Cycle through all the positions on the board
      for (let i = 0; i < 9; i++) {
        // If the position is currently empty...
        if (board.cellIsEmpty(i)) {
          board.setMarkAt(i, mark); // Play to that position
          // Recursively apply the minimax algorithm to get the best score
          // achievable for that position
          let score = this.#minimax(board, mark == 'O' ? 'X' : 'O', !isMax, depth + 1);
          // For a maximising player, chose the highest score. For a minimising
          // player, choose the lowest score
          bestScore = isMax ? Math.max(bestScore, score) : Math.min(bestScore, score);
          board.setMarkAt(i, ' ');  // Remove mark from current position
        }
      }
    } else {
      // We've reached the maximum depth for this AI so evaluate the
      //non-terminal board configuration to generate a score
      bestScore = this.#evalNonTerminalBoard(board, mark, isMax);
    }

    return bestScore;
  }

  // Evaluate the board to check for a win and apply appropriate score
  #evalBoard(board, playerMark) {
        // If the current AI player has won ...
       if (board.checkForWin(playerMark)) {
         return 100;  // Score 100
       } else if (board.checkForWin(playerMark == 'O' ? 'X' : 'O')) {
         // Or -100 if the opposing player has won
         return -100;
       }
       // Neither player has won so score 9
       return 0;
  }

  // Adjusts a score based on the search depth
  #adjustScore(score, depth) {
    return score * (1 - .05 * depth);
  }

  // Evaluate the value of the given non-terminal board configuration for the given player
  #evalNonTerminalBoard(board, mark, isMax) {
    let score = 0;
    for (let i = 0; i < board.getNumLines(); i++) {
      // The threshold determines which conditions are ignored
      // based on AI strength
      let threshold = this.#scoreThresholds[this.#strength];
      let count = board.countMarks(mark, i) * 10;
      count += board.countMarks(mark == 'O' ? 'X' : 'O', i);

      switch (count) {
        case 1:
          // Zero marks for player, 1 for opponent
          score -= threshold <= 3 ? (isMax ? -3 : 3) : 0;
          break;
        case 2:
          // Zero marks for player, 2 for opponent
          score -= threshold <= 6 ? (isMax ? -6 : 6) : 0;
          break;
        case 10:
          // One mark for player, 0 for opponent
          score += threshold <= 3 ? (isMax ? 3 : -3) : 0;
          break;
        case 20:
            // Two marks for player, 0 for opponent
            score += threshold <= 6 ? (isMax ? 6 : -6) : 0;
            break;
        case 11:
        case 12:
        case 21:
          score += threshold <= 1 ? -1 : 0;
          break;
      }
    }
    return score;
  }

}

export { AiPlayer };
