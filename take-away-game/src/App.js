import React from 'react';
import ReactDOM from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Select from '@material-ui/core/Select';
import Paper from '@material-ui/core/Paper';
import './App.css';
import { Button, FormControl, FormControlLabel, Input, InputLabel, MenuItem, Radio, RadioGroup } from '@material-ui/core';
import { MiniMax } from './minimax';

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
var selectedPlayer = "human"; // Initially when game loads
var currentChips = 40;
var inputChips = 40;
var selectedDepth = 3;
var take1 = false;
var take2 = false;
var take3 = false;
var playerWon = "";
var moveCount = 0;
var timeTaken = 0;
var addRowToTable = true;


function resetGame() {
  rows = [];

  currentPlayer = selectedPlayer;
	currentChips = inputChips;
	console.log(currentPlayer);
  take1 = false;
  take2 = false;
  take3 = false;
  playerWon = "";
	if (currentPlayer == "AI") {
		takeChips(0);
	}

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
  let minimax;

  if (currentChips <= 0) {
    playerWon = "Player won";
  } else {
    currentPlayer = 'AI';
    minimax = new MiniMax(currentPlayer)
    computerPick = minimax.bestMove(currentChips, selectedDepth); // Use minimax to get the optimal pick
    currentChips -= computerPick; // Subtract chips from computer
    modifiedChipsC = currentChips;
    if (currentChips <= 0) {
      playerWon = "Computer won";

    }
    currentPlayer = 'human';
  }
	// Record some statistics
	timeTaken = minimax.timeTaken / 1000;
	moveCount = minimax.moveCount;

	if (addRowToTable) {
		rows.push(addRow(playerPick + ", Chips left: " + modifiedChipsP, computerPick + ", Chips left: " + modifiedChipsC)); // Add results to table
	}

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

export function evaluate(chips) {
  return ((chips) % 4);
}

function App() {

  const classes = useStyles();
	const [depth, setDepth] = React.useState(3);
	const [player, setPlayer] = React.useState('human');
	const [chips, setChips] = React.useState(40);
	const [tableAddRow, setTable]	= React.useState('yes');
	
	const changeDepth = (event) => {
		setDepth(event.target.value);
		selectedDepth = event.target.value;
	}

	const handlePlayer = (event) => {
		setPlayer(event.target.value);
		selectedPlayer = event.target.value;
	}
	const handleChips = (event) => {
		setChips(event.target.value);
		inputChips = event.target.value;
	}
	const handleTable = (event) => {
		setTable(event.target.value);
		if (event.target.value == "yes") {
			addRowToTable = true;
		} else {
			addRowToTable = false;
		}
	}
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
      <Button onClick={() => { takeChips(1) }} variant="contained" color="primary" disabled={take1}>Take 1 (Eval: {evaluate(currentChips-1)})</Button>
      <Button onClick={() => { takeChips(2) }} variant="contained" color="primary" disabled={take2}>Take 2 (Eval: {evaluate(currentChips-2)})</Button>
      <Button onClick={() => { takeChips(3) }} variant="contained" color="primary" disabled={take3}>Take 3 (Eval: {evaluate(currentChips-3)})</Button>
      <Button onClick={() => { resetGame() }} variant="contained" color="secondary">Reset game</Button>
      <br></br>
			<br></br>
			Please click on reset game to apply the below settings
			except for search depth. Depth is applied anytime it is changed
			<br></br>
			<InputLabel>Who starts first?</InputLabel>
			<RadioGroup value={player} onChange={handlePlayer}>
				<FormControlLabel value="human" control={<Radio />} label="Player"></FormControlLabel>
				<FormControlLabel value="AI" control={<Radio />} label="Computer"></FormControlLabel>
			</RadioGroup>
			<InputLabel>Add turns to table?</InputLabel>
			<RadioGroup value={tableAddRow} onChange={handleTable}>
			<FormControlLabel value="yes" control={<Radio />} label="Yes"></FormControlLabel>
				<FormControlLabel value="no" control={<Radio />} label="No"></FormControlLabel>
			</RadioGroup>
      <InputLabel id="chips">Number of chips:</InputLabel>
      <Input type="number" labelid="chips" onChange={handleChips} value={chips}></Input>
      <br></br>
      <br></br>
      <InputLabel id="search-depth-label">Search depth</InputLabel>
      <Input labelid="search-depth-label" onChange={changeDepth} value={depth}></Input>
			<br></br>
			Time taken for AI turn: {timeTaken}s
			<br></br>
			Possible moves done by AI: {moveCount}
      <br></br>
      <h2>Chips left: {currentChips}</h2>
      <br></br>
      <h2>Turn: {currentPlayer}</h2>
      <br></br>
      <h2>{playerWon}</h2>
    </div>

  );
}


export default App;
