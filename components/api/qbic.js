import { useEffect, useState } from "react";

import { useSelector } from 'react-redux';

const Qbic = (props) => {
    const config = useSelector((state) => state.appData.config);
    const tempData = useSelector((state) => state.tempData);
    const [token, setToken] = useState();
    const [isAuth, setAuth] = useState(false);

    /* Получение токена аутентификации */
    useEffect(() => {
        try {
            if (config.panelHost == null ||
                config.panelLogin == null ||
                config.panelPassword == null ||
                config.panel != "qbic"
            ) return;

            setAuth(false);
            console.log("Аутентификация...");

            fetch(`http://${config.panelHost}:8080/v1/oauth2/token/`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'multipart/form-data',
                },
                body: JSON.stringify({
                    "grant_type": "password",
                    "username": config.panelLogin,
                    "password": config.panelPassword
                })
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Полученные данные:', data);
                    if (data["access_token"] != null && data["token_type"] != null) {
                        setToken(`${data["token_type"]} ${data["access_token"]}`);
                        setAuth(true);
                        let _logText = (new Date).toLocaleString("ru") + " >>> ";
                        _logText += "QBic: Успешно авторизовались!";
                        console.log(_logText);
                        props.setLogs([...props.logs, _logText]);
                    }
                })
                .catch(error => {
                    console.error('Ошибка при выполнении GET-запроса:', error);
                    let _logText = (new Date).toLocaleString("ru") + " >>> ";
                    _logText += 'QBic: ошибка при авторизации ';
                    _logText += error;
                    console.log(_logText);
                    props.setLogs([...props.logs, _logText]);
                });
        } catch (e) {
            let _logText = (new Date).toLocaleString("ru") + " >>> ";
            _logText += 'QBic: ошибка в "Получение токена аутентификации"';
            console.log(_logText);
            props.setLogs([...props.logs, _logText]);
        }
    }, [config.panelHost, config.panelLogin, config.panelPassword]);

    useEffect(() => {
        try {
            if (!isAuth ||
                config.panel != "qbic" ||
                token == null
            ) return;
            let _busy = props.busy;

            fetch(`http://${config.panelHost}:8080/v1/led/front_led`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(_busy.state ? { "red": 100, "green": 0, "blue": 0 } : { "red": 0, "green": 100, "blue": 0 })
            })
                .catch(error => {
                    console.error('Ошибка при выполнении GET-запроса:', error);
                    let _logText = (new Date).toLocaleString("ru") + " >>> ";
                    _logText += 'QBic: ошибка в смене цвета';
                    console.log(_logText);
                    props.setLogs([...props.logs, _logText]);
                });
        } catch (e) {
            let _logText = (new Date).toLocaleString("ru") + " >>> ";
            _logText += 'QBic: ошибка в работе модуля';
            console.log(_logText);
            props.setLogs([...props.logs, _logText]);
        }
    }, [tempData.busy, isAuth]);

    return (<></>);
};

export default Qbic;