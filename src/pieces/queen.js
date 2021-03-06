import Piece from './piece.js';
import { isSameRow, isSameColumn, isSameDiagonal, isPathClean } from '../helpers'
import blackQueen from "./img/bq.png";
import whiteQueen from "./img/wq.png";

export default class Queen extends Piece {
  constructor(player) {
    super(player, (player === 1 ? whiteQueen : blackQueen));
  }

  isMovePossible(src, dest, Blocks) {
    return isPathClean(this.getSrcToDestPath(src, dest), Blocks) && (isSameDiagonal(src, dest) || isSameRow(src, dest) || isSameColumn(src, dest));
  }

  getSrcToDestPath(src, dest) {
    let path = [], pathStart, pathEnd, incrementBy;
    if (src > dest) {
      pathStart = dest;
      pathEnd = src;
    }
    else {
      pathStart = src;
      pathEnd = dest;
    }
    if (Math.abs(src - dest) % 8 === 0) {
      incrementBy = 8;
      pathStart += 8;
    }
    else if (Math.abs(src - dest) % 9 === 0) {
      incrementBy = 9;
      pathStart += 9;
    }
    else if (Math.abs(src - dest) % 7 === 0) {
      incrementBy = 7;
      pathStart += 7;
    }
    else {
      incrementBy = 1;
      pathStart += 1;
    }

    for (let i = pathStart; i < pathEnd; i += incrementBy) {
      path.push(i);
    }
    return path;
  }
}