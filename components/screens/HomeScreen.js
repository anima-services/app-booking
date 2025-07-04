import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

import ColumnScreen from '../ColumnScreen';
import SpaceInfo from '../SpaceInfo';

const HomeScreen = ({ navigation }) => {
  return (
    <ColumnScreen
      leftContent={<SpaceInfo />}
      rightContent={<>
        {/* Открытие окна конфигурации */}
        <View style={styles.buttonContainer}>
          <Button
            title="Конфигурация"
            onPress={() => navigation.navigate('Config')}
            color="#6200ee"
          />
        </View>
      </>}
    />
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: '70%',
    borderRadius: 10,
    overflow: 'hidden',
  },
});

export default HomeScreen;