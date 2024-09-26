import { configureStore } from "@reduxjs/toolkit";
import artistReducer from "./artistSlice";

export const store = configureStore({
  reducer: {
    artists: artistReducer,
  },
});
