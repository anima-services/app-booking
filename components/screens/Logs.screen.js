import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';

import ColumnScreen from '../ColumnScreen';
import SpaceInfo from '../SpaceInfo';
import BackButton from '../BackButton';
import InputField from '../InputField';
import Button from "../Button";

import { useSelector, useDispatch } from "react-redux";
import { setState, updateData } from "../data/DataSlice";

const Logs = ({ navigation }) => {
    const data = useSelector(state => state.data);
    const dispatch = useDispatch();

    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const topOffset = screenHeight * .2;
    const titleSize = screenHeight * .045;
    const gapSize = screenHeight * .01;

    const colorScheme = {
        dark: "#181818",
        light: "#FFFFFF",
        free: "#71EB8C",
        busy: "#FF6567",
        container: "#2F2F2F",
    };

    const [formData, setFormData] = useState({
        hostname: "",
        hostname_main: "",
        hostname_prefix: "",
        id: "",
        login: "",
        password: "",
        qbic_hostname: "",
        qbic_login: "",
        qbic_password: "",
    });

    const handleLoad = () => {
        let newFormData = {};
        for (var key in formData) {
            newFormData = { ...newFormData, [`${key}`]: data[key] ?? "" };
        }
        setFormData(newFormData);
        console.log("Данные загружены!", data);
    };

    const handleSave = () => {
        dispatch(setState(formData));
        console.log("Данные сохранены!", formData);
    };

    useEffect(() => {
        handleLoad();
    }, []);

    return (
        <ColumnScreen
            leftContent={<SpaceInfo />}
            rightContent={
                <>
                    <BackButton />
                    <View style={{ marginTop: topOffset, flex: 1 }}>
                        <Text style={[styles.title, {
                            color: colorScheme.light,
                            fontSize: titleSize,
                            marginBottom: titleSize
                        }]}>Логи приложения:</Text>
                        <ScrollView>
                            {data.logs.map((item, i) => (

                                <Text key={i}
                                    style={[styles.text, {
                                        color: colorScheme.light,
                                        fontSize: titleSize * .4,
                                        marginBottom: 0
                                    }]}>{item}</Text>
                            ))}
                            <Button title="Назад" onPress={() => navigation.navigate('Config')} />
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