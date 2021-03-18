const defaultState = {
  loaded: false
};

export const LOAD_STORIES = 'LOAD_STORIES';

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case LOAD_STORIES:
      return { ...action.payload.board, loaded: true };
    default:
      return state;
  }
};

export default reducer;
