import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  files: [],
};

const userFilesSlice = createSlice({
  name: "userFiles",
  initialState,
  reducers: {
    setUserFiles: (state, action) => {
      state.files = action.payload.files;
    },
    clearUserFiles: (state) => {
      state.files = null;
    },
  },
});

export const { setUserFiles, clearUserFiles } = userFilesSlice.actions;

export const selectUserFiles = (state) => state.userFiles.files;

export default userFilesSlice.reducer;
