import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isFilterActive: true,
  isSortActive: false,
  sortType: null,
  showSortDropdown: false,
  showManageDropdown: false,
  showProjectsDropdown: false,
  projectsSelectedCategory: "",
};

const operationSlice = createSlice({
  name: "operation",
  initialState,
  reducers: {
    setIsFilterActive(state, action) {
      state.isFilterActive = action.payload;
    },
    setIsSortActive(state, action) {
      state.isSortActive = action.payload;
    },
    setSortType(state, action) {
      state.sortType = action.payload;
    },
    setShowSortDropdown(state, action) {
      state.showSortDropdown = action.payload;
    },
    setShowManageDropdown(state, action) {
      state.showManageDropdown = action.payload;
    },
    setShowProjectsDropdown(state, action) {
      state.showProjectsDropdown = action.payload;
    },
    setProjectsSelectedCategory(state, action) {
      state.projectsSelectedCategory = action.payload;
    },
  },
});

export const {
  setIsFilterActive,
  setIsSortActive,
  setSortType,
  setShowSortDropdown,
  setShowManageDropdown,
  setShowProjectsDropdown,
  setProjectsSelectedCategory,
} = operationSlice.actions;
export default operationSlice.reducer;
