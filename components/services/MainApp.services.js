import { useEffect, useRef } from "react";
import axios from 'axios';
import { useDispatch } from "react-redux";
import { setState } from "../data/DataSlice";
import { Store } from '../data/Store';

// Проверка наличия необходимых данных
const checkData = () => {
    const currentData = Store.getState().data;
    if (!currentData.hostname || !currentData.login || !currentData.password)
        return { success: false, error: "hostname, login или password не установлены!" };
    if (!currentData.id)
        return { success: false, error: "id не установлен!" };
    return { success: true };
};

// Получение токена
const getToken = async (dispatch) => {
    const currentData = Store.getState().data;
    try {
        const response = await axios.post(
            `${currentData.hostname}/api/user/login/`,
            { email: currentData.login, password: currentData.password },
            { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } }
        );
        if (response.data.token) {
            dispatch(setState({ token: response.data.token }));
            return response.data.token;
        } else {
            console.log('Не удалось авторизоваться');
            return null;
        }
    } catch (error) {
        let errorMsg = 'Ошибка авторизации: ';
        if (error.response) {
            errorMsg += `Ответ сервера: ${error.response.status} ${error.response.statusText}`;
            if (error.response.data && typeof error.response.data === 'object') {
                errorMsg += ` | ${JSON.stringify(error.response.data)}`;
            }
        } else if (error.request) {
            errorMsg += 'Нет ответа от сервера (network error)';
        } else {
            errorMsg += error.message;
        }
        errorMsg += ` | Axios: ${error.toString()}`;
        console.error(errorMsg);
        return null;
    }
};

// Получение всех данных
const getData = async (token, dispatch) => {
    const currentData = Store.getState().data;
    try {
        const api = axios.create({
            baseURL: currentData.hostname,
            timeout: 5000,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
            },
        });

        // Space
        const spaceResponse = await api.get(`/api/space/${currentData.id}/`);
        if (spaceResponse.data.id != null) {
            dispatch(setState({ space_data: spaceResponse.data }));
        }

        // Space size
        if (spaceResponse.data.size && Number.isFinite(spaceResponse.data.size)) {
            const spaceSize = await api.get(`/api/space/space_size/${spaceResponse.data.size}/`);
            if (spaceSize.data.name != null) {
                dispatch(setState({ space_size: spaceSize.data.name }));
            }
        }

        // Users
        const usersResponse = await api.get(`/api/user/?limit=255`);
        if (usersResponse.data.results != null) {
            dispatch(setState({ users_data: usersResponse.data.results }));
        }

        // Events
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);

        const eventsParams = `space=${currentData.id}&start_after=${now.toISOString()}&end_before=${tomorrow.toISOString()}`;
        const eventsResponse = await api.get(`/api/reservation/?${eventsParams}`);
        if (eventsResponse.data.results != null) {
            dispatch(setState({ events_data: eventsResponse.data.results }));
        }

        // Last update
        dispatch(setState({ last_update: (new Date()).toISOString() }));
    } catch (error) {
        let errorMsg = 'Ошибка при получении данных: ';
        if (error.response) {
            errorMsg += `Ответ сервера: ${error.response.status} ${error.response.statusText}`;
            if (error.response.data && typeof error.response.data === 'object') {
                errorMsg += ` | ${JSON.stringify(error.response.data)}`;
            }
        } else if (error.request) {
            errorMsg += 'Нет ответа от сервера (network error)';
        } else {
            errorMsg += error.message;
        }
        errorMsg += ` | Axios: ${error.toString()}`;
        console.error(errorMsg);
    }
};

const REFRESH_INTERVAL = 1000; // ms

const MainApp = () => {
    const dispatch = useDispatch();
    const isMountedRef = useRef(true);

    // Всегда используем актуальные данные из Store
    const fetchData = async () => {
        if (!isMountedRef.current) return;
        const checkResult = checkData();
        if (!checkResult.success) {
            console.error(checkResult.error);
            return;
        }

        const currentData = Store.getState().data;
        let token = currentData.token;
        if (!token || typeof token !== 'string' || token.length === 0) {
            token = await getToken(dispatch);
            if (!token) {
                return;
            }
        }

        await getData(token, dispatch);
    };

    useEffect(() => {
        isMountedRef.current = true;
        fetchData(); // первый вызов сразу
        const interval = setInterval(() => {
            fetchData();
        }, REFRESH_INTERVAL);
        return () => {
            isMountedRef.current = false;
            clearInterval(interval);
        };
    }, [dispatch]);

    return null;
};

export default MainApp;