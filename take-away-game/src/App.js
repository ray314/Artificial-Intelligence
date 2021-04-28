import React from 'react';
import ReactDOM from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import './App.css';
import { Button } from '@material-ui/core';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    borderWidth: 3,
    borderColor: "#aaaaaa",
    borderStyle: 'solid'
  }
});
var rows = [];
var currentPlayer = "human";
var currentChips = 21;
var take1 = false;
var take2 = false;
var take3 = false;
var playerWon = "";

function resetGame() {
  rows = [];
  currentPlayer = "human";
  currentChips = 21;
  take1 = false;
  take2 = false;
  take3 = false;
  playerWon = "";

  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

export function checkWinner(chips) {
  if (chips <= 0) {
    if (currentPlayer === "human") {
      return 'human';
    } else {
      return 'AI';
    }
  }
  return null;
}

function addRow(playerPick, computerPick) {
  return { playerPick, computerPick };
}

function takeChips(playerPick) {
  currentChips -= playerPick; // Subtract chips from player pick
  let modifiedChipsP = currentChips;
  let modifiedChipsC = 0;
  let computerPick = 0;

  if (currentChips <= 0) {
    playerWon = "Player won";
  } else {
    currentPlayer = 'AI';
    computerPick = bestMove(currentChips); // Use minimax to get the optimal pick
    currentChips -= computerPick; // Subtract chips from computer
    modifiedChipsC = currentChips;
    if (currentChips <= 0) {
      playerWon = "Computer won";
  
    }
    currentPlayer = 'human';
  }
  
  rows.push(addRow(playerPick + ", Chips left: " + modifiedChipsP, computerPick + ", Chips left: " + modifiedChipsC)); // Add results to table


  if (currentChips <= 0) {
    take1 = true;
  }
  if (currentChips <= 1) {
    take2 = true;
  }
  if (currentChips <= 2) {
    take3 = true;
  }

  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

function evaluate(numberOfChipsTaken) {
  return ((currentChips-numberOfChipsTaken) % 4);
}

function App() {

  const classes = useStyles();
  return (
    <div>
      <h1>Take away game</h1>
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Player</TableCell>
              <TableCell>Computer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow>
                <TableCell>{row.playerPick}</TableCell>
                <TableCell>{row.computerPick}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button onClick={() => { takeChips(1) }} variant="contained" color="primary" disabled={take1}>Take 1 (Eval: {evaluate(1)})</Button>
      <Button onClick={() => { takeChips(2) }} variant="contained" color="primary" disabled={take2}>Take 2 (Eval: {evaluate(2)})</Button>
      <Button onClick={() => { takeChips(3) }} variant="contained" color="primary" disabled={take3}>Take 3 (Eval: {evaluate(3)})</Button>
      <Button onClick={() => { resetGame() }} variant="contained" color="secondary">Reset game</Button>
      <br></br>
      <h2>Chips left: {currentChips}</h2>
      <br></br>
      <h2>Turn: {currentPlayer}</h2>
      <br></br>
      <h2>{playerWon}</h2>
    </div>

  );
}

// Minimax

function bestMove(chips) {
  // Computer is the minimising player
  let bestScore = Infinity;
  let move;
  // Pick 1, 2, or 3 and apply minimax
  for (let i = 1; i <= 3; i++) {
    if (i <= chips) {
      // AI picks a chip
      chips -= i;
      // Next turn is the maximizing player
      currentPlayer = 'AI';
      let score = minimax(chips, Infinity, true);
      chips += i;
      //console.log(i + ":" + score);
      if (score < bestScore) {
        bestScore = score;
        move = i;
      }
    }

  }

  return move;
}

let scores = {
  'human': 1,
  'AI': -1
};

function minimax(chips, depth, isMaximising) {
  let result = checkWinner(chips);
  // Check if there's a winner first
  if (result !== null) {
    //console.log(result);
    return scores[result];
  }

  if (isMaximising) {
    return maximiseScore(chips, depth);
  } else {
    return minimiseScore(chips, depth);
  }
}

function minimiseScore(chips, depth) {
  let bestScore = Infinity;
  // Pick 1, 2, or 3 and apply minimax
  for (let i = 1; i <= 3; i++) {
    // Check if chips is greater than or equal to the number picked
    if (i <= chips) {
      chips -= i;
      currentPlayer = 'AI'
      let score = minimax(chips, depth - 1, true);
      // Undo move
      chips += i;
      bestScore = Math.min(score, bestScore);
    }
  }
  return bestScore;
}

function maximiseScore(chips, depth) {
  let bestScore = -Infinity;
  // Pick 1, 2, or 3 and apply minimax
  for (let i = 1; i <= 3; i++) {
    // Check if chips is greater than or equal to the number picked
    if (i <= chips) {
      chips -= i;
      currentPlayer = 'human';
      let score = minimax(chips, depth - 1, false);
      chips += i;
      bestScore = Math.max(score, bestScore);
    }
  }
  return bestScore;
}

export default App;
