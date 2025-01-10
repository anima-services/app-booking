import React, {useState, useEffect} from "react";
import { Image, View, Text } from 'react-native';

import Title from "../components/Title";
import CheckinBtn from "../components/CheckinBtn";
import QuickBook from "../components/QuickBook";

import { Styles } from '../utils/styles';

const MenuMain = (props) => {
    function dateDiffMin(in_date) {
        let diff = Math.abs(new Date() - new Date(in_date));
        let minutes = Math.floor((diff/1000)/60);
        return minutes;
    }

    function countdownUpdate() {
        let _nowDate = new Date();

        if (_nowDate < (new Date(props.reservationSelected.end)) &&
            _nowDate > (new Date(props.reservationSelected.start))) {
            return `Осталось до конца: ${dateDiffMin(props.reservationSelected.end)} мин.`;
        } else if (_nowDate < (new Date(props.reservationSelected.start))) {
            return `Осталось до начала: ${dateDiffMin(props.reservationSelected.start)} мин.`;
        }
    }

    return (
        <>
            <Title objectData={props.objectData} />
            <CheckinBtn
                onPress={() => props.selectMenu(2)}
                setScroll={props.setScroll}
            />
            {props.currentEvent && props.currentEvent.id ?
                <>
                    <Text style={Styles.text_h2}>{props.currentEvent.topic}</Text>
                    { props.reservationSelected ? <Text style={Styles.text_regular}>{countdownUpdate()}</Text> : <></>}
                    <Text style={Styles.text_regular}>Участники:</Text>
                    <View style={Styles.horizontalRow}>
                        <Image
                            style={Styles.userPhoto}
                            source={{ uri: props.currentEvent.user_info.photo }}
                        />
                        {props.currentEvent.participants_info.map(item =>
                            < Image
                                style={Styles.userPhoto}
                                source={{ uri: item.photo }}
                            />
                        )}
                    </View>
                </>
                :
                <QuickBook
                    selectedMenu={props.selectedMenu}
                    selectMenu={props.selectMenu}

                    setTimePreset={props.setTimePreset}
                />
            }
        </>
    );
};

export default MenuMain;