import { createSlice } from "@reduxjs/toolkit";
import { logOut } from "./userSlice"; // 👈 import the action

const habitsSlice = createSlice({
  name: "habits",
  initialState: {
    items: [],
    // I am using the below boolean to preven redundant api calls
    isDataLoaded: false,
  },
  reducers: {
    setHabits: (state, action) => {
      // when you return the old state is replace with the new value that u return
      return action.payload;
    },

    addHabit(state, action) {
      state.items.push(action.payload);
    },

    removeHabit(state, action) {
      return {
        ...state,
        items: state.items.filter((habit) => habit._id !== action.payload),
      };
    },

    updateHabit(state, action) {
      const { habitId, updatedData } = action.payload;

      const newItemsArr = state.items.map((item) => {
        if (item._id === habitId) {
          return {
            ...item,
            ...updatedData,
          };
        }
        return item;
      });

      return {
        items: newItemsArr,
        isDataLoaded: true,
      };
    },

    pushHabitLog(state, action) {
      const newItemsArr = state.items.map((item) => {
        if (item._id === action.payload.habitId) {
          return {
            ...item,
            logs: [...item.logs, action.payload.log], // create new array
          };
        }
        return item;
      });

      return {
        items: newItemsArr,
        isDataLoaded: true,
      };
    },

    removeHabitLog(state, action) {
      const newItemsArr = state.items.map((item) => {
        if (item._id === action.payload.habitId) {
          return {
            ...item,
            logs: item.logs.filter((log) => log.date !== action.payload.date),
          };
        }
        return item;
      });

      return {
        items: newItemsArr,
        isDataLoaded: true,
      };
    },

    updateOneTimeTodoStatus(state, action) {
      const { todoId, isCompleted } = action.payload;

      const newItemsArr = state.items.map((item) => {
        if (item._id === todoId) {
          return {
            ...item,
            isCompleted,
          };
        }
        return item;
      });

      return {
        items: newItemsArr,
        isDataLoaded: true,
      };
    },
  },

  extraReducers: (builder) => {
    builder.addCase(logOut, () => {
      return {
        items: [],
        isDataLoaded: false,
      };
    });
  },
});

export const {
  setHabits,
  addHabit,
  removeHabit,
  updateHabit,
  pushHabitLog,
  removeHabitLog,
  updateOneTimeTodoStatus,
} = habitsSlice.actions;
export default habitsSlice.reducer;
