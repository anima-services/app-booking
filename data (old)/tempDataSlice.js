import {
  createSlice
} from '@reduxjs/toolkit';

export const tempDataSlice = createSlice( {
  name: 'tempData',
  initialState: {
    data: {},
    logs: []
  },
  reducers: {
    updateData: (state, action) => {
      try {
        state.data = {
          ...state.data, ...action.payload
        };
      } catch (e) {}
    },
    setLogs: (state, action) => {
      try {
        state.logs.push(action.payload);
        if (state.logs.length > 20) state.logs.shift();
      } catch (e) {
        state.logs = [];
      }
    },
  },
});

export const {
  updateData, setLogs
} = tempDataSlice.actions;
export default tempDataSlice.reducer;