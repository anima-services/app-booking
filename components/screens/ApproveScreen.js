import { useState, useEffect } from 'react';
import { StyleSheet, Pressable } from 'react-native';

import ColumnScreen from '../ColumnScreen';
import SpaceInfo from '../SpaceInfo';
import BackButton from '../BackButton';

const ApproveScreen = ({ navigation }) => {

  return (
    <ColumnScreen
      leftContent={<SpaceInfo />}
      rightContent={<BackButton />}
    />
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  buttonContainer: {
    width: '70%',
    borderRadius: 10,
    overflow: 'hidden',
  },
});

export default ApproveScreen;