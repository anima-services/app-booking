import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';

import ColumnScreen from '../ColumnScreen';
import SpaceInfo from '../SpaceInfo';
import BackButton from '../BackButton';
import Button from "../Button";

import { useSelector } from "react-redux";
import { useTheme } from "../ThemeContext";

const Logs = ({ navigate, goBack, resetToHome, params }) => {
    const logs = useSelector(state => state.data.logs);

    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
    const { theme, toggleTheme } = useTheme();
    const topOffset = screenHeight * .2;
    const titleSize = screenHeight * .045;

    useEffect(() => {
        const timerId = setTimeout(() => {
          resetToHome();
        }, 1000 * 60 * 5);
    
        return () => clearTimeout(timerId);
      }, []);

    return (
        <ColumnScreen
            leftContent={<SpaceInfo navigate={navigate}/>}
            rightContent={
                <>
                    <BackButton goBack={resetToHome}/>
                    <View style={{ marginTop: topOffset, flex: 1 }}>
                        <Text style={[styles.title, {
                            color: theme.light,
                            fontSize: titleSize,
                            marginBottom: titleSize
                        }]}>Логи приложения:</Text>
                        <ScrollView>
                            {logs.map((item, i) => (

                                <Text key={i}
                                    style={[styles.text, {
                                        color: theme.light,
                                        fontSize: titleSize * .4,
                                        marginBottom: 0
                                    }]}>{item}</Text>
                            ))}
                            <Button title="Назад" onPress={() => navigate('Config')} />
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
    },
    text: {
        fontFamily: "Onest_200ExtraLight"
    },
    rowContainer: {
        flexDirection: 'row',
        width: '100%',
    },
});

export default Logs;