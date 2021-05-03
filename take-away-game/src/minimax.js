import { evaluate } from './App';

// Minimax
export class MiniMax {

  currentPlayer;
  moveCount;
  timeTaken;

  constructor(currentPlayer) {
    this.currentPlayer = currentPlayer;
    this.moveCount = 0;
    this.timeTaken = 0;
  }

  checkWinner(chips) {
    if (chips <= 0) {
      if (this.currentPlayer === "human") {
        return 'human';
      } else {
        return 'AI';
      }
    }
    return null;
  }

  bestMove(chips, depth) {
    // Computer is the maximsing player
    let bestScore = Infinity;
    let move;
    // Pick 1, 2, or 3 and apply minimax
    var t0 = performance.now();
    for (let i = 1; i <= 3; i++) {
      if (i <= chips) {
        // AI picks a chip
        chips -= i;
        // Next turn is the minimising player
        this.currentPlayer = 'AI';
        let score = this.minimax(chips, depth, true);
        chips += i;
        //console.log(i + ":" + score);
        if (score < bestScore) {
          bestScore = score;
          move = i;
        }
      }
  
    }
    var t1 = performance.now();
    this.timeTaken = t1-t0;
    return move;
  }
  
  scores = {
    'human': 100,
    'AI': -100
  };
  
  minimax(chips, depth, isMaximising) {
    let result = this.checkWinner(chips);
    this.moveCount++;
    // Check if there's a winner first
    if (result !== null) {
      //console.log(result);
      return this.scores[result];
    }

    if (depth <= 0) {
      return evaluate(chips);
    }
  
    if (isMaximising) {
      return this.maximiseScore(chips, depth);
    } else {
      return this.minimiseScore(chips, depth);
    }
  }
  
  minimiseScore(chips, depth) {
    let bestScore = Infinity;
    // Pick 1, 2, or 3 and apply minimax
    for (let i = 1; i <= 3; i++) {
      // Check if chips is greater than or equal to the number picked
      if (i <= chips) {
        chips -= i;
        this.currentPlayer = 'AI'
        let score = this.minimax(chips, depth - 1, true);
        // Undo move
        chips += i;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
  
  maximiseScore(chips, depth) {
    let bestScore = -Infinity;
    // Pick 1, 2, or 3 and apply minimax
    for (let i = 1; i <= 3; i++) {
      // Check if chips is greater than or equal to the number picked
      if (i <= chips) {
        chips -= i;
        this.currentPlayer = 'human';
        let score = this.minimax(chips, depth - 1, false);
        chips += i;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  }
}


