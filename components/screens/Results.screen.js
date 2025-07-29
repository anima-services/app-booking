import { StyleSheet, Text, View } from 'react-native';
import Svg, { Rect, Path } from "react-native-svg"

import ColumnScreen from '../ColumnScreen';
import SpaceInfo from '../SpaceInfo';
import BackButton from '../BackButton';
import Button from '../Button';

import { useResponsiveSizes } from '../hooks/useResponsiveSizes';
import { useTheme } from '../ThemeContext';

const Results = ({ navigate, goBack, resetToHome, params }) => {
  const { success, text } = params;
  
  function goHome() {
    resetToHome();
  }

  const sizes = useResponsiveSizes();
  const { theme, toggleTheme } = useTheme();

  const styles = StyleSheet.create({
    title: {
      fontFamily: "Onest_600SemiBold",
      color: theme.light,
      textAlign: 'center',
    },
    rowContainer: {
      flexDirection: 'row',
      width: '100%',
    },
  });

  return (
    <ColumnScreen
      leftContent={<SpaceInfo navigate={navigate}/>}
      rightContent={<>
        <BackButton goBack={resetToHome}/>
        <View style={{ flex: 1, justifyContent: 'center'}}>
          <View style={{ alignItems: 'center' }}>
            <Svg
              width={sizes.titleSize}
              height={sizes.titleSize}
              style={{ display: success ? 'flex' : 'none' }}
              viewBox="0 0 37 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <Rect x={1.5} y={1} width={34} height={34} rx={17} fill={theme.free} />
              <Rect
                x={1.5}
                y={1}
                width={34}
                height={34}
                rx={17}
                stroke={theme.free}
                strokeWidth={2}
              />
              <Path
                d="M27 11L13.923 24 10 20.104"
                stroke={theme.container}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
          <Text style={[styles.title, { fontSize: sizes.textSize, marginVertical: sizes.titleSize }]}>
            {text}
          </Text>
          <Button title="Ок" onPress={goHome} />
        </View>
      </>}
    />
  );
};

export default Results;