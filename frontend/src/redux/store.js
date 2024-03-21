import { combineReducers, configureStore } from "@reduxjs/toolkit";

import alertsSlice from "./alertsSlice";
import usersSlice from "./usersSlice";
import chatReducer from './chatSlice'; // Import the chat slice

const rootReducer = combineReducers({
  alerts: alertsSlice,
  users: usersSlice,
  chat: chatReducer, // Add chat reducer here
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
