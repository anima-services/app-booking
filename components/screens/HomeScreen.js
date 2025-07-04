import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

import ColumnScreen from '../ColumnScreen';
import SpaceInfo from '../SpaceInfo';

const HomeScreen = ({ navigation }) => {
  return (
    <ColumnScreen
      leftContent={<SpaceInfo />}
      rightContent={<></>}
    />
  );
};

const styles = StyleSheet.create({

});

export default HomeScreen;