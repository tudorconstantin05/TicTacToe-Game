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

    const linesOccupied = (a,b,c) => {
      return lines.filter(squareIndexes => {
        const squareValues = squareIndexes.map(index => squares[index])
        return JSON.stringify([a,b,c].sort()) === JSON.stringify(squareValues.sort())

      })
    };

    const emptyIndexes = squares.map((square, index) => square === null ? index : null).filter(val => val !== null);

    const playerWin = () => linesOccupied('x', 'x', 'x').length > 0;
    const computerWin = () => linesOccupied('o', 'o', 'o').length > 0;

    if (playerWin){
      setWinner('x');
    }

    if (computerWin){
      setWinner('o');
    }

    const putComputerAt = index => {
      let newSquares = squares;
      newSquares[index] = 'o';
      setSquares([...newSquares]);
    }

    if (isComputerTurn) {
      const winningPossibilities = linesOccupied('o', 'o', null)

      const linesToBlock = linesOccupied('x', 'x', null);

      const linesToContinue = linesOccupied('o', null, null);

      if (winningPossibilities.length > 0){
        const winPosition = winningPossibilities[0].filter(index => squares[index] === null)[0];
        putComputerAt(winPosition);
        return;
      }

      if (linesToBlock.length > 0){
        const blockPosition = linesToBlock[0].filter(index => squares[index] === null)[0];
        putComputerAt(blockPosition);
        return;
      }

      if (linesToContinue.length > 0){
        putComputerAt(linesToContinue[0].filter(index => squares[index] === null)[0]);
        return;
      }

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
      {!!winner && winner === 'x' &&(
      <div className='result green'>
        YOU WON!
      </div>
      )}
      {!!winner && winner === 'o' &&(
      <div className='result red'>
        YOU LOST!
      </div>
      )}
    </main>
  )
}

export default App