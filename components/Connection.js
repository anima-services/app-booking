import {
  useEffect,
  useState
} from "react";
import {
  Styles
} from '../utils/styles';

import {
  useSelector,
  useDispatch
} from 'react-redux';
import {
  updateData,
  updateConfig
} from '../data/appDataSlice';
import {
  setLogs
} from '../data/tempDataSlice';

const Connection = (props) => {
  const config = useSelector((state) => state.appData.config);
  const dispatch = useDispatch();

  const [token,
    setToken] = useState();
  const [isAuth,
    setAuth] = useState(false);
    const [authTime, setAuthTime] = useState(0);

  const [inProcess,
    setProcess] = useState(false);
  const [cycleTime,
    setCycleTime] = useState(0);

  function LogData(in_text) {
    let _logText = (new Date).toLocaleString("ru") + " >>> ";
    _logText += `Connection: ${in_text}`;
    console.log(_logText);
    dispatch(setLogs(_logText));
  }

  function ResetCycle() {
    setCycleTime(0);
  }

  useEffect(() => {
    if (props.update == null || props.update.text == null) return;
    LogData(props.update.text);
    if (props.update.error) LogData(props.update.error)
    props.setNotification(props.update);
    ResetCycle();
  },
    [props.update]);

  /* Цикличное обновление */
  useEffect(() => {
    if (inProcess) return;
    
    let nowTime = Math.floor((new Date()).getTime() / 1000);

    let _authPeriod = 60 * 15;

    if (!isAuth || token == null ||
    (nowTime - authTime) > _authPeriod) {
      getToken();
      setAuthTime(nowTime);
      return;
    }

    if ((nowTime - cycleTime) < 30) return;
    setCycleTime(nowTime);

    cycleUpdate();

  },
    [props.date]);

  async function cycleUpdate() {
    setProcess(true);

    await getUsers();
    if (config.mapId) await getMap(config.mapId);

    for (let i = 0; i < config.spaces.length; i++) {
      await getObjectData(config.spaces[i]);
      await getMeetings(config.spaces[i]);
    }

    setProcess(false);
  }

  /* Получение токена аутентификации */
  async function getToken() {
    if (config.hostname == null ||
      config.login == null ||
      config.password == null
    ) return;

    setProcess(true);

    try {
      let response = await fetch(`${config.hostname}/api/user/login/`, {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "email": config.login,
          "password": config.password
        })
      });
      let responseData = await response.json();

      if (responseData["token"] != null) {
        setToken(responseData["token"]);
        setAuth(true);
        dispatch(updateData( {
          token: responseData["token"]
        }));
        LogData('Успешно авторизовались!');
      } else LogData('Не удалось авторизоваться');
    } catch (e) {
      LogData('ошибка в "Получение токена аутентификации" - ' + e + " " + config.hostname);
    }
    setProcess(false);
  }

  async function getObjectData(in_id) {
    if (config.hostname == null ||
      in_id == null
    ) return;

    try {
      let response = await fetch(`${config.hostname}/api/space/${in_id}/`, {
        method: 'GET',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        }
      });
      let responseData = await response.json();

      if (responseData["id"] != null) {
        dispatch(updateData( {
          [`space_${in_id}`]: responseData
        }));
        LogData('Получены данные о space ' + in_id);
      } else LogData('Не найдены данные о space ' + in_id);
    } catch (e) {
      LogData('ошибка в "Получение информации об объекте" - ' + e);
    }
  }

  async function getMeetings(in_id) {
    if (config.hostname == null ||
      in_id == null
    ) return;

    try {
      var currentDate = new Date();
      currentDate.setHours(0); currentDate.setMinutes(0); currentDate.setSeconds(0);

      let tomorrowDate = new Date();
      tomorrowDate.setDate(tomorrowDate.getDate() + 1);
      tomorrowDate.setHours(0); tomorrowDate.setMinutes(0); tomorrowDate.setSeconds(0);

      var params = {
        space: in_id,
        start_after: currentDate.toISOString(),
        end_before: tomorrowDate.toISOString()
      };

      var queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');

      let response = await fetch(`${config.hostname}/api/reservation/?${queryString}`, {
        method: 'GET',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        }
      });

      let responseData = await response.json();

      if (responseData["results"] != null) {
        dispatch(updateData( {
          [`reservations_${in_id}`]: responseData["results"]
        }));
        LogData('Получены события space ' + in_id);
      } else LogData('Не найдены события space ' + in_id);

    } catch (e) {
      LogData('ошибка в "Получение событий объекта" - ' + e);
    }
  }

  async function getMap(in_id) {
    if (config.hostname == null ||
      in_id == null
    ) return;

    try {
      let currentDate = new Date();
      let diff = 0.25;
      let tomorrowDate = new Date(currentDate.getTime() + diff * 60000);

      var params = {
        is_reserved_start_time: currentDate.toISOString(),
        is_reserved_end_time: tomorrowDate.toISOString()
      };

      var queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');

      let response = await fetch(`${config.hostname}/api/map/${in_id}/?${queryString}`, {
        method: 'GET',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        }
      });

      let responseData = await response.json();

      if (responseData != null) {
        dispatch(updateData( {
          mapData: responseData
        }));
        if (Array.isArray(responseData.map_objects)) {
          let array = [];
          for (let i = 0; i < responseData.map_objects.length; i++) {
            if (responseData.map_objects[i].space_link_info == null ||
              responseData.map_objects[i].space_link_info.id == null
            ) continue;
            array.push(responseData.map_objects[i].space_link_info.id);
          }
          dispatch(updateConfig( {
            spaceCount: responseData.map_objects.length,
            spaces: array
          }));
        }
        LogData('Получены данные объекта карты ' + in_id);
      } else LogData('Не найдены данные объекта карты ' + in_id);

    } catch (e) {
      LogData('ошибка в "Получение объекта карты" - ' + e);
    }
  }

  async function getUsers() {
    if (config.hostname == null
    ) return;

    try {
      var params = {
        limit: 255
      };

      var queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');

      let response = await fetch(`${config.hostname}/api/user/?${queryString}`, {
        method: 'GET',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        }
      });

      let responseData = await response.json();
      if (responseData["results"] != null) {
        dispatch(updateData( {
          usersData: responseData["results"]
        }));
        LogData('Получен список пользователей');
      }
    }
    catch (e) {
      LogData('ошибка в "Получение cписка пользователей" - ' + e);
    }
  }

  return (<></>);
};

export async function reservationCreate(in_hostname, in_token, in_id, in_start, in_end, in_user, in_topic, in_participants, in_update) {
  if (in_token == null || in_hostname == null || in_id == null ||
    in_start == null || in_end == null || in_user == null || in_topic == null ||
    !Array.isArray(in_participants)
  ) return;

  try {
    let response = await fetch(`${in_hostname}/api/reservation/extend_admin/`, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
        'Authorization': `Token ${in_token}`
      },
      body: JSON.stringify({
        "user": in_user,
        "topic": in_topic,
        "space": in_id,
        "start": in_start,
        "end": in_end,
        "participants": in_participants,
      })
    });
    let responseData = await response.json();

    if (response.status > 299) {
      in_update({
        text: 'Не удалось создать бронирование', 
        error: `ошибка в бронировании- ${JSON.stringify(responseData)}`,
        color: Styles.main.busy.borderColor
      });
    } else {
      in_update({
        text: 'Бронирование успешно создано!', color: Styles.main.free.borderColor
      });
    }

  } catch (e) {
    //in_update({ text: 'Не удалось создать бронирование', color: Styles.main.busy.borderColor });
  }
};

export async function reservationApprove(in_hostname, in_token, in_id, in_reserveToken, in_email, in_update) {
  if (in_token == null || in_id == null ||
    in_reserveToken == null || in_email == null
  ) return;

  try {
    let response = await fetch(`${in_hostname}/api/reservation/${in_id}/approve/`, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
        'Authorization': `Token ${in_token}`
      },
      body: JSON.stringify({
        "reserve_token": `${in_reserveToken}`,
        "email": in_email,
      })
    });
    let responseData = await response.json();

    if (response.status > 299) {
      in_update({
        text: 'Не удалось подтвердить бронирование', color: Styles.main.busy.borderColor,
        error: `ошибка в подтверждении- ${JSON.stringify(responseData)}`
      });
    } else {
      in_update({
        text: 'Бронирование успешно подтверждено!', color: Styles.main.free.borderColor
      });
    }

  } catch (e) {
    //in_update({ text: 'Не удалось подтвердить бронирование', color: Styles.main.busy.borderColor });
  }
}

export default Connection;