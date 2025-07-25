import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';

import ColumnScreen from '../ColumnScreen';
import SpaceInfo from '../SpaceInfo';
import BackButton from '../BackButton';
import Button from "../Button";

import { useSelector } from "react-redux";

const Logs = ({ navigate, goBack, resetToHome, params }) => {
    const logs = useSelector(state => state.data.logs);

    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
    const topOffset = screenHeight * .2;
    const titleSize = screenHeight * .045;

    const colorScheme = {
        dark: "#181818",
        light: "#FFFFFF",
        free: "#71EB8C",
        busy: "#FF6567",
        container: "#2F2F2F",
    };

    return (
        <ColumnScreen
            leftContent={<SpaceInfo navigate={navigate}/>}
            rightContent={
                <>
                    <BackButton goBack={goBack}/>
                    <View style={{ marginTop: topOffset, flex: 1 }}>
                        <Text style={[styles.title, {
                            color: colorScheme.light,
                            fontSize: titleSize,
                            marginBottom: titleSize
                        }]}>Логи приложения:</Text>
                        <ScrollView>
                            {logs.map((item, i) => (

                                <Text key={i}
                                    style={[styles.text, {
                                        color: colorScheme.light,
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