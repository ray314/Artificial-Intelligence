function bestMove() {
  // AI is the minimizing player
  let bestScore = Infinity;
  let move;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == '') {
        board[i][j] = ai;
        // For depth limited search, set depth to infinity
        let score = minimax(board, Infinity, true);
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
  console.log("test");
}

let scores = {
  X: 1,
  O: -1,
  tie: 0
}

// The minimax algorithm
function minimax(board, depth, isMaximizing) {
  let result = checkWinner();
  // Check if there's winner first
  if (result !== null) {
    return scores[result];;
  }

  
  // For depth limited search, base case is when depth == 0
  if (depth <= 0) {
    return eval(); // Return the evaluation
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

var x1 = 0;
var x2 = 0;
var o1 = 0;
var o2 = 0;

function eval() {
  //Eval(s) = 3X2(s) + X1(s) − (3O2(s) + O1(s))
  // Set these variables to 0 before each evaluation
  x1 = 0;
  x2 = 0;
  o1 = 0;
  o2 = 0;

  // Search vertically
  searchVertically();

  // Search horizontally
  searchHorizontally();

  // Search diagonally
  searchDiagonal();

  return 3*x2 + x1 - (3*o2 + o1);
}

function searchDiagonal() {
  let diagonal = [];
  let j = 0;
  // Forward
  for (let i = 0; i < 3; i++) {
    if (board[i][i] == 'X') {
      diagonal.push('X');
    } else if (board[i][i] == 'O') {
      diagonal.push('O');
    }
  }

  checkDiagonal(diagonal);
  diagonal = []; // Create new array for the other side

  // Backward
  for (let i = 2; i >= 0; i--) {
    if (board[i][j] == 'X') {
      diagonal.push('X');
    } else if (board[i][j] == 'O') {
      diagonal.push('O');
    }
    j++;
  }
  checkDiagonal(diagonal);
}

function searchHorizontally() {
  let horizontal = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == 'X') {
        horizontal.push('X');
      } else if (board[i][j] == 'O') {
        horizontal.push('O');
      }
    }
    // At the end of each column,
    // check if there's an O for xHorizontal
    checkHorizontal(horizontal);
    //console.log(horizontal);
    horizontal = [];
  }
  
}

function checkHorizontal(horizontal) {
  if (horizontal.includes('O') == false) {
    // Check if there's one X or two X
    switch (horizontal.length) {
      case 1:
        // Increment X1
        x1++;
        break;
      case 2:
        // Increment X2
        x2++;
      default:
        break;
    }
  }
  // Don't evaluate if there's an O
  // Do the same for O
  if (horizontal.includes('X') == false) {
    // Check if there's one O or two O
    switch (horizontal.length) {
      case 1:
        // Increment O1
        o1++;
        break;
      case 2:
        // Increment O2
        o2++;
      default:
        break;
    }
  }
}

function searchVertically() {
  let vertical = [];
  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 3; i++) {
      if (board[i][j] == 'X') {
        vertical.push('X');
      } else if (board[i][j] == 'O') {
        vertical.push('O');
      }
    }
    // At the end of each column,
    // check if there's an O for xVertical
    checkVertical(vertical);
    vertical = [];
  }
}

function checkVertical(vertical) {
  if (vertical.includes('O') == false) {
    // Check if there's one X or two X
    switch (vertical.length) {
      case 1:
        // Increment X1
        x1++;
        break;
      case 2:
        // Increment X2
        x2++;
      default:
        break;
    }
  }
  // Don't evaluate if there's an O
  // Do the same for O
  if (vertical.includes('X') == false) {
    // Check if there's one O or two O
    switch (vertical.length) {
      case 1:
        // Increment O1
        o1++;
        break;
      case 2:
        // Increment O2
        o2++;
      default:
        break;
    }
  }
}

function checkDiagonal(diagonal) {
  if (diagonal.includes('O') == false) {
    // Check if there's one X or two X
    switch (diagonal.length) {
      case 1:
        // Increment X1
        x1++;
        break;
      case 2:
        // Increment X2
        x2++;
      default:
        break;
    }
  }
  // Don't evaluate if there's an O
  // Do the same for O
  if (diagonal.includes('X') == false) {
    // Check if there's one O or two O
    switch (diagonal.length) {
      case 1:
        // Increment O1
        o1++;
        break;
      case 2:
        // Increment O2
        o2++;
      default:
        break;
    }
  }
}

