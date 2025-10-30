import { useState, useEffect } from 'react';
import { StyleSheet, Pressable, Text, View } from 'react-native';

import ColumnScreen from '../ColumnScreen';
import SpaceInfo from '../SpaceInfo';
import BackButton from '../BackButton';
import InputField from '../InputField';
import Dropdown from '../Dropdown';
import Button from '../Button';

import { useResponsiveSizes } from '../hooks/useResponsiveSizes';
import { useTheme } from '../ThemeContext';
import { createReservation, getReservations } from '../services/api';

import { useSelector, useDispatch } from "react-redux";
import { setLogs } from "../data/DataSlice";

function BookView({
  resetToHome,
  users_data,
  formatStart,
  formatEnd,
  topic,
  setTopic,
  setMeetinghost,
  setParticipants,
  formReady,
  sendForm,
}) {
  const sizes = useResponsiveSizes();
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    title: {
      fontFamily: "Onest_600SemiBold",
      color: theme.light,
    },
    rowContainer: {
      flexDirection: 'row',
      width: '100%',
    },
  });

  return (
    <>
      <BackButton goBack={resetToHome} />
      <View style={{ marginTop: sizes.topOffset, flex: 1 }}>
        <Text style={[styles.title, { fontSize: sizes.titleSize, marginBottom: sizes.titleSize }]}>Вы бронируете:</Text>
        <Dropdown
          name="Организатор"
          data={users_data}
          placeholder="Введите ФИО или почту"
          pictureTag="photo"
          textTag="full_name"
          attributeTag="email"
          onSelect={setMeetinghost}
        />
        <Dropdown
          name="Участники"
          data={users_data}
          placeholder="Введите ФИО или почту"
          pictureTag="photo"
          textTag="full_name"
          attributeTag="email"
          maxItems={1000}
          onSelect={setParticipants}
        />
        {/* Тема */}
        <View style={styles.rowContainer}>
          <InputField name="Название встречи" placeholder="Название встречи*" inputMode="text"
            value={topic}
            setText={setTopic}
          />
        </View>
        {/* Начало и окончание */}
        <View style={styles.rowContainer}>
          <InputField name="Начало" placeholder="00:00" inputMode="text"
            value={formatStart} disabled={true}
          />
          <View style={{ width: sizes.hotizontalGapSize }} />
          <InputField name="Окончание" placeholder="00:00" inputMode="text"
            value={formatEnd} disabled={true}
          />
        </View>
        {/* Пинкод */}
        {/* <View style={styles.rowContainer}>
          <InputField name="Пинкод" placeholder="Введите ваш пинкод для подтверждения личности*" inputMode="text" secureTextEntry
            value={null}
            setText={null}
          />
        </View> */}
        <Button title="Забронировать" disabled={!formReady} onPress={sendForm} />
      </View>
    </>
  );
}

const Book = ({ navigate, goBack, resetToHome, params }) => {
  const dispatch = useDispatch();

  const { timeStart, timeEnd, formatStart, formatEnd } = params;
  const users_data = useSelector(state => state.data.users_data);
  const sizes = useResponsiveSizes();
  const { theme, toggleTheme } = useTheme();

  const [topic, setTopic] = useState("");
  const [meetinghost, setMeetinghost] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [formReady, setFormReady] = useState(false);

  console.log("draw");

  const styles = StyleSheet.create({
    title: {
      fontFamily: "Onest_600SemiBold",
      color: theme.light,
    },
    rowContainer: {
      flexDirection: 'row',
      width: '100%',
    },
  });

  useEffect(() => {
    setFormReady(topic &&
      Array.isArray(meetinghost) && meetinghost.length > 0 &&
      Array.isArray(participants) && participants.length > 0);
  }, [topic, meetinghost, participants]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      resetToHome();
    }, 1000 * 60 * 5);

    return () => clearTimeout(timerId);
  }, []);

  async function sendForm() {
    try {
      setFormReady(false);
      const response = await createReservation(
        meetinghost.map(item => item.id)[0],
        participants.map(item => item.id),
        topic,
        timeStart,
        timeEnd
      );
      console.log(response);
      await getReservations(dispatch);
      navigate('Results', {
        success: true,
        text: "Вы забронировали переговорную, теперь ваше бронирование отобразится в перечне слотов."
      })
    } catch (e) {
      navigate('Results', {
        success: false,
        text: "Не удалось забронировать переговорную. Обратитесь к системному администратору."
      })
      if (dispatch) dispatch(setLogs('Ошибка бронирования: ' + e.toString()));
      console.error('Ошибка бронирования:', e);
    }
  }

  return (
    <ColumnScreen
      leftContent={<SpaceInfo navigate={navigate} />}
      rightContent={
        <BookView
          resetToHome={resetToHome}
          users_data={users_data}
          formatStart={formatStart}
          formatEnd={formatEnd}
          topic={topic}
          setTopic={setTopic}
          setMeetinghost={setMeetinghost}
          setParticipants={setParticipants}
          formReady={formReady}
          sendForm={sendForm}
        />
      }
      pages={[
        <BookView
          resetToHome={resetToHome}
          users_data={users_data}
          formatStart={formatStart}
          formatEnd={formatEnd}
          topic={topic}
          setTopic={setTopic}
          setMeetinghost={setMeetinghost}
          setParticipants={setParticipants}
          formReady={formReady}
          sendForm={sendForm}
        />
      ]}
    />
  );
};

export default Book;