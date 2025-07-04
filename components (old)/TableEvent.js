import React, { useState } from "react";
import { Text, View, Pressable } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { LinearGradient } from 'expo-linear-gradient';

import { Styles } from '../utils/styles';

const TableEvent = ({ time, status, name, participants, busy, onPress }) => {
    const [pressed, setPressed] = useState(false);

    function SelectStatus() {
        switch (status) {
            case 'approved':
                return "fa-solid fa-lock";
            case 'reserved':
                return "fa-solid fa-lock-open";
            case 'finished':
                return "fa-solid fa-flag-checkered";
            default:
                return "fa-solid fa-ban";
        }
    }

    function Press() {
        try {
            onPress();
        } catch (e) {
            console.log('TableEvent: не удалось выполнить функцию в кнопке!');
            console.log(e);
        }
    }

    return (
        <Pressable
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            onPress={Press}
        >
            <View style={{ opacity: pressed ? 0.25 : 1 }}>
                <LinearGradient
                    colors={busy ? Styles.primaryGradient.colors : Styles.primaryGradient.grayColors}
                    start={Styles.primaryGradient.start}
                    end={Styles.primaryGradient.end}
                    style={busy ? [Styles.tableEvent, Styles.tableEvent.busy] : Styles.tableEvent}
                >
                    <Text style={busy ? [Styles.text_regular, { color: 'white' }] : Styles.text_regular}>{`${time}`}</Text>
                    {status && name && participants ?
                        <>
                            <FontAwesomeIcon style={busy ? [Styles.tableEvent.status, { color: 'white' }] : Styles.tableEvent.status} icon={SelectStatus()} />
                            <Text style={busy ? [Styles.text_h2, { color: 'white' }] : Styles.text_h2}>{name}</Text>
                            <View style={Styles.hr} />
                            <Text style={busy ? [Styles.text_regular, { color: 'white' }] : Styles.text_regular}>{participants}</Text>
                        </>
                        : <></>
                    }
                </LinearGradient>
            </View>
        </Pressable>
    );
};

export default TableEvent;