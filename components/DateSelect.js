import React, { useState, useEffect } from "react";
import { Text, Pressable, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { Styles } from '../utils/styles';

const DateSelect = (props) => {
    const [openDate, setOpenDate] = useState(false);
    const [openStart, setOpenStart] = useState(false);
    const [openEnd, setOpenEnd] = useState(false);

    const [date, setDate] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");

    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour12: false, hour: "2-digit", minute: "2-digit" };

    useEffect(() => {
        try {
            setDate(props.bookingStart.toLocaleString("ru", dateOptions));
            setStart(props.bookingStart.toLocaleString("ru", timeOptions));
            setEnd(props.bookingEnd.toLocaleString("ru", timeOptions));
        } catch (e) {
            console.log('DateSelect: не удалось обновить начало и конец бронирования');
        }
    }, [props.bookingStart, props.bookingEnd]);

    return (
        <>
            <View style={[Styles.horizontalRow, { marginTop: 10 }]}>
                <View >
                    <Text style={[Styles.text_regular]}>Дата</Text>
                    <Pressable style={[Styles.inputField, Styles.horizontalRow]} onPress={() => setOpenDate(true)}>
                        <Text style={[Styles.text_regularLC]}>{date}</Text>
                        <FontAwesomeIcon
                            style={[Styles.text_regularLC, Styles.smallIcon, { marginLeft: 10, alignSelf: "center" }]}
                            icon="fa-regular fa-calendar"
                        />
                    </Pressable>
                </View>
                <View>
                    <Text style={[Styles.text_regular]}>Начало</Text>
                    <Pressable style={[Styles.inputField, Styles.horizontalRow]} onPress={() => setOpenStart(true)}>
                        <Text style={[Styles.text_regularLC]}>{start}</Text>
                        <FontAwesomeIcon
                            style={[Styles.text_regularLC, Styles.smallIcon, { marginLeft: 10, alignSelf: "center" }]}
                            icon="fa-regular fa-clock"
                        />
                    </Pressable>
                </View>
                <View>
                    <Text style={[Styles.text_regular]}>Конец</Text>
                    <Pressable style={[Styles.inputField, Styles.horizontalRow]} onPress={() => setOpenEnd(true)}>
                        <Text style={[Styles.text_regularLC]}>{end}</Text>
                        <FontAwesomeIcon
                            style={[Styles.text_regularLC, Styles.smallIcon, { marginLeft: 10, alignSelf: "center" }]}
                            icon="fa-regular fa-clock"
                        />
                    </Pressable>
                </View>
            </View>
            <DateTimePickerModal isVisible={openDate} mode="date" date={props.bookingStart}
                onConfirm={(date) => {
                    setOpenDate(false)
                    props.setBookingStart(date)
                }}
                onCancel={() => {
                    setOpenDate(false)
                }}
            />
            <DateTimePickerModal isVisible={openStart} mode="time" date={props.bookingStart}
                onConfirm={(date) => {
                    setOpenStart(false)
                    props.setBookingStart(date)
                }}
                onCancel={() => {
                    setOpenStart(false)
                }}
            />
            <DateTimePickerModal isVisible={openEnd} mode="time" date={props.bookingEnd}
                onConfirm={(date) => {
                    setOpenEnd(false)
                    props.setBookingEnd(date)
                }}
                onCancel={() => {
                    setOpenEnd(false)
                }}
            />
        </>
    );
};

export default DateSelect;