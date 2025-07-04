import { configureStore } from '@reduxjs/toolkit';
import appDataReducer from './appDataSlice';
import tempDataReducer from './tempDataSlice';

export const store = configureStore({
  reducer: {
    appData: appDataReducer,
    tempData: tempDataReducer,
  },
});