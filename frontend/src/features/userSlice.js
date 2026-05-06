import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    fullName: undefined,
    email: undefined,
    isLoggedIn: false,
    memberSince: undefined,
  },
  reducers: {
    logIn: (state, action) => {
      state.fullName = action.payload.fullName;
      state.isLoggedIn = true;
      state.email = action.payload.email;
      state.memberSince = action.payload.memberSince;
    },

    logOut(state) {
      state.fullName = undefined;
      state.isLoggedIn = false;
      state.email = undefined;
      state.memberSince = undefined;
    },
  },
});

export const { logIn, logOut } = userSlice.actions;
export default userSlice.reducer;
