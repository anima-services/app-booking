import { createSlice } from '@reduxjs/toolkit';

export const appDataSlice = createSlice({
    name: 'appData',
    initialState: {
        data: {},
        config: {},
    },
    reducers: {
        updateData: (state, action) => {
            try {
                state.data = { ...state.data, ...action.payload };
            } catch (e) {}
        },
        setData: (state, action) => {
            state.data = action.payload;
        },
        setConfig: (state, action) => {
            state.config = action.payload;
        },
        updateConfig: (state, action) => {
            try {
                state.config = { ...state.config, ...action.payload };
            } catch (e) {}
        },
        setState: (state, action) => {
            try {
                for (let key in action.payload) {
                    state[key] = action.payload[key];
                }
            } catch (e) { }
        },
    },
});

export const { setConfig, setData, updateData, setState, updateConfig } = appDataSlice.actions;
export default appDataSlice.reducer;