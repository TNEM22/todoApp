import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  hasEntered: false,
  theme: "light",
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setHasEntered(state, action) {
      state.hasEntered = action.payload;
    },
    setTheme(state, action) {
      state.theme = action.payload;
    },
  },
});

export const { setHasEntered, setTheme } = navigationSlice.actions;
export default navigationSlice.reducer;
