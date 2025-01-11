import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Button, Modal, TextInput, StyleSheet, Dimensions, Pressable } from 'react-native';

import structuredClone from "@ungap/structured-clone";

import { useSelector, useDispatch } from 'react-redux';
import { setConfig } from '../data/appDataSlice';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ModalSettings = (props) => {
    const config = useSelector((state) => state.appData.config);
    const logs = useSelector((state) => state.tempData.logs);
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        hostname: "",
        id: "",
        login: "",
        password: "",
        /* конфигурация объектов бронирования */
        mapId: "",
        spaceCount: "",
        spaces: [],
        /* конфигурация панели бронирования */
        panel: "",
        panelHost: "",
        panelLogin: "",
        panelPassword: "",
        panelId: "",
    });
    const [panelSettings, setPanelSettings] = useState({});

    const handleSave = () => {
        dispatch(setConfig(formData));
        props.setModalVisible(false);
    };

    useEffect(() => {
        for (let i = 0; i < formData.spaces.length; i++) {
            if (!formData.spaces[i]) formData.spaces[i] = 0;
        }
        setFormData({...formData, ...formData.spaces});
    }, [formData.spaceCount]);

    useEffect(() => {
        try {
            switch (formData.panel) {
                case "qbic":
                    setPanelSettings({
                        panelHost: true,
                        panelLogin: true,
                        panelPassword: true,
                        panelId: false,
                    });
                    break;
                case "newbest":
                    setPanelSettings({
                        panelHost: false,
                        panelLogin: false,
                        panelPassword: false,
                        panelId: false,
                    });
                    break;
                case "webapi":
                    setPanelSettings({
                        panelHost: true,
                        panelLogin: true,
                        panelPassword: true,
                        panelId: true,
                    });
                    break;
                default:
                    setPanelSettings({
                        panelHost: false,
                        panelLogin: false,
                        panelPassword: false,
                        panelId: false,
                    });
                    break;
            }
        } catch (e) {
            console.log('ModalSettings: обновить поля панели');
        }
    }, [formData.panel]);

    return (
        <Modal visible={props.modalVisible} animationType="slide" presentationStyle='pageSheet'>
            <ScrollView style={styles.container}>
                <Text style={styles.header}>{`A4S / хост: ${config.hostname}`}</Text>
                <TextInput
                    placeholder="hostname"
                    value={formData.hostname}
                    onChangeText={value => setFormData({ ...formData, hostname: value })}
                    style={styles.input}
                />
                <Text style={styles.header}>{`A4S / login: ${config.login}`}</Text>
                <TextInput
                    placeholder="login"
                    value={formData.login}
                    onChangeText={value => setFormData({ ...formData, login: value })}
                    style={styles.input}
                />
                <Text style={styles.header}>{`A4S / password: ${config.password}`}</Text>
                <TextInput
                    placeholder="password"
                    value={formData.password}
                    onChangeText={value => setFormData({ ...formData, password: value })}
                    style={styles.input}
                />
                <Text style={styles.header}>{`A4S / id карты: ${config.mapId}`}</Text>
                <TextInput
                    placeholder="mapId"
                    value={formData.mapId}
                    onChangeText={value => setFormData({ ...formData, mapId: value })}
                    style={styles.input}
                    inputMode="numeric"
                />
                <Text style={styles.header}>{`A4S / Число объектов: ${config.spaceCount}`}</Text>
                <TextInput
                    placeholder="spaceCount"
                    type="number"
                    value={formData.spaceCount}
                    onChangeText={value => {
                        let array = formData.spaces;
                        array.length = value;
                        setFormData({ ...formData, spaceCount: value, spaces: array });
                    }}
                    style={styles.input}
                />
                {formData.spaces.map((item, i) => {
                    return <View key={`space-${i}`}>
                        <Text style={styles.header}>{`ID ${i}:`}</Text>
                        <TextInput
                            placeholder="-"
                            value={formData.spaces[i]}
                            onChangeText={value => {
                                let array = formData.spaces;
                                array[i] = value;
                                setFormData({ ...formData, spaces: array });
                            }}
                            style={styles.input}
                        />
                    </View>;
                })}
                <Text style={styles.header}>{`Тип панели: ${config.panel}`}</Text>
                <TextInput
                    placeholder="-"
                    value={formData.panel}
                    onChangeText={value => setFormData({ ...formData, panel: value })}
                    style={styles.input}
                />
                {panelSettings.panelHost ? <>
                    <Text style={styles.header}>{`Хост: ${config.panelHost}`}</Text>
                    <TextInput
                        placeholder="-"
                        value={formData.panelHost}
                        onChangeText={value => setFormData({ ...formData, panelHost: value })}
                        style={styles.input}
                    />
                </> : <></>}
                {panelSettings.panelLogin ? <>
                    <Text style={styles.header}>{`Логин: ${config.panelLogin}`}</Text>
                    <TextInput
                        placeholder="-"
                        value={formData.panelLogin}
                        onChangeText={value => setFormData({ ...formData, panelLogin: value })}
                        style={styles.input}
                    />
                </> : <></>}
                {panelSettings.panelPassword ? <>
                    <Text style={styles.header}>{`Пароль: ${config.panelPassword}`}</Text>
                    <TextInput
                        placeholder="-"
                        value={formData.panelPassword}
                        onChangeText={value => setFormData({ ...formData, panelPassword: value })}
                        style={styles.input}
                    />
                </> : <></>}
                {panelSettings.panelId ? <>
                    <Text style={styles.header}>{`ID панели: ${config.panelId}`}</Text>
                    <TextInput
                        placeholder="-"
                        value={formData.panelId}
                        onChangeText={value => setFormData({ ...formData, panelId: value })}
                        style={styles.input}
                    />
                </> : <></>}
                <View style={{ marginVertical: 5 }}>
                    <Button title="Вернуть параметры" onPress={() => setFormData(structuredClone(config))} />
                </View>
                <View style={{ marginVertical: 5 }}>
                    <Button title="Подсветка: занято" onPress={() => props.setBusy({ state: true, time: "" })} />
                </View>
                <View style={{ marginVertical: 5 }}>
                    <Button title="Подсветка: свободно" onPress={() => props.setBusy({ state: false, time: "" })} />
                </View>
                <View style={{ marginVertical: 5 }}>
                    <Button title="Сохранить" onPress={handleSave} />
                </View>
                <View style={{ marginVertical: 5 }}>
                    <Button title="Закрыть" onPress={() => props.setModalVisible(false)} />
                </View>
                <Text style={styles.header}>Логи приложения</Text>
                <View style={{ marginBottom: 50 }}>
                    {logs.map((item, i) =>
                        <Text key={i}>{item}</Text>
                    )}
                </View>
            </ScrollView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: windowWidth * .025,
    },
    containerSmall: {
        padding: windowWidth * .01,
    },
    input: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 2,
    },
    header: {
        paddingTop: windowWidth * .01,
        fontWeight: '500',
    },
});

export default ModalSettings;