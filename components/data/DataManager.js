import { useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useDispatch } from 'react-redux';
import { Store } from './Store';
import { setState } from './DataSlice';

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
            dispatch(setState(
                updateOldDate(value)
            ));
        });

        const unsubscribe = Store.subscribe(() => {
            let storeState = Store.getState().data;
            storeData("data", storeState);
        });
        SystemNavigationBar.navigationHide();
    }, []);

    return (<></>);
};

/* Old Data compatibility */
function updateOldDate(in_data) {
    let _data = {};

    /* check if old data exists */
    if (in_data.config) {
        for (const key in oldToNewData) {
            if (!oldToNewData[key]) continue;
            if (!in_data.config[key]) continue;

            /* Перезапись массива */
            if (Array.isArray(oldToNewData[key]) &&
                Array.isArray(in_data.config[key])) {
                for (let i = 0; i < oldToNewData[key].length; i++) {
                    if (!oldToNewData[key][i]) continue;
                    if (!in_data.config[key][i]) continue;
                    _data[oldToNewData[key][i]] = in_data.config[key][i];
                }
                continue;
            }

            _data[oldToNewData[key]] = in_data.config[key];
        }
    } else _data = in_data;

    return _data;
}

const oldToNewData = {
    hostname: null,
    hostname_main: "hostname_main",
    hostname_prefix: "hostname_prefix",
    login: "login",
    password: "password",
    /* конфигурация объектов бронирования */
    mapId: null,
    spaceCount: null,
    spaces: ["id"],
    /* конфигурация панели бронирования */
    panel: null,
    panelHost: "qbic_hostname",
    panelLogin: "qbic_login",
    panelPassword: "qbic_password",
    panelId: null
}

export default DataManager;