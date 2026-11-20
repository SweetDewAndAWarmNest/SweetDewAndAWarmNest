import React from 'react';
import { createInitialBoard, squareToPosition, squareToCoords, positionToCoords } from '../logic/board-utils';
import { getValidMoves } from '../logic/move-generator';
import { Piece } from '../logic/types';
import { Board } from './Board';

export interface ChessGameProps {
  onPieceCaptured?: (piece: Piece) => void;
}

export function ChessGame({ onPieceCaptured }: ChessGameProps) {
  const [squares, setSquares] = React.useState<(Piece | null)[][]>(() => createInitialBoard());
  const [currentTurn, setCurrentTurn] = React.useState<'white' | 'black'>('white');
  const [selectedSquare, setSelectedSquare] = React.useState<string | null>(null);

  const handleSquareClick = (square: string) => {
    if (!selectedSquare) {
      // Select piece
      const coords = squareToCoords(square);
      const piece = squares[coords[0]][coords[1]];
      if (piece && piece.color === currentTurn) {
        setSelectedSquare(square);
      }
      return;
    }

    // Try to move
    const validMoves = getValidMoves(squares, selectedSquare);
    if (validMoves.includes(square)) {
      const [fromRow, fromCol] = squareToCoords(selectedSquare);
      const [toRow, toCol] = squareToCoords(square);
      const movingPiece = squares[fromRow][fromCol];
      if (squares[toRow][toCol]) {
        onPieceCaptured?.(squares[toRow][toCol]);
      }
      const newSquares = squares.map(row => [...row]);
      newSquares[fromRow][fromCol] = null;
      newSquares[toRow][toCol] = movingPiece;
      setSquares(newSquares);
      setCurrentTurn(prev => prev === 'white' ? 'black' : 'white');
      setSelectedSquare(null);
    } else {
      setSelectedSquare(null);
    }
  };

  return (
    <div className="chess-game">
      <Board
        pieces={squares}
        currentTurn={currentTurn}
        selectedSquare={selectedSquare}
        isValidMove={(from, to) => getValidMoves(squares, from).includes(to)}
        onSquareClick={handleSquareClick}
      />
      <div className="turn-indicator">
        {currentTurn}'s turn
      </div>
    </div>
  );
}
