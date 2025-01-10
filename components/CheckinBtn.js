import React from "react";
import { Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { Styles } from '../utils/styles';

const CheckinBtn = (props) => {

    function Press() {
        try {
            props.onPress();
        } catch (e) {
            console.log('CheckinBtn: не удалось выполнить чек-ин!');
        }
    }

    return (
        <Pressable onPress={Press}>
            <LinearGradient
                colors={Styles.primaryGradient.colors}
                start={Styles.primaryGradient.start}
                end={Styles.primaryGradient.end}
                style={[Styles.button_primary, Styles.horizontalRow]}
            >
                <Text style={[Styles.text_h2, { color: 'white' }]}>Чек-ин</Text>
                <FontAwesomeIcon style={[Styles.text_h2, Styles.smallIcon, { marginLeft: 10, color: 'white' }]} icon="fa-solid fa-chevron-right" />
            </LinearGradient>
        </Pressable>
    );
};

export default CheckinBtn;