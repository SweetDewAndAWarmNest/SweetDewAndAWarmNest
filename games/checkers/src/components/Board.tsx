import React from 'react';
import { Piece } from '../logic/types';
import { getValidMoves } from '../logic/move-generator';
import { boardToGrid, squareToPosition, coordsToSq } from '../logic/board-utils';

export interface BoardProps {
  board: (Piece | null)[][];
  currentTurn: 'red' | 'black';
  selectedSquare: string | null;
  isValidMove: (from: string, to: string) => boolean;
  onSquareClick: (square: string) => void;
}

export function Board({ board, currentTurn, selectedSquare, isValidMove, onSquareClick }: BoardProps) {
  return (
    <div className="board">
      {boardToGrid(board).map((row, rowIndex) =>
        row.map((cell, colIndex) => {
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
                const piece = board[rowIndex][colIndex];
                if (piece) {
                  onSquareClick(square);
                } else {
                  onSquareClick(square);
                }
              }}
            >
              {cell && (
                <span
                  className="piece"
                  style={{
                    color: cell.color === 'red' ? '#ffcc00' : '#8888aa',
                  }}
                >
                  {cell.symbol}
                </span>
              )}
            </button>
          );
        })
      )}
    </div>
  );
}
