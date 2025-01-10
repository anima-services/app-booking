import React, { useState, useEffect } from "react";
import { Text, View } from 'react-native';

import { Styles } from '../utils/styles';

const Notification = ({ notification, setNotification }) => {
    const [show, setShow] = useState(false);
    const showTime = 3;
    let timer;

    useEffect(() => {
        try {
            if (!notification.text || !notification.color) return;

            setShow(true);
            clearTimeout(timer);
            timer = setTimeout(() => {
                setNotification({ text: "", color: "#ffffff" });
                setShow(false);
            }, showTime * 1000);
        } catch (e) {
            console.log('Notification: не удалось отобразить уведомление');
        }
    }, [notification]);

    return (
        <View style={show
            ? [Styles.notification, Styles.notification.show, Styles.horizontalRow, { backgroundColor: notification.color }]
            : [Styles.notification, Styles.notification.hide, Styles.horizontalRow]
        }>
            <Text style={[Styles.text_regular, { color: "#ffffff" }]}>{notification.text}</Text>
        </View>
    );
};

export default Notification;