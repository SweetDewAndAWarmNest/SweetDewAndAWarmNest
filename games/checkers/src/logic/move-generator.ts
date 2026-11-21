import { Piece } from './types';

export function getValidMoves(board: (Piece | null)[][], from: string): string[] {
  const [r, c] = squareToCoords(from);
  const piece = board[r][c];
  if (!piece) return [];

  const isRed = piece.color === 'red';
  const dir = isRed ? 1 : -1;
  const moves: string[] = [];

  const newR = r + dir;
  if (newR >= 0 && newR < 8) {
    const newC = c - 1;
    if (newC >= 0 && board[newR][newC] === null) {
      moves.push(coordsToSq(newR, newC));
    }
    const newC2 = c + 1;
    if (newC2 < 8 && board[newR][newC2] === null) {
      moves.push(coordsToSq(newR, newC2));
    }
  }

  return moves;
}

function squareToCoords(sqStr: string): [number, number] {
  const c = sqStr.charCodeAt(0) - 97;
  const r = 8 - parseInt(sqStr[1], 10);
  return [r, c];
}

function coordsToSq(r: number, c:number): string {
  return String.fromCharCode(97 + c) + (8 - r);
}
