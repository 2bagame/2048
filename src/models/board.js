import {List, Repeat, fromJS} from 'immutable';
import compose from 'recompose/compose';
import identity from 'lodash/identity';
import Cell from '../types/Cell';

const initialBoard = fromJS([
  [new Cell(), new Cell(), new Cell(), new Cell()],
  [new Cell(), new Cell(), new Cell(), new Cell()],
  [new Cell(), new Cell(), new Cell(), new Cell()],
  [new Cell(), new Cell(), new Cell(), new Cell()],
]);

// square board implied
function inverseBoard(board) {
  return board.withMutations(board => {
    for (let i = 0; i < board.size; ++i) {
      for (let j = i + 1; j < board.size; ++j) {
        let temp = board.getIn([i, j]);
        board.setIn([i, j], board.getIn([j, i]));
        board.setIn([j, i], temp);
      }
    }
  });
}

// square board implied
function mirrorBoard(board) {
  return board.withMutations(board => {
    for (let i = 0; i < board.size; ++i) {
      for (let j = 0; j < board.size / 2; ++j) {
        let temp = board.getIn([i, j]);
        board.setIn([i, j], board.getIn([i, board.size - j - 1]));
        board.setIn([i, board.size - j - 1], temp);
      }
    }
  });
}

function moveLeft(board) {
  return board.map(line => {
    const condenseCells = line.filter(identity);
    const resultCells = List().withMutations(list => {
      for (let i = 0; i < condenseCells.size; ++i) {
        if (i === condenseCells.size - 1 ||
          condenseCells.get(i).getValue() !== condenseCells.get(i + 1).getValue()) {
          list.push(condenseCells.get(i));
        } else {
          list.push(condenseCells.get(i).double());
          ++i; // skip merged
        }
      }
    });
    return resultCells.concat(Repeat(null, line.size - resultCells.size));
  });
}

function moveRight(board) {
  return compose(
    mirrorBoard,
    moveLeft,
    mirrorBoard
  )(board);
}

function moveUp(board) {
  return compose(
    inverseBoard,
    moveLeft,
    inverseBoard
  )(board);
}

function moveDown(board) {
  return compose(
    inverseBoard,
    moveRight,
    inverseBoard
  )(board);
}

export default {
  namespace: 'board',

  state: initialBoard,

  effects: {},

  reducers: {
    moveLeft(board) {
      return moveLeft(board);
    },

    moveUp(board) {
      return moveUp(board);
    },

    moveRight(board) {
      return moveRight(board);
    },

    moveDown(board) {
      return moveDown(board);
    },
  },
};
