import React from 'react';
import { sq, squareToPosition } from '../logic/board-utils';
import { Piece } from '../logic/types';

export interface BoardProps {
  pieces: (Piece | null)[][];
  currentTurn: 'white' | 'black';
  selectedSquare: string | null;
  isValidMove: (from: string, to: string) => boolean;
  onSquareClick: (square: string) => void;
  onPieceClick?: (piece: Piece) => void;
}

export function Board({
  pieces,
  currentTurn,
  selectedSquare,
  isValidMove,
  onSquareClick,
  onPieceClick,
}: BoardProps) {
  return (
    <div className="board">
      {pieces.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          const square = squareToPosition(rowIndex, colIndex);
          const isDark = (rowIndex + colIndex) % 2 === 1;
          const isSelected = selectedSquare === square;
          const canMove = isSelected && isValidMove(selectedSquare, square);

          return (
            <button
              key={square}
              className={`square ${isDark ? 'dark' : 'light'} ${isSelected ? 'selected' : ''} ${canMove ? 'valid-move' : ''}`}
              style={{
                background: isDark ? '#2a2a42' : '#1a1a2e',
                border: selectedSquare === null && canMove ? '3px solid #4ade80' : 'none',
              }}
              onClick={() => {
                if (piece) {
                  onPieceClick?.(piece);
                } else {
                  onSquareClick(square);
                }
              }}
            >
              {piece && <span className="piece" style={{ color: piece.color === 'white' ? '#ffffff' : '#666688' }}>
                {piece.symbol}
              </span>}
            </button>
          );
        })
      )}
    </div>
  );
}
