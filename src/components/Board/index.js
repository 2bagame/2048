import React, {PropTypes} from 'react';
import {List} from 'immutable';

import CellComponent from '../CellComponent';
import styles from './index.css';


const BOARD_SIZE = 240;

function Board({board}) {
  const boardStyle = {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
  };

  const cells = board.map((line, y) => line.map((cell, x) => {
    const cellStyle = {
      left: x * (BOARD_SIZE / line.size),
      top: y * (BOARD_SIZE / board.size),
    };
    let extraProps = {};
    if (cell) {
      extraProps.key = cell.getId();
    }
    return <CellComponent {...extraProps}
                          cell={cell}
                          style={cellStyle}/>;
  }));

  return (
    <div className={styles.board} style={boardStyle}>
      {cells.flatten(true)}
    </div>
  );
}

Board.propTypes = {
  board: PropTypes.instanceOf(List).isRequired,
};

export default Board;
