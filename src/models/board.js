import {List, Repeat, fromJS} from 'immutable';
import compose from 'recompose/compose';
import identity from 'lodash/identity';
import random from 'lodash/random';
import Cell from '../types/Cell';

const initialBoard = fromJS([
  [new Cell(), new Cell(), null, null],
  [new Cell(), null, null, null],
  [null, null, null, null],
  [null, null, null, null],
]);

export default {
  namespace: 'board',

  state: initialBoard,

  effects: {
    *moveLeft(_, {select, put}) {
      const board = yield select(state => state.board);
      const movedBoard = moveLeft(board);
      if (board.equals(movedBoard)) {
        return;
      }
      yield put({
        type: 'setBoard',
        payload: {
          board: appendRandomToRight(movedBoard)
        }
      });
    },

    *moveUp(_, {select, put}) {
      const board = yield select(state => state.board);
      const movedBoard = moveUp(board);
      if (board.equals(movedBoard)) {
        return;
      }
      yield put({
        type: 'setBoard',
        payload: {
          board: appendRandomToBottom(movedBoard)
        }
      });
    },

    *moveRight(_, {select, put}) {
      const board = yield select(state => state.board);
      const movedBoard = moveRight(board);
      if (board.equals(movedBoard)) {
        return;
      }
      yield put({
        type: 'setBoard',
        payload: {
          board: appendRandomToLeft(movedBoard)
        }
      });
    },

    *moveDown(_, {select, put}) {
      const board = yield select(state => state.board);
      const movedBoard = moveDown(board);
      if (board.equals(movedBoard)) {
        return;
      }
      yield put({
        type: 'setBoard',
        payload: {
          board: appendRandomToTop(movedBoard)
        }
      });
    },

    *setBoard(_, {select, put}) {
      const board = yield select(state => state.board);
      if (!hasMoreMoves(board)) {
        alert('游戏结束');
        yield put({
          type: 'reset'
        });
      }
    }
  },

  reducers: {
    setBoard(_, {payload: {board}}) {
      return board;
    },

    reset() {
      return initialBoard;
    }
  },
};

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

function appendRandomToRight(board) {
  const lastColumn = board.map(line => line.last());
  const emptyIndexes = lastColumn
    .map((cell, index) => cell ? -1 : index)
    .filter(index => index !== -1);

  if (emptyIndexes.size === 0) {
    return board;
  }

  const appendIndex = emptyIndexes.get(random(0, emptyIndexes.size - 1));
  const cord = [appendIndex, board.size - 1];

  console.assert(board.getIn(cord) === null,
    'New cell should generate in empty place.',
    cord,
    'already has cell: ',
    board.getIn(cord));

  return board.setIn(cord, genRandomCell());
}

function appendRandomToBottom(board) {
  return compose(
    inverseBoard,
    appendRandomToRight,
    inverseBoard
  )(board);
}

function appendRandomToLeft(board) {
  return compose(
    mirrorBoard,
    appendRandomToRight,
    mirrorBoard
  )(board);
}

function appendRandomToTop(board) {
  return compose(
    inverseBoard,
    appendRandomToLeft,
    inverseBoard
  )(board);
}

function genRandomCell() {
  return new Cell(2); // TODO: gen random
}

function hasMoreMoves(board) {
  if (board.flatten(true).indexOf(null) !== -1) {
    return true;
  }
  return board.some(hasMoveOnLine) ||
    inverseBoard(board).some(hasMoveOnLine);
}

function hasMoveOnLine(line) {
  const lineSeq = line.toSeq();
  return lineSeq
    .butLast()
    .zip(lineSeq.rest())
    .some(([cell1, cell2]) => cell1.getValue() === cell2.getValue());
}
