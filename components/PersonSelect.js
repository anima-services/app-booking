import React from "react";
import { Text, Pressable, View } from 'react-native';

import { Styles } from '../utils/styles';

const PersonSelect = (props) => {

    function openSelector() {
        try {
            props.openSelector();
        } catch (e) {
            console.log('PersonSelect: Ошибка при открытии openSelector()');
        }
    }

    return (
        <View >
            <Text style={[Styles.text_regular]}>{props.title}</Text>
            <Pressable style={props.highlighted
                ? [Styles.inputField.selected, Styles.horizontalRow]
                : [Styles.inputField, Styles.horizontalRow
                ]} onPress={openSelector}>
                <Text style={[Styles.text_regularLC]}>{props.selected ? props.selected : "Нажмите, чтобы добавить"}</Text>
            </Pressable>
        </View>
    );
};

export default PersonSelect;