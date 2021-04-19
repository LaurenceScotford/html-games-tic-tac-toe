// Board class
// Represents the Tic Tac Toe board

class Board {
  // Lines is an array with the board positions representing the possible win lines
  #lines = [
    [0, 1, 2],
    [0, 4, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 4, 6],
    [2, 5, 8],
    [3, 4, 5],
    [6, 7, 8]
  ];

  constructor() {
    this.board = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
  }

  // Get number of winning lines
  getNumLines() {
    return this.#lines.length;
  }

  // Returns the mark at index
  getMarkAt(index) {
    return this.board[index];
  }

  // Sets mark at index
  setMarkAt(index, mark) {
    this.board[index] = mark;
  }

  // Gets a copy of the entire current board state
  getBoard() {
    return [...this.board];
  }

  // Sets the board state from an external array
  setBoard(board) {
    this.board = [...board];
  }

  // Returns true if the cell is empty
  cellIsEmpty(index) {
    return this.board[index] == ' ';
  }

  // Checks if mark occurs 3 times in any line
  checkForWin(mark) {
    for (let i = 0; i < this.#lines.length; i++) {
      if (this.countMarks(mark, i) == 3 ) {
        return true;
      }
    }
    return false;
  }

  // Checks for a complete game (all positions filled)
  checkForComplete() {
    for (let i = 0; i < this.board.length; i++) {
      if (this.board[i] == ' ') {
        return false;
      }
    }

    return true;
  }

  // Counts the number of times mark occurs in the given win line
  countMarks(mark, line) {
    let count = 0;
    for (let i = 0; i < this.#lines[line].length; i++) {
      if (this.board[this.#lines[line][i]] == mark) {
        count++;
      }
    }
    return count;
  }
}

export { Board };
