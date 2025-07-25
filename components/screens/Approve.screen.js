import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import ColumnScreen from '../ColumnScreen';
import SpaceInfo from '../SpaceInfo';
import BackButton from '../BackButton';
import InputField from '../InputField';
import Dropdown from '../Dropdown';
import Button from '../Button';

import { useResponsiveSizes } from '../hooks/useResponsiveSizes';
import { approveReservation } from '../services/api';

import { setLogs } from '../data/DataSlice';
import { useDispatch } from "react-redux";

const Approve = ({ navigate, goBack, resetToHome, params }) => {
  const dispatch = useDispatch();

  const { eventId, formatStart, formatEnd, topic, meetinghost, meetinghostname, participants } = params;

  const sizes = useResponsiveSizes();

  const [approvePerson, setApprovePerson] = useState([]);
  const [pincode, setPincode] = useState("");
  const [formReady, setFormReady] = useState(false);

  useEffect(() => {
    setFormReady(pincode &&
      Array.isArray(approvePerson) && approvePerson.length > 0);
  }, [pincode, approvePerson]);

  async function sendForm() {
    try {
      setFormReady(false);
      const response = await approveReservation(
        eventId, approvePerson[0].email, pincode
      );
      navigate('Results', {
        success: true,
        text: "Вы успешно подтвердили бронирование"
      })
    } catch (e) {
      navigate('Results', {
        success: false,
        text: "Не удалось подтвердить бронирование. Обратитесь к системному администратору."
      })
      if (dispatch) dispatch(setLogs('Ошибка подтверждения: ' + e.toString()));
      console.error('Ошибка подтверждения:', e);
    }
  }

  return (
    <ColumnScreen
      leftContent={<SpaceInfo navigate={navigate}/>}
      rightContent={<>
        <BackButton goBack={goBack}/>
        <View style={{ marginTop: sizes.topOffset, flex: 1 }}>
          <Text style={[styles.title, {
            fontSize: sizes.titleSize,
            marginBottom: sizes.titleSize
          }]}>Подтверждение:</Text>
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
            <InputField name="Название встречи" placeholder="Название встречи" inputMode="text"
              value={topic} disabled={true}
            />
            <View style={{ width: sizes.hotizontalGapSize }} />
            <InputField name="Организатор" placeholder="Организатор" inputMode="text"
              value={meetinghostname} disabled={true}
            />
          </View>
          <Dropdown
            name="Участники"
            data={[...meetinghost, ...participants]}
            placeholder="Введите ФИО или почту"
            pictureTag="photo"
            textTag="full_name"
            attributeTag="email"
            maxItems={1}
            onSelect={setApprovePerson}
          />
          {/* Пинкод */}
          <View style={styles.rowContainer}>
            <InputField name="Пинкод" placeholder="Введите ваш пинкод для подтверждения личности*" inputMode="text" secureTextEntry
              value={pincode}
              setText={setPincode}
            />
          </View>
          <Button title="Подтвердить бронирование" disabled={!formReady} onPress={sendForm} />
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

export default Approve;