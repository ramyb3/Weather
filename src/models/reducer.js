function reducer(state = {}, action) {
  switch (action.type) {
    case "LOAD": {
      return { ...state, ...action.payload };
    }
    case "FAV": {
      state.favorites.key.push(action.payload.key);
      state.favorites.name.push(action.payload.name);
      return { ...state };
    }
    case "REMOVE_FAV": {
      state.favorites.key = state.favorites.key.filter(
        (fav) => fav !== action.payload.key
      );
      state.favorites.name = state.favorites.name.filter(
        (fav) => fav !== action.payload.name
      );
      return { ...state };
    }
    case "TEMP": {
      state.temp = !action.payload;
      return { ...state };
    }

    default:
      return state;
  }
}

export default reducer;
