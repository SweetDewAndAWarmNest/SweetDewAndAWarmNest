import { Piece } from './types';

export function createInitialBoard(): (Piece | null)[][] {
  const board: (Piece | null)[][] = [];
  for (let r = 0; r < 8; r++) {
    board[r] = [];
    for (let c = 0; c < 8; c++) {
      board[r][c] = null;
    }
  }
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (r < 3) {
        board[r][c] = {
          type: 'man',
          color: 'red',
          symbol: '◯',
          row: r,
          col: c,
        };
      }
      if (r > 4) {
        board[r][c] = {
          type: 'man',
          color: 'black',
          symbol: '●',
          row: r,
          col: c,
        };
      }
    }
  }
  return board;
}

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

export function boardToGrid(board: (Piece | null)[][]): (Piece | null)[][] {
  return board.map(row => [...row]);
}
