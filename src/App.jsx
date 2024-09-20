import './App.css'
import Board from './Board'
import Square from './Square'
import {useState, useEffect} from 'react'

const defaultSquares = () => (new Array(9)).fill(null);

const lines = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6],
]

function App() {
  const [squares, setSquares] = useState(defaultSquares);
  const [winner, setWinner] = useState(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);

  useEffect(() => {
    const isComputerTurn = squares.filter(square => square !== null).length % 2 === 1;

    const checkWinner = (player) => {
      return lines.some(line => {
        return line.every(index => squares[index] === player);
      });
    };

    const emptyIndexes = squares.map((square, index) => square === null ? index : null).filter(val => val !== null);

    if (checkWinner('x') && !winner) {
      setWinner('x');
      setPlayerScore(prev => prev + 1);
    } 
    else if (checkWinner('o') && !winner) {
      setWinner('o');
      setComputerScore(prev => prev + 1);
    }
    else if (squares.every(square => square !== null)) {
      setWinner('tie');
    }

    if (isComputerTurn && !winner) {
      const putComputerAt = (index) => {
        if (index !== undefined) {
          const newSquares = squares.slice();
          newSquares[index] = 'o';
          setSquares(newSquares);
        }
      };
      
      const winningPossibilities = lines.filter(line => 
        line.filter(index => squares[index] === 'o').length === 2 && line.some(index => squares[index] === null)
      );

      const linesToBlock = lines.filter(line => 
        line.filter(index => squares[index] === 'x').length === 2 && line.some(index => squares[index] === null)
      );

      const linesToContinue = lines.filter(line => 
        line.filter(index => squares[index] === 'o').length === 1 && line.some(index => squares[index] === null)
      );

      if (winningPossibilities.length > 0) {
        putComputerAt(winningPossibilities[0].find(index => squares[index] === null));
        return;
      }

      if (linesToBlock.length > 0) {
        putComputerAt(linesToBlock[0].find(index => squares[index] === null));
        return;
      }

      const emptyIndexes = squares.map((square, index) => square === null ? index : null).filter(val => val !== null);
      const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];

      putComputerAt(randomIndex); 
    }

  }, [squares])

  function handleSquareClick(index) {
    const isPlayerTurn = squares.filter(square => square !== null).length % 2 === 0;

    if (isPlayerTurn && squares[index] === null && !winner) {
      const newSquares = squares.slice();
      
      newSquares[index] = 'x';
      
      setSquares(newSquares);
  
    }
  }

  const handlePlayAgain = () => {
    setSquares(defaultSquares());
    setWinner(null);
  };

  return (
    <main>
      <Board>
        {squares.map((square, index) => 
        <Square
        key={index}
        
        x = {square === 'x'?1:0}

        o = {square === 'o'?1:0}

        onClick={() => handleSquareClick(index)}/>)}
      </Board>
      {winner && (
        <div className={`result ${winner === 'x' ? 'green' : winner === 'o' ? 'red' : 'orange'}`}>
          {winner === 'x' ? 'YOU WON!' : winner === 'o' ? 'YOU LOST!' :  'IT IS A TIE!'}
        </div>
      )}
      <button onClick={handlePlayAgain}>Play Again</button>
      <div className="scoreboard">
        <h2>Scoreboard</h2>
        <p>Player (X): {playerScore}</p>
        <p>Computer (O): {computerScore}</p>
      </div>
    </main>
  )
}

export default App