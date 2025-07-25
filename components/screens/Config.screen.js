import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';

import ColumnScreen from '../ColumnScreen';
import SpaceInfo from '../SpaceInfo';
import BackButton from '../BackButton';
import InputField from '../InputField';
import Button from "../Button";

import AppUpdate from "../services/appUpdater.services";

import { useSelector, useDispatch } from "react-redux";
import { setState, setLogs } from "../data/DataSlice";

const Config = ({ navigate, goBack, resetToHome, params }) => {
  const data = useSelector(state => state.data);
  const dispatch = useDispatch();

  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
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
      leftContent={<SpaceInfo navigate={navigate}/>}
      rightContent={
        <>
          <BackButton goBack={goBack}/>
          <View style={{ marginTop: topOffset, flex: 1 }}>
            <Text style={[styles.title, { color: colorScheme.light, fontSize: titleSize, marginBottom: titleSize }]}>Конфигурация:</Text>
            <ScrollView>
              {/* ANIMA API */}
              <View style={[styles.rowContainer, { gap: gapSize }]}>
                <InputField name="Префикс хоста (https://)" placeholder="Префикс хоста" inputMode="text"
                  value={formData.hostname_prefix}
                  setText={value => setFormData({
                    ...formData,
                    hostname_prefix: value,
                    hostname: value + formData.hostname_main
                  })}
                />

                <InputField name="Хост (127.0.0.1)" placeholder="Хост" inputMode="text"
                  value={formData.hostname_main}
                  setText={value =>
                    setFormData({
                      ...formData,
                      hostname_main: value,
                      hostname: formData.hostname_prefix + value
                    })}
                />
              </View>
              <View style={[styles.rowContainer, { gap: gapSize }]}>
                <InputField name="Логин внешнего админа" placeholder="Логин внешнего админа" inputMode="text"
                  value={formData.login}
                  setText={value => setFormData({ ...formData, login: value })}
                />

                <InputField name="Пароль внешнего админа" placeholder="Пароль внешнего админа" inputMode="text" secureTextEntry
                  value={formData.password}
                  setText={value => setFormData({ ...formData, password: value })}
                />
              </View>
              <View style={[styles.rowContainer, { gap: gapSize }]}>
                <InputField name="Идентификатор объекта бронирования" placeholder="Идентификатор объекта бронирования" inputMode="numeric"
                  value={formData.id}
                  setText={value => setFormData({ ...formData, id: value })}
                />
              </View>
              {/* QBIC API */}
              <Text style={[styles.title, { color: colorScheme.light, fontSize: titleSize * .5, marginBottom: 0 }]}>Конфигурация api QBic:</Text>
              <View style={[styles.rowContainer, { gap: gapSize }]}>
                <InputField name="Хост (127.0.0.1)" placeholder="Хост" inputMode="text"
                  value={formData.qbic_hostname}
                  setText={value => setFormData({ ...formData, qbic_hostname: value })}
                />
              </View>
              <View style={[styles.rowContainer, { gap: gapSize }]}>
                <InputField name="Логин" placeholder="Логин" inputMode="text"
                  value={formData.qbic_login}
                  setText={value => setFormData({ ...formData, qbic_login: value })}
                />

                <InputField name="Пароль" placeholder="Пароль" inputMode="text" secureTextEntry
                  value={formData.qbic_password}
                  setText={value => setFormData({ ...formData, qbic_password: value })}
                />
              </View>
              <View style={[styles.rowContainer, { gap: gapSize }]}>
                <Button title="Применить настройки" onPress={handleSave} style={{ flex: 1 }} />
                <Button title="Логи приложения" onPress={() => navigate('Logs')} style={{ flex: 1 }} />
              </View>
              <AppUpdate />
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

export default Config;