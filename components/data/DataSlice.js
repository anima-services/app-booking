import { createSlice } from '@reduxjs/toolkit';

export const DataSlice = createSlice({
    name: 'data',
    initialState: {},
    reducers: {
        updateData: (state, action) => {
            try {
                state = { ...state, ...action.payload };
            } catch (e) { console.log("Неудачная попытка обновления данных приложения! (updateData)"); }
        },
        setState: (state, action) => {
            try {
                for (let key in action.payload) {
                    state[key] = action.payload[key];
                }
            } catch (e) { console.log("Неудачная попытка обновления данных приложения! (setState)"); }
        },
    },
});

export const { setState, updateData } = DataSlice.actions;
export default DataSlice.reducer;