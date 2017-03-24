import { Record } from 'immutable';
import uniqueId from 'lodash/uniqueId';

const defaultCell = {
  id: null,
  value: 2,
};

export default class Cell extends Record(defaultCell) {
  constructor(value = 2) {
    super({
      id: uniqueId('cell'),
      value,
    });
  }

  double() {
    return this.set('value', this.getValue() * 2);
  }

  getValue() {
    return this.get('value');
  }

  getId() {
    return this.get('id');
  }
}
