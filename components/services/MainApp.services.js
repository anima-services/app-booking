import { useEffect, useRef } from "react";
import axios from 'axios';
import { useDispatch } from "react-redux";
import { setState, setLogs } from "../data/DataSlice";
import { Store } from '../data/Store';

// Проверка наличия и корректности данных
const validateConfiguration = (data) => {
    if (!data.hostname || !data.login || !data.password) {
        return { valid: false, error: `hostname, login или password не установлены!` };
    }
    
    if (!data.id) {
        return { valid: false, error: "id не установлен!" };
    }
    
    // Проверка формата URL
    try {
        new URL(data.hostname);
    } catch (error) {
        return { valid: false, error: "Некорректный формат hostname! Должен содержать протокол (http/https)" };
    }
    
    return { valid: true };
};

// Обработка сетевых ошибок
const handleRequestError = (error, context, dispatch) => {
    let errorMessage = `Ошибка ${context}: `;
    
    if (axios.isCancel(error)) {
        console.log(`Запрос ${context} отменен`);
        return;
    }

    if (error.response) {
        errorMessage += `Статус: ${error.response.status} ${error.response.statusText}`;
        if (error.response.data) {
            errorMessage += ` | Данные: ${JSON.stringify(error.response.data)}`;
        }
    } else if (error.code === 'ECONNABORTED') {
        errorMessage += `Таймаут соединения (${error.config?.timeout || 15000}мс)`;
    } else if (error.request) {
        errorMessage += 'Сервер не ответил';
    } else {
        errorMessage += error.message;
    }

    console.error(`[${context}] ${errorMessage}`, error);
    dispatch(setLogs(errorMessage));
};

// Получение токена аутентификации
const fetchAuthToken = async (config, dispatch, signal) => {
    const url = `${config.hostname}/api/user/login/`;
    dispatch(setLogs(`Получение токена от ${config.hostname}`));
    
    try {
        const response = await axios.post(
            url,
            { email: config.login, password: config.password },
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                timeout: 15000,
                signal
            }
        );

        if (!response.data?.token) {
            const errorMsg = 'Сервер не вернул токен авторизации';
            dispatch(setLogs(errorMsg));
            return null;
        }

        dispatch(setState({ token: response.data.token }));
        dispatch(setLogs(`Токен получен!`));
        return response.data.token;
    } catch (error) {
        handleRequestError(error, 'авторизации', dispatch);
        return null;
    }
};

// Запрос основной информации (редкие обновления)
const fetchCoreData = async (config, token, dispatch, signal) => {
    const apiClient = axios.create({
        baseURL: config.hostname,
        timeout: 15000,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
    });
    dispatch(setLogs(`Получение основных данных от ${config.hostname}`));

    try {
        // Запрос информации о пространстве
        const spaceResponse = await apiClient.get(
            `/api/space/${config.id}/`,
            { signal }
        );
        
        if (spaceResponse.data.id != null) {
            dispatch(setState({ space_data: spaceResponse.data }));
            dispatch(setLogs(`Информация о пространстве получена!`));
        }

        // Запрос размера пространства
        if (spaceResponse.data.size && Number.isFinite(spaceResponse.data.size)) {
            const sizeResponse = await apiClient.get(
                `/api/space/space_size/${spaceResponse.data.size}/`,
                { signal }
            );
            
            if (sizeResponse.data.name != null) {
                dispatch(setState({ space_size: sizeResponse.data.name }));
                dispatch(setLogs(`Размеры пространства получены!`));
            }
        }

        // Запрос пользователей
        const usersResponse = await apiClient.get(
            '/api/user/?limit=255',
            { signal }
        );
        
        if (usersResponse.data.results != null) {
            dispatch(setState({ users_data: usersResponse.data.results }));
            dispatch(setLogs(`Пользователи получены!`));
        }
    } catch (error) {
        handleRequestError(error, 'получения основных данных', dispatch);
        dispatch(setState({ token: "" }));
    }
};

// Запрос событий (частые обновления)
const fetchEventsData = async (config, token, dispatch, signal) => {
    const apiClient = axios.create({
        baseURL: config.hostname,
        timeout: 15000,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
    });
    dispatch(setLogs(`Получение событий от ${config.hostname}`));

    try {
        // Запрос событий
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);

        const eventsParams = new URLSearchParams({
            space: config.id,
            start_after: now.toISOString(),
            end_before: tomorrow.toISOString()
        });

        const eventsResponse = await apiClient.get(
            `/api/reservation/?${eventsParams}`,
            { signal }
        );
        
        if (eventsResponse.data.results != null) {
            const filteredEvents = eventsResponse.data.results
                .filter(item => item.status && 
                      !["canceled", "automatically_canceled"].includes(item.status))
                .sort((a, b) => new Date(a.start) - new Date(b.start));

            dispatch(setState({ events_data: filteredEvents }));
            dispatch(setLogs(`События получены!`));
        }

        // Обновление времени последнего обновления
        dispatch(setState({ last_update: new Date().toISOString() }));
    } catch (error) {
        handleRequestError(error, 'получения событий', dispatch);
        dispatch(setState({ token: "" }));
    }
};

// Интервалы обновления
const CORE_DATA_REFRESH_INTERVAL = 5 * 60 * 1000; 
const EVENTS_REFRESH_INTERVAL = 60 * 1000; 

const MainApp = () => {
    const dispatch = useDispatch();
    const isMountedRef = useRef(true);
    const activeControllerRef = useRef(null);
    const lastCoreUpdateRef = useRef(0);

    // Запрос основных данных (редкие)
    const fetchCore = useRef(async (signal) => {
        if (!isMountedRef.current) return;

        const config = Store.getState().data;
        const validation = validateConfiguration(config);
        if (!validation.valid) {
            dispatch(setLogs(validation.error));
            return;
        }

        let token = config.token;
        if (!token || typeof token !== 'string' || token.length === 0) {
            token = await fetchAuthToken(config, dispatch, signal);
            if (!token) return;
        }

        await fetchCoreData(config, token, dispatch, signal);
        lastCoreUpdateRef.current = Date.now();
    });

    // Запрос событий (частые)
    const fetchEvents = useRef(async (signal) => {
        if (!isMountedRef.current) return;

        const config = Store.getState().data;
        const validation = validateConfiguration(config);
        if (!validation.valid) {
            dispatch(setLogs(validation.error));
            return;
        }

        let token = config.token;
        if (!token || typeof token !== 'string' || token.length === 0) {
            token = await fetchAuthToken(config, dispatch, signal);
            if (!token) return;
        }

        await fetchEventsData(config, token, dispatch, signal);
    });

    // Комбинированный запрос (основные данные + события)
    const fetchData = useRef(async () => {
        if (!isMountedRef.current) return;

        // Отменяем предыдущий запрос
        if (activeControllerRef.current) {
            activeControllerRef.current.abort();
        }
        
        // Создаем новый контроллер
        const controller = new AbortController();
        activeControllerRef.current = controller;

        try {
            // Проверяем, нужно ли обновлять основные данные
            const needsCoreUpdate = Date.now() - lastCoreUpdateRef.current > CORE_DATA_REFRESH_INTERVAL;
            
            if (needsCoreUpdate) {
                await fetchCore.current(controller.signal);
            }
            
            // Всегда обновляем события
            await fetchEvents.current(controller.signal);
        } catch (error) {
            // Ошибки обрабатываются внутри функций
        } finally {
            if (activeControllerRef.current === controller) {
                activeControllerRef.current = null;
            }
        }
    });

    useEffect(() => {
        isMountedRef.current = true;
        activeControllerRef.current = null;
        lastCoreUpdateRef.current = 0; // Сброс времени последнего обновления

        // Первоначальный запрос (полный)
        fetchData.current();

        // Интервал для частого обновления событий
        const intervalId = setInterval(() => {
            fetchData.current();
        }, EVENTS_REFRESH_INTERVAL);

        return () => {
            isMountedRef.current = false;
            clearInterval(intervalId);
            
            if (activeControllerRef.current) {
                activeControllerRef.current.abort();
                activeControllerRef.current = null;
            }
        };
    }, [dispatch]);

    return null;
};

export default MainApp;