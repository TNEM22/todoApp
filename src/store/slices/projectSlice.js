import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  features: {
    TEAM: {},
    PROJECTS: {},
    TASKS: [],
    REMINDERS: {},
    MESSENGERS: {},
  },
  selectedProject: null,
  projectTasks: {
    // DESIGN_SYSTEM: {
    //   TODO: [],
    //   IN_PROGRESS: [],
    //   DONE: [],
    // }
  },
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setTeam(state, action) {
      state.features.TEAM = action.payload;
    },
    setProjects(state, action) {
      state.features.PROJECTS = action.payload;
    },
    setTasks(state, action) {
      state.features.TASKS = action.payload;
    },
    setReminders(state, action) {
      state.features.REMINDERS = action.payload;
    },
    setMessengers(state, action) {
      state.features.MESSENGERS = action.payload;
    },
    setSelectedProject(state, action) {
      state.selectedProject = action.payload;
    },
    setProjectTasks(state, action) {
      state.projectTasks = action.payload;
    },
  },
});

export const {
  setTeam,
  setProjects,
  setTasks,
  setReminders,
  setMessengers,
  setSelectedProject,
  setProjectTasks,
} = projectSlice.actions;
export default projectSlice.reducer;
