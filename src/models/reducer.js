function reducer(state = [], action) {
  switch (action.type) {
    case "LOAD":
      return [action.payload, false]; // true- Fahrenheit, false- Celsius

    case "TEMP":
      return [state[0], action.payload]; // action.payload- Fahrenheit/Celsius

    default:
      return state;
  }
}

export default reducer;
