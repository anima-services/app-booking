import { useState, useEffect } from 'react';
import { StyleSheet, Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import ColumnScreen from '../ColumnScreen';
import SpaceInfo from '../SpaceInfo';
import BackButton from '../BackButton';
import InputField from '../InputField';
import Dropdown from '../Dropdown';
import Button from '../Button';

import { useResponsiveSizes } from '../hooks/useResponsiveSizes';
import { createReservation } from '../services/api';

import { useSelector, useDispatch } from "react-redux";
import { setLogs } from "../data/DataSlice";

const Book = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { timeStart, timeEnd, formatStart, formatEnd } = route.params;
  const users_data = useSelector(state => state.data.users_data);
  const sizes = useResponsiveSizes();

  const [topic, setTopic] = useState("");
  const [meetinghost, setMeetinghost] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [formReady, setFormReady] = useState(false);

  useEffect(() => {
    setFormReady(topic &&
      Array.isArray(meetinghost) && meetinghost.length > 0 &&
      Array.isArray(participants) && participants.length > 0);
  }, [topic, meetinghost, participants]);

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
      navigation.navigate('Results', {
        success: true,
        text: "Вы забронировали переговорную, теперь ваше бронирование отобразится в перечне слотов."
      })
    } catch (e) {
      navigation.navigate('Results', {
        success: false,
        text: "Не удалось забронировать переговорную. Обратитесь к системному администратору."
      })
      if (dispatch) dispatch(setLogs('Ошибка бронирования: ' + e.toString()));
      console.error('Ошибка бронирования:', e);
    }
  }

  return (
    <ColumnScreen
      leftContent={<SpaceInfo />}
      rightContent={<>
        <BackButton />
        <View style={{ marginTop: sizes.topOffset, flex: 1 }}>
          <Text style={[styles.title, { fontSize: sizes.titleSize, marginBottom: sizes.titleSize }]}>Вы бронируете:</Text>
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
          {/* Тема */}
          <View style={styles.rowContainer}>
            <InputField name="Название встречи" placeholder="Название встречи*" inputMode="text"
              value={topic}
              setText={setTopic}
            />
          </View>
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
            maxItems={15}
            onSelect={setParticipants}
          />
          {/* Пинкод */}
          {/* <View style={styles.rowContainer}>
            <InputField name="Пинкод" placeholder="Введите ваш пинкод для подтверждения личности*" inputMode="text" secureTextEntry
              value={null}
              setText={null}
            />
          </View> */}
          <Button title="Забронировать" disabled={!formReady} onPress={sendForm} />
        </View>
      </>}
    />
  );
};

const colorScheme = {
  dark: "#181818",
  light: "#FFFFFF",
  free: "#71EB8C",
  busy: "#FF6567",
  container: "#2F2F2F",
};

const styles = StyleSheet.create({
  title: {
    fontFamily: "Onest_600SemiBold",
    color: colorScheme.light,
  },
  rowContainer: {
    flexDirection: 'row',
    width: '100%',
  },
});

export default Book;