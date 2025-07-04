import React, { useState, useEffect, useRef } from "react";
import { Text, View } from 'react-native';

import { Styles } from '../utils/styles';

const Title = (props) => {

    const [sectionData, setSectionData] = useState({ NAME: "Помещение" });

    useEffect(() => {
        try {
            if (props.objectData == null ||
                props.objectData.equipments == null ||
                !Array.isArray(props.objectData.equipments)
            ) return;

            setSectionData({
                NAME: props.objectData.name,
                EQUIPMENT: props.objectData.equipments.map(item => {
                    return "• " + item["type"]["name"] + " ";
                })
            });
        } catch (e) {
            console.log('Title: ошибка в обработке данных');
        }
    }, [props.objectData]);

    return (
        <View style={Styles.title}>
            <Text style={[
                Styles.text_h1,
                props.objectData && props.objectData["is_reserved_now"] ? Styles.busyColor : Styles.freeColor
            ]}>
                {props.objectData && props.objectData["is_reserved_now"] ? "Занято" : "Свободно"}
            </Text>
            <Text style={[Styles.text_h2, props.inverted ? { color: "white" } : {}]}>{sectionData["NAME"]}</Text>
            <Text style={[Styles.text_regular, props.inverted ? { color: "white" } : {}]}>{sectionData["EQUIPMENT"]}</Text>
        </View>
    );
};

export default Title;