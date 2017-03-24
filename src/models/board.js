import { List, Repeat } from 'immutable';
import Cell from '../types/Cell';

const initialLine = List(Repeat(new Cell(2), 4));

const initialBoard = List(
  Repeat(initialLine, 4),
  4,
);

export default {
  namespace: 'board',

  state: initialBoard,

  effects: {},

  reducers: {
    moveLeft() {

    },
  },
};
