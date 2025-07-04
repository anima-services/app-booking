import { useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useDispatch } from 'react-redux';
import { store } from './Store';
import { setState } from './appDataSlice';

import SystemNavigationBar from 'react-native-system-navigation-bar';

const DataManager = (props) => {
    const storeData = async (name, value) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(name, jsonValue);
        } catch (e) {
            // saving error
        }
    };

    const getData = async (name) => {
        try {
            const jsonValue = await AsyncStorage.getItem(name);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            // error reading value
        }
    };

    const dispatch = useDispatch();
    useEffect(() => {
        getData("data").then((value) => {
            console.log('Инициализированы данные приложения:', value);
            dispatch(setState(value));
        });

        const unsubscribe = store.subscribe(() => {
            let storeState = store.getState().data;
            storeData("data", storeState);
        });
        SystemNavigationBar.navigationHide();
    }, []);

    return (<></>);
};

export default DataManager;