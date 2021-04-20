class MiniMax {
  // Gives the AI the best move at a given depth
  bestMove(depth) {
    // AI is the minimizing player
    let bestScore = Infinity;
    let move;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == '') {
          board[i][j] = ai;
          // For depth limited search, set depth > 0
          let score = minimax(board, depth, true);
          board[i][j] = '';
          if (score < bestScore) {
            bestScore = score;
            move = { i, j };
          }
        }
      }
    }
    board[move.i][move.j] = ai;
    currentPlayer = human;
    
  }

  // Full depth search
  bestMove() {
    bestMove(Infinity);
  }
}

function bestMove() {
  // AI is the minimizing player
  let bestScore = Infinity;
  let move;
  let depth = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == '') {
        board[i][j] = ai;
        // For depth limited search, set depth > 0
        let score = minimax(board, depth, true);
        board[i][j] = '';
        if (score < bestScore) {
          bestScore = score;
          move = { i, j };
        }
      }
    }
  }
  board[move.i][move.j] = ai;
  currentPlayer = human;
  
}

let scores = {
  X: 1,
  O: -1,
  tie: 0
}

// The minimax algorithm
function minimax(board, depth, isMaximizing) {
  let result = checkWinner();
  // For depth limited search, base case is when depth == 0
  if (result !== null) {
    return scores[result];;
  }

  if (isMaximizing) {
    return maximiseScore(board, depth);
  } else {
    return minimiseScore(board, depth);
  }
}

// Minimising score function
function minimiseScore(board, depth) {
  let bestScore = Infinity;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      // Is spot available?
      if (board[i][j] == '') {
        board[i][j] = ai;
        let score = minimax(board, depth - 1, true);
        board[i][j] = '';
        bestScore = min(score, bestScore);
      }
    }
  }
  return bestScore;
}

// Maximising score function
function maximiseScore(board, depth) {
  let bestScore = -Infinity;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      // Is spot available?
      if (board[i][j] == '') {
        board[i][j] = human;
        let score = minimax(board, depth - 1, false);
        board[i][j] = '';
        bestScore = max(score, bestScore);
      }
    }
  }
  return bestScore;
}

function eval() {
  //Eval(s) = 3X2(s) + X1(s) − (3O2(s) + O1(s))
  x1 = 0;
  x2 = 0;
  o1 = 0;
  o2 = 0;
  
  // Search vertically
  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 3; i++) {
      if (board[i][j] == 'X') {
        x1++;
      } else if (board[i][j] == 'O') {
        o1++;
      }
    }
    // If X and O were found on the same column, then set to 0
    if (x1 > 0 && o1 > 0) {
      x1 = 0;
      o1 = 0;
    }
  }

  // Search horizontally
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == 'X') {
        x1++;
      } else if (board[i][j] == 'O') {
        o1++;
      }
    }
    // If X and O were found on the same column, then set to 0
    if (x1 > 0 && o1 > 0) {
      x1 = 0;
      o1 = 0;
    }
  }
  
  // Search diagonally 
  if (board[0][0] == 'X') {
    x1++;
  }
  if (board[1][2] == 'X') {
    x1++;
  }
  if (board[3][3] == 'X') {
    x1++;
  }

  
  
}