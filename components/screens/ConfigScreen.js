import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';

import ColumnScreen from '../ColumnScreen';
import SpaceInfo from '../SpaceInfo';
import BackButton from '../BackButton';
import InputField from '../InputField';
import Button from "../Button";

import { useSelector, useDispatch } from "react-redux";
import { setState, setLogs } from "../data/DataSlice";

const ConfigScreen = ({ navigation }) => {
  const data = useSelector(state => state.data);
  const dispatch = useDispatch();

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const topOffset = screenHeight * .2;
  const titleSize = screenHeight * .045;
  const gapSize = screenHeight * .01;

  const colorScheme = {
    dark: "#181818",
    light: "#FFFFFF",
    free: "#71EB8C",
    busy: "#FF6567",
    container: "#2F2F2F",
  };

  const [formData, setFormData] = useState({
    hostname: "",
    hostname_main: "",
    hostname_prefix: "",
    id: "",
    login: "",
    password: "",
    qbic_hostname: "",
    qbic_login: "",
    qbic_password: "",
  });

  const handleLoad = () => {
    let newFormData = {};
    for (var key in formData) {
      newFormData = { ...newFormData, [`${key}`]: data[key] ?? "" };
    }
    setFormData(newFormData);
    if (dispatch) dispatch(setLogs("Config: Данные загружены!"));
  };

  const handleSave = () => {
    dispatch(setState(formData));
    if (dispatch) dispatch(setLogs("Config: Данные сохранены!"));
  };

  useEffect(() => {
    handleLoad();
  }, []);

  return (
    <ColumnScreen
      leftContent={<SpaceInfo />}
      rightContent={
        <>
          <BackButton />
          <View style={{ marginTop: topOffset, flex: 1 }}>
            <Text style={[styles.title, { color: colorScheme.light, fontSize: titleSize, marginBottom: titleSize }]}>Конфигурация:</Text>
            <ScrollView>
              {/* ANIMA API */}
              <View style={styles.rowContainer}>
                <InputField name="Префикс хоста" placeholder="https://" inputMode="text"
                  value={formData.hostname_prefix}
                  setText={value => setFormData({
                    ...formData,
                    hostname_prefix: value,
                    hostname: value + formData.hostname_main
                  })}
                />
                <View style={{ width: gapSize }} />
                <InputField name="Хост" placeholder="127.0.0.1" inputMode="text"
                  value={formData.hostname_main}
                  setText={value =>
                    setFormData({
                      ...formData,
                      hostname_main: value,
                      hostname: formData.hostname_prefix + value
                    })}
                />
              </View>
              <View style={styles.rowContainer}>
                <InputField name="Логин внешнего админа" placeholder="user@mail.ru" inputMode="text"
                  value={formData.login}
                  setText={value => setFormData({ ...formData, login: value })}
                />
                <View style={{ width: gapSize }} />
                <InputField name="Пароль внешнего админа" placeholder="12345678" inputMode="text" secureTextEntry
                  value={formData.password}
                  setText={value => setFormData({ ...formData, password: value })}
                />
              </View>
              <View style={styles.rowContainer}>
                <InputField name="Идентификатор объекта бронирования" placeholder="1" inputMode="numeric"
                  value={formData.id}
                  setText={value => setFormData({ ...formData, id: value })}
                />
              </View>
              {/* QBIC API */}
              <Text style={[styles.title, { color: colorScheme.light, fontSize: titleSize * .5, marginBottom: 0 }]}>Конфигурация api QBic:</Text>
              <View style={styles.rowContainer}>
                <InputField name="Хост" placeholder="127.0.0.1" inputMode="text"
                  value={formData.qbic_hostname}
                  setText={value => setFormData({ ...formData, qbic_hostname: value })}
                />
              </View>
              <View style={styles.rowContainer}>
                <InputField name="Логин" placeholder="user@mail.ru" inputMode="text"
                  value={formData.qbic_login}
                  setText={value => setFormData({ ...formData, qbic_login: value })}
                />
                <View style={{ width: gapSize }} />
                <InputField name="Пароль" placeholder="12345678" inputMode="text" secureTextEntry
                  value={formData.qbic_password}
                  setText={value => setFormData({ ...formData, qbic_password: value })}
                />
              </View>
              <Button title="Применить настройки" onPress={handleSave} />
              <Button title="Логи приложения" onPress={() => navigation.navigate('Logs')} />
            </ScrollView>
          </View>
        </>
      }
    />
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: "Onest_600SemiBold",
    marginBottom: 16
  },
  rowContainer: {
    flexDirection: 'row',
    width: '100%',
  },
});

export default ConfigScreen;