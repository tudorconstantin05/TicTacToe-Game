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

  useEffect(() => {
    const isComputerTurn = squares.filter(square => square !== null).length % 2 === 1;

    const linesOccupiedX = (a,b,c) => {
      return lines.filter(squareIndexes => {
        const squareValues = squareIndexes.map(index => squares[index])
        return JSON.stringify([a,b,c].sort()) === JSON.stringify(squareValues.sort())

      })
    };

    const playerWin = () => linesOccupiedX('x', 'x', 'x').length > 0;

    if (playerWin){
      alert('player wins');
    }

    const putComputerAt = index => {
      let newSquares = squares;
      newSquares[index] = 'o';
      setSquares([...newSquares]);
    }

    if (isComputerTurn) {
      const emptyIndexes = squares.map((square, index) => square === null ? index : null).filter(val => val !== null);
      
      const randomIndex = emptyIndexes [Math.ceil(Math.random() * emptyIndexes.length)];

      putComputerAt(randomIndex);
    }

  }, [squares])

  function handleSquareClick(index) {
    const isPlayerTurn = squares.filter(square => square !== null).length % 2 === 0;

    if (isPlayerTurn) {
      let newSquares = squares;

      newSquares[index] = 'x';
  
      setSquares([...newSquares]);
    }
  }

  return (
    <main>
      <Board>
        {squares.map((square, index) => 
        <Square
        x = {square === 'x'?1:0}

        o = {square === 'o'?1:0}

        onClick={() => handleSquareClick(index)}/>)}
      </Board>
    </main>
  )
}


export default App