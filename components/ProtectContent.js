import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";

import InputField from "./InputField";
import Button from "./Button";

import { useResponsiveSizes } from './hooks/useResponsiveSizes';
import { useSelector } from "react-redux";
import { useTheme } from "./ThemeContext";

const ProtectContent = ({ goBack, setAccess }) => {
    const data = useSelector(state => state.data);
    const sizes = useResponsiveSizes();
    const { theme } = useTheme();

    const [password, setPassword] = useState('');

    const buttonStyle = {
        width: sizes.windowWidth * .15
    };

    const checkPassword = () => {
        if (data.system_password === password) {
            setAccess(true);
        } else goBack();
        setPassword('');
    }

    return (
        <View style={styles.container}>
            <View style={styles.childContainer}>
                <Text style={[styles.title, { color: theme.light, fontSize: sizes.titleSize}]}>Введите системный пароль:</Text>
                <View style={{ flexDirection: 'row' }}>
                    <InputField name="Пароль" placeholder="Пароль" inputMode="text" secureTextEntry
                        value={password}
                        setText={setPassword}
                    />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Button style={buttonStyle} title='Отменить' onPress={goBack} />
                    <Button style={buttonStyle} title='Принять' disabled={password === ''} onPress={checkPassword} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontFamily: "Onest_600SemiBold",
    },
    container: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    childContainer: {
        width: '50%',
    },
});

export default ProtectContent;