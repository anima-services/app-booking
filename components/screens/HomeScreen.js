import { useState, useEffect } from 'react';
import { StyleSheet, Pressable } from 'react-native';

import ColumnScreen from '../ColumnScreen';
import SpaceInfo from '../SpaceInfo';

const HomeScreen = ({ navigation }) => {
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  const handlePress = () => {
    const now = Date.now();
    if (now - lastClickTime <= 500) {
      setClickCount(prevCount => prevCount + 1);
    } else {
      setClickCount(1);
    } setLastClickTime(now);
  };

  useEffect(() => {
    if (clickCount === 5) {
      navigation.navigate('Config');
    }
  }, [clickCount]);

  return (
    <Pressable style={styles.content} onPress={handlePress}>
      <ColumnScreen
        leftContent={<SpaceInfo />}
        rightContent={<>
          
        </>}
      />
    </Pressable>
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

export default HomeScreen;