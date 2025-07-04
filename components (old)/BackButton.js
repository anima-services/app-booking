import React from "react";
import { Text, Pressable } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { Styles } from '../utils/styles';

const BackButton = (props) => {

    function Press() {
        try {
            props.selectMenu(0);
        } catch (e) {
            console.log('BackButton: не удалось вернуться назад!');
        }
    }

    return (
        <Pressable onPress={Press} style={[Styles.horizontalRow, { marginTop: 20 }]}>
            <FontAwesomeIcon style={[Styles.text_h2, Styles.smallIcon, { marginRight: 10, alignSelf: "center" }]} icon="fa-solid fa-chevron-left" />
            <Text style={[Styles.text_h2]}>
                {props.title}
            </Text>
        </Pressable>
    );
};

export default BackButton;