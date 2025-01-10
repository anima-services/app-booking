import React from "react";
import { Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { Styles } from '../utils/styles';

const BookBtn = (props) => {

    function Press() {
        try {
            if (props.enabled) props.onPress();
        } catch (e) {
            console.log('BookBtn: не удалось забронировать!');
        }
    }

    return (
        <Pressable style={Styles.allignBottom} onPress={Press}>
            <LinearGradient
                colors={props.enabled ? Styles.primaryGradient.colors : Styles.primaryGradient.disabledColors}
                start={Styles.primaryGradient.start}
                end={Styles.primaryGradient.end}
                style={[Styles.button_primary, Styles.horizontalRow]}
            >
                <Text style={[Styles.text_h2, { color: 'white' }]}>Забронировать</Text>
                <FontAwesomeIcon style={[Styles.text_h2, Styles.smallIcon, { marginLeft: 10, color: 'white' }]} icon="fa-solid fa-chevron-right" />
            </LinearGradient>
        </Pressable>
    );
};

export default BookBtn;