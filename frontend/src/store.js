import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./features/userSlice.js";
import habitsReducer from "./features/habitsSlice.js";

export const store = configureStore({
  reducer: {
    user: userReducer,
    habits: habitsReducer,
  },
});
