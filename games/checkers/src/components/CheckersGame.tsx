import React from 'react';
import { Piece } from '../logic/types';
import { getValidMoves } from '../logic/move-generator';
import { Board } from './Board';
import { createInitialBoard, squareToCoords } from '../logic/board-utils';

export interface CheckersGameProps {
  onPieceCaptured?: (piece: Piece) => void;
}

export function CheckersGame({ onPieceCaptured }: CheckersGameProps) {
  const [board, setBoard] = React.useState<(Piece | null)[][]>(() => createInitialBoard());
  const [currentTurn, setCurrentTurn] = React.useState<'red' | 'black'>('red');
  const [selectedSquare, setSelectedSquare] = React.useState<string | null>(null);

  const handleSquareClick = (square: string) => {
    if (!selectedSquare) {
      const coords = squareToCoords(square);
      const piece = board[coords[0]][coords[1]];
      if (piece && piece.color === currentTurn) {
        setSelectedSquare(square);
      }
      return;
    }

    const validMoves = getValidMoves(board, selectedSquare);
    if (validMoves.includes(square)) {
      const [fromRow, fromCol] = squareToCoords(selectedSquare);
      const [toRow, toCol] = squareToCoords(square);
      const movingPiece = board[fromRow][fromCol];
      if (board[toRow][toCol]) {
        onPieceCaptured?.(board[toRow][toCol]);
      }
      const newBoard = board.map(row => [...row]);
      newBoard[fromRow][fromCol] = null;
      newBoard[toRow][toCol] = movingPiece;
      setBoard(newBoard);
      setCurrentTurn(prev => prev === 'red' ? 'black' : 'red');
      setSelectedSquare(null);
    } else {
      setSelectedSquare(null);
    }
  };

  return (
    <div className="checkers-game">
      <Board
        board={board}
        currentTurn={currentTurn}
        selectedSquare={selectedSquare}
        isValidMove={(from, to) => getValidMoves(board, from).includes(to)}
        onSquareClick={handleSquareClick}
      />
      <div className="turn-indicator">
        {currentTurn}'s turn
      </div>
    </div>
  );
}
