import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import fileReducer from "../features/fileSlice";
import userFilesReducer from "../features/userFilesSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    file: fileReducer,
    userFiles: userFilesReducer,
  },
});
