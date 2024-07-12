import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";

const reduxStore = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddlewares) =>
    getDefaultMiddlewares().concat(apiSlice.middleware),
});

export default reduxStore;
