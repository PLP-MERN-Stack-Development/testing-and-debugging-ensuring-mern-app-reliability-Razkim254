export const bugReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_BUG':
      return [...state, action.payload];
    default:
      return state;
  }
};
