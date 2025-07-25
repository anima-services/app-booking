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

export default Home;