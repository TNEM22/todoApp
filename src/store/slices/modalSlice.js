import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isModalOpen: false,
  modalName: null,
  taskColId: null,
  taskState: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setIsModalOpen(state, action) {
      state.isModalOpen = action.payload;
    },
    setModalName(state, action) {
      state.modalName = action.payload;
    },
    setTaskColId(state, action) {
      state.taskColId = action.payload;
    },
    setTaskState(state, action) {
      state.taskState = action.payload;
    },
  },
});

export const {
  setIsModalOpen,
  setModalName,
  setTaskColId,
  setTaskState,
  setProjectTitle,
} = modalSlice.actions;
export default modalSlice.reducer;
