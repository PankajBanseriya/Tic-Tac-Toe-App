import { useState, useEffect } from 'react';

function Square({ value, onSquareClick, isWinning }) {
  return (
    <button
      className={`md:h-24 md:w-24 border-2 md:m-1 h-18 w-18 m-0.5 rounded-lg border-gray-300 text-4xl font-bold transition-all duration-200 ${isWinning ? 'bg-green-300 scale-105' : 'hover:bg-gray-100'}
        ${value === 'X' ? 'text-blue-500' : 'text-red-500'}
        ${value ? 'animate-pop' : ''}`} 
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        winningLine: [a, b, c]
      };
    }
  }
  return null;
}

function Board({ xIsNext, squares, onPlay, isComputerTurn, winner }) {
  function handleClick(i) {
    if (squares[i] || winner || isComputerTurn) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const getStatus = () => {
    if (winner) return `Winner: ${winner.winner}`;
    if (squares.every(square => square)) return 'Game Draw!';
    return `Next player: ${xIsNext ? 'X' : 'O'}`;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className={`text-2xl font-bold mb-4 animate-fade-in ${winner ? 'scale-125 text-red-500':''}`}>{getStatus()}</div>
      <div className="grid grid-cols-3 gap-0">
        {squares.map((square, index) => (
          <Square
            key={index}
            value={square}
            isWinning={winner?.winningLine?.includes(index)}
            onSquareClick={() => handleClick(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [gameMode, setGameMode] = useState(null); // null, 'computer', or 'multiplayer'
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const isComputerTurn = gameMode === 'computer' && !xIsNext;
  const winner = calculateWinner(currentSquares);

  useEffect(() => {
    if (isComputerTurn && !winner) {
      setTimeout(makeComputerMove, 500); // Simulate a delay for the computer's move
    }
  }, [isComputerTurn, winner]);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  function makeComputerMove() {
    const emptySquares = currentSquares
      .map((square, index) => (square === null ? index : null))
      .filter((index) => index !== null);

    const randomIndex = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    if (randomIndex !== undefined) {
      const nextSquares = currentSquares.slice();
      nextSquares[randomIndex] = 'O';
      handlePlay(nextSquares);
    }
  }

  if (gameMode === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md animate-fade-in">
          <h1 className="text-4xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 drop-shadow-[0_0_10px_rgba(139,92,246,0.5)] transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_20px_rgba(139,92,246,0.8)]">
            Tic Tac Toe
          </h1>
          <p className="text-xl text-center mb-6">Choose your game mode:</p>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => setGameMode('computer')}
              className="px-6 py-3 text-white rounded-lg bg-violet-500 hover:bg-violet-600 transition-all transform hover:scale-105 active:scale-95 cursor-pointer font-semibold
              "
            >
              Play vs Computer
            </button>
            <button
              onClick={() => setGameMode('multiplayer')}
              className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-all transform hover:scale-105 active:scale-95 cursor-pointer font-semibold"
            >
              Multiplayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md animate-fade-in">
        <h1 className="text-4xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 drop-shadow-[0_0_10px_rgba(139,92,246,0.5)] transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_20px_rgba(139,92,246,0.8)]">
          Tic Tac Toe
        </h1>
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          isComputerTurn={isComputerTurn}
          winner={winner}
        />
        <button
          onClick={resetGame}
          className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-purple-500 via-blue-500 to-violet-500 text-white rounded-lg hover:bg-blue-600 transition-all transform hover:scale-102 active:scale-95 cursor-pointer"
        >
          Reset Game
        </button>
      </div>
    </div>
  );
}