import React from 'react';
import { connect } from 'dva';

import Board from '../components/Board';

function mapStateToProps(state) {
  return {
    board: state.board,
  };
}

function IndexPage({ board }) {
  return (
    <Board board={board} />
  );
}

export default connect(mapStateToProps)(IndexPage);
