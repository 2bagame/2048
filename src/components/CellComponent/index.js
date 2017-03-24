import React, {PropTypes} from 'react';
import Cell from '../../types/Cell';

import styles from './index.css';

export default function CellComponent({cell, ...props}) {
  return (
    <div className={styles.cell} {...props}>
      {cell.getValue()}
    </div>
  );
}

Cell.propTypes = {
  cell: PropTypes.instanceOf(Cell).isRequired,
};
