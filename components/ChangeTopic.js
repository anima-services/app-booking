import React from "react";
import { View, TextInput, Text } from 'react-native';

import { Styles } from '../utils/styles';

const ChangeTopic = (props) => {


    return (
        <View >
            <Text style={[Styles.text_regular]}>{props.title}</Text>
            <TextInput
                disableFullscreenUI={true}
                style={[Styles.inputField, Styles.inputField.text, { marginTop: 0 }]}
                onChangeText={props.changeValue}
                value={props.value}
                placeholder="Тема бронирования"
            />
        </View>
    );
};

export default ChangeTopic;