import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userName: null,
  userEmail: null,
  photoUrl: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setActiveUser: (state, action) => {
      state.userName = action.payload.userName;
      state.userEmail = action.payload.userEmail;
      state.photoUrl = action.payload.photoUrl;
    },
    setUserLogOutState: (state) => {
      state.userName = null;
      state.userEmail = null;
      state.photoUrl = null;
    },
  },
});

export const { setActiveUser, setUserLogOutState } = userSlice.actions;

export const selectUserName = (state) => state.user.userName;
export const selectUserEmail = (state) => state.user.userEmail;
export const selectUserPhotoUrl = (state) => state.user.photoUrl;

export default userSlice.reducer;
