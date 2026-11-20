export interface Piece {
  type: 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';
  color: 'white' | 'black';
  symbol: string;
  row: number;
  col: number;
}
