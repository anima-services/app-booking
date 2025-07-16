import React, { useEffect } from "react";
import axios from 'axios';
import { Store } from '../data/Store';
import { setLogs } from '../data/DataSlice';
import { useDispatch } from "react-redux";

// Время жизни токена (секунд)
const AUTH_PERIOD = 60 * 15;
let cachedToken = null;
let lastAuthTime = 0;

const QBicHandler = ({ isBusy = false }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        setQbicLedColor(isBusy, dispatch);
    }, [isBusy]);

    return (<></>);
}

// Получение токена QBic
export const getQbicToken = async () => {
    const data = Store.getState().data;
    const nowTime = Math.floor(Date.now() / 1000);
    if (
        cachedToken &&
        (nowTime - lastAuthTime) < AUTH_PERIOD
    ) {
        return cachedToken;
    }
    if (!data.qbic_hostname || !data.qbic_login || !data.qbic_password) {
        return null;
    }
    try {
        const response = await axios.post(
            `http://${data.qbic_hostname}:8080/v1/oauth2/token/`,
            {
                grant_type: 'password',
                username: data.qbic_login,
                password: data.qbic_password
            },
            {
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                }
            }
        );
        if (response.data.access_token && response.data.token_type) {
            cachedToken = `${response.data.token_type} ${response.data.access_token}`;
            lastAuthTime = nowTime;
            const logText = `QBic: Успешно авторизовались!`;
            if (dispatch) dispatch(setLogs(logText));
            return cachedToken;
        } else {
            const logText = `QBic: ошибка авторизации (нет токена)`;
            if (dispatch) dispatch(setLogs(logText));
            return null;
        }
    } catch (error) {
        const logText = `QBic: ошибка при авторизации: ${error}`;
        if (dispatch) dispatch(setLogs(logText));
        lastAuthTime = 0;
        cachedToken = null;
        return null;
    }
};

// Управление цветом подсветки QBic
export const setQbicLedColor = async (busy, dispatch) => {
    const data = Store.getState().data;
    const token = await getQbicToken(dispatch);
    if (!token || data.panel !== 'qbic') return;
    try {
        const color = busy ? { red: 100, green: 0, blue: 0 } : { red: 0, green: 100, blue: 0 };
        const response = await axios.post(
            `http://${data.panelHost}:8080/v1/led/front_led`,
            color,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            }
        );
        const logText = `QBic: смена цвета (${busy ? 'красный' : 'зелёный'}), статус: ${response.status}`;
        if (dispatch) dispatch(setLogs(logText));
        return response.data;
    } catch (error) {
        const logText = `QBic: ошибка в смене цвета: ${error}`;
        if (dispatch) dispatch(setLogs(logText));
        return null;
    }
};

export default QBicHandler;
