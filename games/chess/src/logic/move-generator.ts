import { Piece } from './types';
import { positionToCoords } from './board-utils';

export function getValidMoves(board: (Piece | null)[][], from: string): string[] {
  const [r, c] = positionToCoords(from);
  const piece = board[r][c];
  if (!piece) return [];

  switch (piece.type) {
    case 'pawn': {
      const moves: string[] = [];
      const dir = piece.color === 'white' ? -1 : 1;
      const startRow = piece.color === 'white' ? 6 : 1;

      // Forward move
      const forwardRow = r + dir;
      if (forwardRow >= 0 && forwardRow < 8 && !board[forwardRow][c]) {
        moves.push(coordsToSquare(forwardRow, c));
        // Double move from start
        if (r === startRow) {
          const doubleRow = r + 2 * dir;
          if (!board[doubleRow][c]) {
            moves.push(coordsToSquare(doubleRow, c));
          }
        }
      }

      // Captures
      for (const dc of [-1, 1]) {
        const newC = c + dc;
        if (newC >= 0 && newC < 8) {
          const targetRow = r + dir;
          const target = board[targetRow][newC];
          if (target && target.color !== piece.color) {
            moves.push(coordsToSquare(targetRow, newC));
          }
        }
      }
      return moves;
    }
    case 'knight': {
      const moves: string[] = [];
      const offsets = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ];
      for (const [dr, dc] of offsets) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
          const target = board[nr][nc];
          if (!target || target.color !== piece.color) {
            moves.push(coordsToSquare(nr, nc));
          }
        }
      }
      return moves;
    }
    case 'bishop': {
      return getSlidingMoves(board, r, c, [1, 1], [-1, 1], [-1, -1], [1, -1]);
    }
    case 'rook': {
      return getSlidingMoves(board, r, c, [1, 0], [-1, 0], [0, 1], [0, -1]);
    }
    case 'queen': {
      return getSlidingMoves(board, r, c, [1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [-1, -1], [1, -1]);
    }
    case 'king': {
      const moves: string[] = [];
      const offsets = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
      ];
      for (const [dr, dc] of offsets) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
          const target = board[nr][nc];
          if (!target || target.color !== piece.color) {
            moves.push(coordsToSquare(nr, nc));
          }
        }
      }
      return moves;
    }
    default:
      return [];
  }
}

function getSlidingMoves(board: (Piece | null)[][], r: number, c: number, ...directions: number[][]): string[] {
  const moves: string[] = [];
  for (const [dr, dc] of directions) {
    let nr = r + dr;
    let nc = c + dc;
    while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
      const target = board[nr][nc];
      if (!target) {
        moves.push(coordsToSquare(nr, nc));
      } else {
        const piece = board[r][c];
        if (piece && target.color !== piece.color) {
          moves.push(coordsToSquare(nr, nc));
        }
        break;
      }
      nr += dr;
      nc += dc;
    }
  }
  return moves;
}

function coordsToSquare(r: number, c: number): string {
  return String.fromCharCode(97 + c) + (8 - r);
}
