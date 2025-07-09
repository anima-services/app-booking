import { configureStore } from '@reduxjs/toolkit';
import DataReducer from './DataSlice';

export const Store = configureStore({
  reducer: {
    data: DataReducer
  },
});