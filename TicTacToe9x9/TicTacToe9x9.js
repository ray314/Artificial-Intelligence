var board = [
  ['', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '']
];

let w;
let h;

let human = 'X';
let ai = 'O';
let currentPlayer = human;
let resultP = null;
var rad = document.getElementsByName('player');
var moveCount = 0;
var timetaken = 0;
var depth = 1;

function setup() {
  createCanvas(900, 900);
  w = width / 9;
  h = height / 9;
  for (var i = 0; i < rad.length; i++) {
    rad[i].addEventListener('change', function () {
      currentPlayer = this.value;
      resetGame();
    });
  }
}

function resetGame() {
  board = [
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '']
  ];
  for (let i = 0; i < rad.length; i++) {
    if (rad[i].checked) {
      currentPlayer = rad[i].value;
    }
  }
  if (currentPlayer == ai) {
    bestMove(depth);
  } else {
  }
  let evaluation = eval();

  document.getElementById("eval").innerHTML = `X1 = ${x1}, O1 = ${o1}, X2 = ${x2}, O2 = ${o2}, Eval: ${evaluation}`;
  loop();
  clear();
}

function equals9(a, b, c, d, e, f, g, h, i) {
  return [a, b, c, d, e, f, g, h, i].every((val, i, arr) =>
    val === arr[0] && val != '');
}

function checkWinner() {
  let winner = null;

  // vertical
  for (let i = 0; i < 9; i++) {
    if (equals9(board[i][0], board[i][1], board[i][2],
      board[i][3], board[i][4], board[i][5],
      board[i][6], board[i][7], board[i][8])) {
      winner = board[i][0];
      return winner;
    }
  }
  // horizontal
  for (let i = 0; i < 9; i++) {
    if (equals9(board[0][i], board[1][i], board[2][i],
      board[3][i], board[4][i], board[5][i],
      board[6][i], board[7][i], board[8][i])) {
      winner = board[0][i];
      return winner;
    }
  }

  // Diagonal
  if (equals9(board[0][0], board[1][1], board[2][2],
    board[3][3], board[4][4], board[5][5],
    board[6][6], board[7][7], board[8][8])) {
    winner = board[0][0];
    return winner;
  }
  if (equals9(board[8][0], board[7][1], board[6][2],
    board[5][3], board[4][4], board[4][5],
    board[3][6], board[2][7], board[0][8])) {
    winner = board[2][0];
    return winner;
  }

  let openSpots = 0;
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] == '') {
        openSpots++;
      }
    }
  }
  if (winner == null && openSpots == 0) {
    return 'tie';
  }
  return winner;
}

function handleDepth(event) {
  depth = event.target.value;
}

function mousePressed() {
  if (currentPlayer == human) {
    // Human makes a turn
    let i = floor(mouseX / w);
    let j = floor(mouseY / h);
    // If valid turn
    if (board[i][j] == '') {
      board[i][j] = human;

      if (checkWinner() == null) {
        currentPlayer = ai;
        moveCount = 0;
        bestMove(depth);
        document.getElementById("timeTaken").innerHTML = "Time taken: " + timetaken;
        document.getElementById("moveCount").innerHTML = "Move count: " + moveCount;
      }
    }
  }

  let evaluation = evaluate();

  document.getElementById("eval").innerHTML = `X1 = ${x1}, O1 = ${o1}, X2 = ${x2}, O2 = ${o2}, Eval: ${evaluation}`;
}

function draw() {
  background(230);

  for (let i = 1; i < 9; i++) {
    line(w * i, 0, w * i, height);
    line(0, h * i, width, h * i);
  }
  for (let j = 0; j < 9; j++) {
    for (let i = 0; i < 9; i++) {
      let x = w * i + w / 2;
      let y = h * j + h / 2;
      let spot = board[i][j];
      strokeWeight(4);
      if (spot == 'O') {
        noFill();
        ellipse(x, y, w / 2);
      } else if (spot == 'X') {
        let xr = w / 4;
        line(x - xr, y - xr, x + xr, y + xr);
        line(x + xr, y - xr, x - xr, y + xr);
      }
    }
  }


  let result = checkWinner();
  if (result != null) {
    noLoop();
    resultP = createP('');
    resultP.style('font-size', '32pt');
    if (result == 'tie') {
      resultP.html('Tie');
    } else {
      resultP.html(`${result} wins`);
    }
  }
}