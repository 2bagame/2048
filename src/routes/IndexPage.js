import React from 'react';
import {connect} from 'dva';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import EventListener from 'react-event-listener';
import Board from '../components/Board';

const KEYS = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
};

function mapStateToProps(state) {
  return {
    board: state.board,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    moveLeft() {
      dispatch({
        type: 'board/moveLeft'
      });
    },
    moveUp() {
      dispatch({
        type: 'board/moveUp'
      });
    },
    moveRight() {
      dispatch({
        type: 'board/moveRight'
      });
    },
    moveDown() {
      dispatch({
        type: 'board/moveDown'
      });
    }
  };
}

function IndexPage({board, handleKeyDown}) {
  return (
    <div>
      <EventListener target="window" onKeyDown={handleKeyDown}/>
      <Board board={board}/>
    </div>
  );
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    handleKeyDown: ({moveLeft, moveUp, moveRight, moveDown}) => (event) => {
      switch (event.keyCode) {
        case KEYS.LEFT:
          event.preventDefault();
          moveLeft();
          break;
        case KEYS.UP:
          event.preventDefault();
          moveUp();
          break;
        case KEYS.RIGHT:
          event.preventDefault();
          moveRight();
          break;
        case KEYS.DOWN:
          event.preventDefault();
          moveDown();
          break;
        default:
      }
    }
  })
)(IndexPage);
