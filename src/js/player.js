// Player class
// Represents a tictactoe player
// Note that Player is an abstract class and only the subclasses HumanPlayer or
// AiPlayer should be instantiated

class Player {
  constructor(mark) {
    this.mark = mark;
  }

  getMark() {
    return this.mark;
  }
}

export { Player };
