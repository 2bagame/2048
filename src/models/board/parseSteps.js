const actionMap = {
  L: { type: 'board/moveLeft' },
  U: { type: 'board/moveUp' },
  R: { type: 'board/moveRight' },
  D: { type: 'board/moveDown' },
};

export default function parseSteps(steps) {
  let result = [];
  for (let s of steps) {
    const action = actionMap[s.toUpperCase()];
    if (!action) {
      throw new TypeError('Step should be one of `L`, `U`, `R` and `D`');
    }
    result.push(action);
  }
  return result;
}
