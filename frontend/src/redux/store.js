// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import groupReducer, { notificationMiddleware } from './group/groupSlice';
import profileReducer from './profile/profileSlice';

const store = configureStore({
  reducer: {
    group: groupReducer,
    profile: profileReducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(notificationMiddleware),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;