const defaultState = {
  stories: [],
  loaded: false
};

const LOAD_STORIES = 'LOAD_STORIES';

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case LOAD_STORIES:
      return { ...state, stories: action.payload, loaded: true };
    default:
      return state;
  }
};

export default reducer;
