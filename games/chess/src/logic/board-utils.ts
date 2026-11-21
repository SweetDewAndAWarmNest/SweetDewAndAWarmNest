import { Piece } from './types';

// Square naming: a1, b2, c3, etc.
export function sq(r: number, c: number): string {
  return String.fromCharCode(97 + c) + (8 - r);
}

export function sqToCoords(sqStr: string): [number, number] {
  const c = sqStr.charCodeAt(0) - 97;
  const r = 8 - parseInt(sqStr[1], 10);
  return [r, c];
}

export function coordsToSq(r: number, c: number): string {
  return sq(r, c);
}

export function squareToPosition(r: number, c: number): string {
  return sq(r, c);
}

export function squareToCoords(sqStr: string): [number, number] {
  return sqToCoords(sqStr);
}

export function positionToCoords(sqStr: string): [number, number] {
  return sqToCoords(sqStr);
}

export function createInitialBoard(): Piece[][] {
  const white: Piece[] = [
    { type: 'rook', color: 'white', symbol: '♜', row: 0, col: 0 },
    { type: 'knight', color: 'white', symbol: '♞', row: 0, col: 1 },
    { type: 'bishop', color: 'white', symbol: '♝', row: 0, col: 2 },
    { type: 'queen', color: 'white', symbol: '♕', row: 0, col: 3 },
    { type: 'king', color: 'white', symbol: '♔', row: 0, col: 4 },
    { type: 'bishop', color: 'white', symbol: '♗', row: 0, col: 5 },
    { type: 'knight', color: 'white', symbol: '♘', row: 0, col: 6 },
    { type: 'rook', color: 'white', symbol: '♖', row: 0, col: 7 },
    { type: 'pawn', color: 'white', symbol: '♟', row: 1, col: 0 },
    { type: 'pawn', color: 'white', symbol: '♟', row: 1, col: 1 },
    { type: 'pawn', color: 'white', symbol: '♟', row: 1, col: 2 },
    { type: 'pawn', color: 'white', symbol: '♟', row: 1, col: 3 },
    { type: 'pawn', color: 'white', symbol: '♟', row: 1, col: 4 },
    { type: 'pawn', color: 'white', symbol: '♟', row: 1, col: 5 },
    { type: 'pawn', color: 'white', symbol: '♟', row: 1, col: 6 },
    { type: 'pawn', color: 'white', symbol: '♟', row: 1, col: 7 },
  ];
  const black: Piece[] = [
    { type: 'rook', color: 'black', symbol: '♜', row: 7, col: 0 },
    { type: 'knight', color: 'black', symbol: '♞', row: 7, col: 1 },
    { type: 'bishop', color: 'black', symbol: '♝', row: 7, col: 2 },
    { type: 'queen', color: 'black', symbol: '♕', row: 7, col: 3 },
    { type: 'king', color: 'black', symbol: '♚', row: 7, col: 4 },
    { type: 'bishop', color: 'black', symbol: '♗', row: 7, col: 5 },
    { type: 'knight', color: 'black', symbol: '♘', row: 7, col: 6 },
    { type: 'rook', color: 'black', symbol: '♖', row: 7, col: 7 },
    { type: 'pawn', color: 'black', symbol: '♟', row: 6, col: 0 },
    { type: 'pawn', color: 'black', symbol: '♟', row: 6, col: 1 },
    { type: 'pawn', color: 'black', symbol: '♟', row: 6, col: 2 },
    { type: 'pawn', color: 'black', symbol: '♟', row: 6, col: 3 },
    { type: 'pawn', color: 'black', symbol: '♟', row: 6, col: 4 },
    { type: 'pawn', color: 'black', symbol: '♟', row: 6, col: 5 },
    { type: 'pawn', color: 'black', symbol: '♟', row: 6, col: 6 },
    { type: 'pawn', color: 'black', symbol: '♟', row: 6, col: 7 },
  ];
  const board: (Piece | null)[][] = [];
  for (let r = 0; r < 8; r++) {
    board[r] = [];
    for (let c = 0; c < 8; c++) {
      board[r][c] = null;
    }
  }
  for (const p of white) board[p.row][p.col] = p;
  for (const p of black) board[p.row][p.col] = p;
  return board as Piece[][];
}
