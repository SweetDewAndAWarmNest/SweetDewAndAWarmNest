export interface Piece {
  type: 'man' | 'king';
  color: 'red' | 'black';
  symbol: string;
  row: number;
  col: number;
}
