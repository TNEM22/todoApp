import { configureStore } from "@reduxjs/toolkit";

import modalReducer from "./slices/modalSlice";
import projectReducer from "./slices/projectSlice";
import operationReducer from "./slices/operationSlice";
import navigationReducer from "./slices/navigationSlice";

const store = configureStore({
  reducer: {
    modal: modalReducer,
    project: projectReducer,
    operation: operationReducer,
    navigation: navigationReducer,
  },
});

export default store;
