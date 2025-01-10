import { createSlice } from '@reduxjs/toolkit';

export const tempDataSlice = createSlice({
    name: 'tempData',
    initialState: {

    },
    reducers: {
        updateData: (state, action) => {
            try {
                state.data = { ...state.data, ...action.payload };
            } catch (e) {}
        },
    },
});

export const { updateData } = tempDataSlice.actions;
export default tempDataSlice.reducer;