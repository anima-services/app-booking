import { useState, useEffect } from 'react';
import { StyleSheet, Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import ColumnScreen from '../ColumnScreen';
import SpaceInfo from '../SpaceInfo';
import BackButton from '../BackButton';
import InputField from '../InputField';
import Dropdown from '../Dropdown';

import { useResponsiveSizes } from '../hooks/useResponsiveSizes';

import { useSelector, useDispatch } from "react-redux";
import { setState, updateData } from "../data/DataSlice";

const BookScreen = ({ route }) => {
  const navigation = useNavigation();

  const { timeStart, timeEnd, formatStart, formatEnd } = route.params;
  const data = useSelector(state => state.data);
  const sizes = useResponsiveSizes();

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
              value={null}
              setText={null}
            />
          </View>
          <Dropdown
            name="Организатор"
            data={data.users_data}
            placeholder="Введите ФИО или почту"
            pictureTag="photo"
            textTag="full_name"
            attributeTag="email"
          />
          <Dropdown
            name="Участники"
            data={data.users_data}
            placeholder="Введите ФИО или почту"
            pictureTag="photo"
            textTag="full_name"
            attributeTag="email"
            maxItems={15}
          />
          {/* Пинкод */}
          <View style={styles.rowContainer}>
            <InputField name="Пинкод" placeholder="Введите ваш пинкод для подтверждения личности*" inputMode="text"
              value={null}
              setText={null}
            />
          </View>
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

export default BookScreen;