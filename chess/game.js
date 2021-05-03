var board,
	game = new Chess();

/*The "AI" part starts here */

function minimax(depth, game, isMaximisingPlayer, useAlphaBetaPruning) {

	// Returns a list of legal moves from the current position
	var newGameMoves = game.ugly_moves();
	// AI is the maximising player player
	var bestMove = -Infinity;
	var bestMoveFound;
	console.log(newGameMoves.length);
	for (var i = 0; i < newGameMoves.length; i++) {
		var newGameMove = newGameMoves[i]
		// Make a move on the board
		game.ugly_move(newGameMove);
		
		// Run minimax with or without alpha beta pruning
		var value = minimaxRecursive(depth, game, -Infinity, Infinity, isMaximisingPlayer, useAlphaBetaPruning);
		// Undo the move
		game.undo();
		// Check if the value of the move is better than the best one
		if (value >= bestMove) {
			// Set the best move to the current one
			bestMove = value;
			bestMoveFound = newGameMove;
		}
	}
	return bestMoveFound;
}

// The recursive function
function minimaxRecursive(depth, game, alpha, beta, isMaximisingPlayer, useAlphaBetaPruning) {
	// Record the number of moves made
	positionCount++;
	if (depth <= 0) {
		// AI is the maximising player on black side so we negate the number to put the value positive
		return -evaluateBoard(game.board());
	}

	var newGameMoves = game.ugly_moves();

	// Do the same as minimax
	if (isMaximisingPlayer) {
		var bestMove = -Infinity;
		// Loop through the legal moves
		for (var i = 0; i < newGameMoves.length; i++) {
			game.ugly_move(newGameMoves[i]);
			// Run minimax to get the best value
			bestMove = Math.max(bestMove, minimaxRecursive(depth - 1, game, alpha, beta, true, useAlphaBetaPruning));
			// Undo the move
			game.undo();
			if (useAlphaBetaPruning) {
				// Alpha is -Infinity at the start
				alpha = Math.max(alpha, bestMove);
				// If alpha is greater than or equal to beta then return the bestMove
				// This will cutoff the remaining leaves to explore
				if (alpha >= beta) {
					return bestMove;
				}
			}

		}
	} else {
		var bestMove = Infinity;
		for (var i = 0; i < newGameMoves.length; i++) {
			game.ugly_move(newGameMoves[i]);
			bestMove = Math.min(bestMove, minimaxRecursive(depth - 1, game, alpha, beta, false, useAlphaBetaPruning));
			game.undo();
			if (useAlphaBetaPruning) {
				beta = Math.min(beta, bestMove);
				// If beta is less than or equal to alpha
				if (beta <= alpha) {
					return bestMove;
				}
			}
		}
	}
	return bestMove;
}

// The evaluation function
function evaluateBoard(board) {
	var totalEvaluation = 0;
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			// The evaluation is slightly different, it will count in the position on the pieces.
			// Some positions on the board are better than others
			totalEvaluation = totalEvaluation + getPieceValue(board[i][j], i, j);
		}
	}
	return totalEvaluation;
}

function reverseArray(array) {
	return array.slice().reverse();
}

var pawnEvalWhite =
	[   // A grid with values depending on the position. Higher values mean better scores
		[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
		[5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0],
		[1.0, 1.0, 2.0, 3.0, 3.0, 2.0, 1.0, 1.0],
		[0.5, 0.5, 1.0, 2.5, 2.5, 1.0, 0.5, 0.5],
		[0.0, 0.0, 0.0, 2.0, 2.0, 0.0, 0.0, 0.0],
		[0.5, -0.5, -1.0, 0.0, 0.0, -1.0, -0.5, 0.5],
		[0.5, 1.0, 1.0, -2.0, -2.0, 1.0, 1.0, 0.5],
		[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
	];

var pawnEvalBlack = reverseArray(pawnEvalWhite);

var knightEval =
	[
		[-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
		[-4.0, -2.0, 0.0, 0.0, 0.0, 0.0, -2.0, -4.0],
		[-3.0, 0.0, 1.0, 1.5, 1.5, 1.0, 0.0, -3.0],
		[-3.0, 0.5, 1.5, 2.0, 2.0, 1.5, 0.5, -3.0],
		[-3.0, 0.0, 1.5, 2.0, 2.0, 1.5, 0.0, -3.0],
		[-3.0, 0.5, 1.0, 1.5, 1.5, 1.0, 0.5, -3.0],
		[-4.0, -2.0, 0.0, 0.5, 0.5, 0.0, -2.0, -4.0],
		[-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
	];

var bishopEvalWhite = [
	[-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
	[-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
	[-1.0, 0.0, 0.5, 1.0, 1.0, 0.5, 0.0, -1.0],
	[-1.0, 0.5, 0.5, 1.0, 1.0, 0.5, 0.5, -1.0],
	[-1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, -1.0],
	[-1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0],
	[-1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, -1.0],
	[-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
];

var bishopEvalBlack = reverseArray(bishopEvalWhite);

var rookEvalWhite = [
	[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
	[0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5],
	[-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
	[-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
	[-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
	[-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
	[-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
	[0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0]
];

var rookEvalBlack = reverseArray(rookEvalWhite);

var evalQueen =
	[
		[-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
		[-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
		[-1.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
		[-0.5, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
		[0.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
		[-1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
		[-1.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, -1.0],
		[-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
	];

var kingEvalWhite = [

	[-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
	[-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
	[-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
	[-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
	[-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
	[-1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
	[2.0, 2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 2.0],
	[2.0, 3.0, 1.0, 0.0, 0.0, 1.0, 3.0, 2.0]
];

var kingEvalBlack = reverseArray(kingEvalWhite);



// Calculate the piece value based on the position on the board
function getPieceValue(piece, x, y) {
	if (piece === null) {
		return 0;
	}
	function getAbsoluteValue(piece, isWhite, x, y) {
		if (piece.type === 'p') {
			return 10 + (isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x]);
		} else if (piece.type === 'r') {
			return 50 + (isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x]);
		} else if (piece.type === 'n') {
			return 30 + knightEval[y][x];
		} else if (piece.type === 'b') {
			return 30 + (isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x]);
		} else if (piece.type === 'q') {
			return 90 + evalQueen[y][x];
		} else if (piece.type === 'k') {
			return 900 + (isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x]);
		}
		throw "Unknown piece type: " + piece.type;
	}

	var absoluteValue = getAbsoluteValue(piece, piece.color === 'w', x, y);
	return piece.color === 'w' ? absoluteValue : -absoluteValue;
}


/* board visualization and games state handling */

function onDragStart(source, piece, position, orientation) {
	if (game.in_checkmate() === true || game.in_draw() === true ||
		piece.search(/^b/) !== -1) {
		return false;
	}
}

function makeBestMove() {
	var bestMove = getBestMove(game);
	game.ugly_move(bestMove);
	board.position(game.fen());
	renderMoveHistory(game.history());
	if (game.game_over()) {
		alert('Game over');
	}
}


var positionCount;
// The function for getting the best move
function getBestMove(game) {
	if (game.game_over()) {
		alert('Game over');
	}

	positionCount = 0;
	var depth = parseInt($('#search-depth').find(':selected').text());
	
	

	var d = new Date().getTime();
	var bestMove = minimax(depth, game, true, pruning);
	var d2 = new Date().getTime();
	var moveTime = (d2 - d);
	var positionsPerS = (positionCount * 1000 / moveTime);

	$('#position-count').text(positionCount);
	$('#time').text(moveTime / 1000 + 's');
	$('#positions-per-s').text(positionsPerS);
	return bestMove;
}

function renderMoveHistory(moves) {
	var historyElement = $('#move-history').empty();
	historyElement.empty();
	for (var i = 0; i < moves.length; i = i + 2) {
		historyElement.append('<span>' + moves[i] + ' ' + (moves[i + 1] ? moves[i + 1] : ' ') + '</span><br>')
	}
	historyElement.scrollTop(historyElement[0].scrollHeight);

}

function onDrop(source, target) {

	var move = game.move({
		from: source,
		to: target,
		promotion: 'q'
	});

	removeGreySquares();
	if (move === null) {
		return 'snapback';
	}

	renderMoveHistory(game.history());
	window.setTimeout(makeBestMove, 250);
}

function onSnapEnd() {
	board.position(game.fen());
}

function onMouseoverSquare(square, piece) {
	var moves = game.moves({
		square: square,
		verbose: true
	});

	if (moves.length === 0) return;

	greySquare(square);

	for (var i = 0; i < moves.length; i++) {
		greySquare(moves[i].to);
	}
}

function onMouseoutSquare(square, piece) {
	removeGreySquares();
}

function removeGreySquares() {
	$('#board .square-55d63').css('background', '');
}

function greySquare(square) {
	var squareEl = $('#board .square-' + square);

	var background = '#a9a9a9';
	if (squareEl.hasClass('black-3c85d') === true) {
		background = '#696969';
	}

	squareEl.css('background', background);
}

var cfg = {
	draggable: true,
	position: 'start',
	onDragStart: onDragStart,
	onDrop: onDrop,
	onMouseoutSquare: onMouseoutSquare,
	onMouseoverSquare: onMouseoverSquare,
	onSnapEnd: onSnapEnd
};
board = ChessBoard('board', cfg);
var type = document.getElementsByName("type");
var pruning = true;
for (let i of type) {
	i.addEventListener('change', () => {
		if (i.value == "withpruning") {
			pruning = true;
		} else {
			pruning = false;
		}
		console.log(pruning);
	});
	
};

function resetGame() {
	board = Chessboard('board', cfg);
	game = new Chess();
}