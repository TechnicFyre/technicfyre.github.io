import { useState } from 'react';

function Square({ value, onSquareClick, highlight }) {
  return (
    <button 
      className={highlight ? "square highlighted" : "square"}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winningSquares = calculateWinner(squares);
  const winner = winningSquares ? squares[winningSquares[0]] : winningSquares;
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (squares.includes(null)) {
    status = "Next player: " + (xIsNext ? "X" : "O");
  } else {
    status = "It's a draw!"
  }

  let board = [];
  for (let rowInit = 1; rowInit <= 3; rowInit++) {
    let nextRow = [];
    for (let squareInit = (rowInit - 1) * 3; squareInit < rowInit * 3; squareInit++) {
      let highlight = false;
      if (winningSquares) {
        if (winningSquares.includes(squareInit)) highlight = true;
      }
      nextRow = [...nextRow, <Square value={squares[squareInit]} onSquareClick={() => handleClick(squareInit)} highlight={highlight}/>];
    }
    board = [...board, <div className="board-row">{nextRow}</div>];
  }

  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );
}

function MovesList({ moves, sortToggle, onToggle }) {
  let button = <button onClick={() => onToggle()} >{sortToggle ? "Ascending" : "Descending"}</button>;
  if (sortToggle) {
    return (
        <ol start="0">
          {button}
          {moves}
        </ol>
    );
  }
  else {
    return (
      <ol start={moves.length - 1} reversed>
        {button}
        {moves.toReversed()}
      </ol>
    );
  }
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sortToggle, setSortToggle] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }
  
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares,move) => {
    let description;
    if (move === currentMove) {
      description = 'You are at move #' + move;
      return (
        <li key={move}>
          <div>{description}</div>
        </li>
      );
    } else if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  function handleToggle() {
    setSortToggle(!sortToggle);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div classname="game-info">
        <MovesList moves={moves} sortToggle={sortToggle} onToggle={handleToggle} />
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}