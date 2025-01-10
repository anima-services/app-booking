import React from "react";
import { Text, View } from 'react-native';

import { Styles } from '../utils/styles';

import Button from "./Button";

const QuickBook = (props) => {

    return (
        <View style={props.allignBottom ? {} : Styles.allignBottom}>
            <Text style={Styles.text_regular}>{props.allignBottom ? "Время" : "Забронировать сейчас:"}</Text>
            <View style={Styles.horizontalRow}>
                <View style={Styles.horizontalRow.container}>
                    <Button status={props.timePreset == 15}
                        onPress={() => { props.setTimePreset(15); props.selectMenu(1); }}
                        title={"15 мин"} />
                </View>
                <View style={Styles.horizontalRow.container}>
                    <Button status={props.timePreset == 30}
                        onPress={() => { props.setTimePreset(30); props.selectMenu(1); }}
                        title={"30 мин"} />
                </View>
                <View style={Styles.horizontalRow.container}>
                    <Button status={props.timePreset == 60}
                        onPress={() => { props.setTimePreset(60); props.selectMenu(1); }}
                        title={"60 мин"} />
                </View>
            </View>
        </View>
    );
};

export default QuickBook;