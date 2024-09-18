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

  useEffect(() => {
    const isComputerTurn = squares.filter(square => square !== null).length % 2 === 1;

    const checkWinner = (player) => {
      return lines.some(line => {
        return line.every(index => squares[index] === player);
      });
    };

    const linesOccupied = (a,b,c) => {
      return lines.filter(squareIndexes => {
        const squareValues = squareIndexes.map(index => squares[index])
        return JSON.stringify([a,b,c].sort()) === JSON.stringify(squareValues.sort())

      })
    };

    const emptyIndexes = squares.map((square, index) => square === null ? index : null).filter(val => val !== null);

    const playerWin = () => linesOccupied('x', 'x', 'x').length > 0;
    const computerWin = () => linesOccupied('o', 'o', 'o').length > 0;

    if (checkWinner('x')) {
      setWinner('x');
    } 
    else if (checkWinner('o')) {
      setWinner('o');
    }
    else if (squares.every(square => square !== null)) {
      setWinner('tie');
    }

    const putComputerAt = index => {
      if (index !== undefined) {
        const newSquares = squares.slice();
        newSquares[index] = 'o';
        setSquares(newSquares);
      }
    };

    if (isComputerTurn && !winner) {
      const putComputerAt = (index) => {
        if (index !== undefined) {
          const newSquares = squares.slice();
          newSquares[index] = 'o';
          setSquares(newSquares);
        }
      };
      
      const winningPossibilities = lines.filter(line => 
        line.filter(index => squares[index] === 'o').length === 2 &&
        line.some(index => squares[index] === null)
      );

      const linesToBlock = lines.filter(line => 
        line.filter(index => squares[index] === 'x').length === 2 &&
        line.some(index => squares[index] === null)
      );

      const linesToContinue = lines.filter(line => 
        line.filter(index => squares[index] === 'o').length === 1 &&
        line.some(index => squares[index] === null)
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

  }, [squares], [winner])

  function handleSquareClick(index) {
    const isPlayerTurn = squares.filter(square => square !== null).length % 2 === 0;

    if (isPlayerTurn && squares[index] === null && !winner) {
      const newSquares = squares.slice();
      
      newSquares[index] = 'x';
      
      setSquares(newSquares);
  
    }
  }

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
    </main>
  )
}

export default App