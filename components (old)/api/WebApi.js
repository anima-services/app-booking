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

const WebApi = (props) => {
  const dispatch = useDispatch();
  const config = useSelector((state) => state.appData.config);
  const tempData = useSelector((state) => state.tempData);
  const [isAuth,
    setAuth] = useState(false);

  /* Получение токена аутентификации */
  useEffect(() => {
    try {
      if (config.panelHost == null ||
        config.panelLogin == null ||
        config.panelPassword == null ||
        config.panelId == null ||
        config.panel != "webapi"
      ) return;

      setAuth(true);

      let _logText = (new Date).toLocaleString("ru") + " >>> ";
      _logText += 'WebApi: успешно авторизовались';
      console.log(_logText);
      dispatch(setLogs(_logText));

    } catch (e) {
      let _logText = (new Date).toLocaleString("ru") + " >>> ";
      _logText += 'WebApi: ошибка при аутентификации';
      console.log(_logText);
      dispatch(setLogs(_logText));
    }
  },
    [config.panelHost,
      config.panelLogin,
      config.panelPassword]);

  useEffect(() => {
    try {
      if (!isAuth ||
        config.panelHost == null ||
        config.panelId == null ||
        config.panel != "webapi"
      ) return;
      let _busy = props.busy;

      console.log(123);

      fetch(`http://${config.panelHost}:4000/api/drivers/${config.panelId}/cmd=setBusy&val=${Number(_busy.state)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        console.log('Полученные данные:', data);
        let _logText = (new Date).toLocaleString("ru") + " >>> ";
        _logText += `WebApi: ${data}`;
        console.log(_logText);
        dispatch(setLogs(_logText));
      })
      .catch(error => {
        console.error('Ошибка при выполнении GET-запроса:', error);
        let _logText = (new Date).toLocaleString("ru") + " >>> ";
        _logText += 'WebApi: ошибка в смене цвета';
        console.log(_logText);
        dispatch(setLogs(_logText));
      });
    } catch (e) {
      let _logText = (new Date).toLocaleString("ru") + " >>> ";
      _logText += 'WebApi: ошибка в работе модуля';
      console.log(_logText);
      dispatch(setLogs(_logText));
    }
  },
    [tempData.busy,
      isAuth]);

  return (<></>);
};

export default WebApi;