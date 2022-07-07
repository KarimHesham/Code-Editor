import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  email: null,
  title: null,
  content: null,
  lastUpdated: null,
};

const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {
    setActiveFile: (state, action) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.title = action.payload.title;
      state.content = action.payload.content;
      state.lastUpdated = action.payload.lastUpdated;
    },
    setClearFile: (state) => {
      state.id = null;
      state.email = null;
      state.title = null;
      state.content = null;
      state.lastUpdated = null;
    },
  },
});

export const { setActiveFile, setClearFile } = fileSlice.actions;

export const selectFileId = (state) => state.file.id;
export const selectFileEmail = (state) => state.file.email;
export const selectFileTitle = (state) => state.file.title;
export const selectFileContent = (state) => state.file.content;
export const selectFileUpdated = (state) => state.file.lastUpdated;

export default fileSlice.reducer;
