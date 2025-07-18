import {
  useEffect,
  useState
} from "react";

import {
  useSelector,
  useDispatch
} from 'react-redux';
import {
  setLogs
} from '../../data (old)/tempDataSlice';

const Qbic = (props) => {
  const dispatch = useDispatch();
  const config = useSelector((state) => state.appData.config);
  const tempData = useSelector((state) => state.tempData);
  const [token,
    setToken] = useState();
  const [isAuth,
    setAuth] = useState(false);
    const [authTime, setAuthTime] = useState(0);


  /* Получение токена аутентификации */
  useEffect(() => {
    try {
      if (config.panelHost == null ||
        config.panelLogin == null ||
        config.panelPassword == null ||
        config.panel != "qbic"
      ) return;

      let nowTime = Math.floor((new Date()).getTime() / 1000);

    let _authPeriod = 60 * 15;
    
    if ((nowTime - authTime) > _authPeriod) {
      setAuthTime(nowTime);
    } else return;

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
          dispatch(setLogs(_logText));
        }
      })
      .catch(error => {
        console.error('Ошибка при выполнении GET-запроса:', error);
        let _logText = (new Date).toLocaleString("ru") + " >>> ";
        _logText += 'QBic: ошибка при авторизации ';
        _logText += error;
        console.log(_logText);
        dispatch(setLogs(_logText));
        setAuthTime(0);
      });
    } catch (e) {
      setAuthTime(0);
      let _logText = (new Date).toLocaleString("ru") + " >>> ";
      _logText += 'QBic: ошибка в "Получение токена аутентификации"';
      console.log(_logText);
      dispatch(setLogs(_logText));
    }
  }, [config.panelHost, config.panelLogin, config.panelPassword, isAuth, props.date]);

  useEffect(() => {
    try {
      if (!isAuth ||
        config.panel != "qbic" ||
        token == null
      ) return;

      fetch(`http://${config.panelHost}:8080/v1/led/front_led`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(tempData.data.busy ? {
          "red": 100, "green": 0, "blue": 0
        }: {
          "red": 0, "green": 100, "blue": 0
        })
      })
      .catch(error => {
        console.error('Ошибка при выполнении GET-запроса:', error);
        let _logText = (new Date).toLocaleString("ru") + " >>> ";
        _logText += 'QBic: ошибка в смене цвета';
        console.log(_logText);
        dispatch(setLogs(_logText));
      })
      .then(response => console.log(response.status) || response)
  .then(response => response.text())
  .then(body => {
    let _logText = (new Date).toLocaleString("ru") + " >>> ";
      _logText += 'QBic:' + JSON.stringify(body);
      console.log(_logText);
      dispatch(setLogs(_logText));
    console.log(body)
    
  });
    } catch (e) {
      let _logText = (new Date).toLocaleString("ru") + " >>> ";
      _logText += 'QBic: ошибка в работе модуля';
      console.log(_logText);
      dispatch(setLogs(_logText));
    }
  },
    [tempData.data.busy,
      isAuth]);

  return (<></>);
};

export default Qbic;