import React from "react";
import { StyleSheet, Pressable } from 'react-native';

import ColumnScreen from '../ColumnScreen';
import SpaceInfo from '../SpaceInfo';
import Schedule from '../Schedule';

const Home = ({ navigate, goBack, resetToHome, params }) => {

  return (
    <ColumnScreen
      leftContent={<SpaceInfo navigate={navigate}/>}
      rightContent={<Schedule navigate={navigate}/>}
    />
  );
};

export default Home;