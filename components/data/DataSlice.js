import { createSlice } from '@reduxjs/toolkit';

export const DataSlice = createSlice({
    name: 'data',
    initialState: {
        logs: [],
        space_size: 15,
        events_data: [],
        space_data: {},
        system_password: "4656",
    },
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
        setLogs: (state, action) => {
            try {
                const logText = `${new Date().toLocaleString('ru')} >>> ${action.payload}`;
                state.logs.push(logText);
                console.log(logText);
                if (state.logs.length > 100) state.logs.shift();
            } catch (e) {
                state.logs = [];
            }
        },
    },
});

export const { setState, updateData, setLogs } = DataSlice.actions;
export default DataSlice.reducer;