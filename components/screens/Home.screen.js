import { StyleSheet, Pressable } from 'react-native';

import ColumnScreen from '../ColumnScreen';
import SpaceInfo from '../SpaceInfo';
import Schedule from '../Schedule';

const Home = ({ navigation }) => {
  return (
    <ColumnScreen
      leftContent={<SpaceInfo />}
      rightContent={<Schedule />}
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