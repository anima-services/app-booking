import React from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';

import ColumnScreen from '../ColumnScreen';
import SpaceInfo from '../SpaceInfo';
import BackButton from '../BackButton';
import InputField from '../InputField';
import { width } from '@fortawesome/free-solid-svg-icons/faFlagCheckered';

const ConfigScreen = ({ navigation }) => {
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

  return (
    <ColumnScreen
      leftContent={<SpaceInfo />}
      rightContent={
        <>
          <BackButton navigation={navigation} />
          <View style={{ marginTop: topOffset, flex: 1 }}>
            <Text style={[styles.title, { color: colorScheme.light, fontSize: titleSize }]}>Конфигурация:</Text>
            <ScrollView>
              {/* ANIMA API */}
              <View style={styles.rowContainer}>
                <InputField name="Префикс хоста" placeholder="https://" inputMode="text" />
                <View style={{ width: gapSize }} />
                <InputField name="Хост" placeholder="127.0.0.1" inputMode="text" />
              </View>
              <View style={styles.rowContainer}>
                <InputField name="Логин внешнего админа" placeholder="user@mail.ru" inputMode="text" />
                <View style={{ width: gapSize }} />
                <InputField name="Пароль внешнего админа" placeholder="12345678" inputMode="text" secureTextEntry />
              </View>
              <InputField name="Идентификатор объекта бронирования" placeholder="1" inputMode="numeric" />
              {/* QBIC API */}
              <Text style={[styles.title, { color: colorScheme.light, fontSize: titleSize * .5 }]}>Конфигурация api QBic:</Text>
              <InputField name="Хост" placeholder="127.0.0.1" inputMode="text" />
              <View style={styles.rowContainer}>
                <InputField name="Логин" placeholder="user@mail.ru" inputMode="text" />
                <View style={{ width: gapSize }} />
                <InputField name="Пароль" placeholder="12345678" inputMode="text" secureTextEntry />
              </View>
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