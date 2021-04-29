
let board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
];

let w;
let h;

let human = 'X';
let ai = 'O';
let currentPlayer = human;
let resultP = null;
var rad = document.getElementsByName('player');
  
function setup() {
  createCanvas(400, 400);
  w = width / 3;
  h = height / 3;
  for (var i = 0; i < rad.length; i++) {
    rad[i].addEventListener('change', function () {
      currentPlayer = this.value;
      resetGame();
      console.log("test");
    });
  }
}

function resetGame() {
  board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  for (let i = 0; i < rad.length; i++) {
    if (rad[i].checked) {
      currentPlayer = rad[i].value;
    }
  }
  if (currentPlayer == ai) {
    bestMove();
  } else {
  }
  loop();
  clear();
}

function equals3(a, b, c) {
  return a == b && b == c && a != '';
}

function checkWinner() {
  let winner = null;

  // horizontal
  for (let i = 0; i < 3; i++) {
    if (equals3(board[i][0], board[i][1], board[i][2])) {
      winner = board[i][0];
    }
  }
  // vertical
  for (let i = 0; i < 3; i++) {
    if (equals3(board[0][i], board[1][i], board[2][i])) {
      winner = board[0][i];
    }
  }

  // Diagonal
  if (equals3(board[0][0], board[1][1], board[2][2])) {
    winner = board[0][0];
  }
  if (equals3(board[2][0], board[1][1], board[0][2])) {
    winner = board[2][0];
  }

  let openSpots = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == '') {
        openSpots++;
      }
    }
  }
  if (winner == null && openSpots == 0) {
    return 'tie';
  } else {
    return winner;
  }
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
        bestMove();
      }
    }
  }
  let evaluation = eval();

  document.getElementById("eval").innerHTML = `X1 = ${x1}, O1 = ${o1}, X2 = ${x2}, O2 = ${o2}, Eval: ${evaluation}`;
}

function draw() {
  background(255);

  line(w, 0, w, height);
  line(w * 2, 0, w * 2, height);
  line(0, h, width, h);
  line(0, h * 2, width, h * 2);
  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 3; i++) {
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