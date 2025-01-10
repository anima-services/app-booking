import React, { useState, useEffect } from "react";
import { Text } from 'react-native';

import { Styles } from '../utils/styles';

const CurrentDate = (props) => {
    const [date, setDate] = useState(getTime(new Date()));

    useEffect(() => {
        setDate(getTime(new Date()));
    }, [props.date]);


    function getTime(in_date) {
        in_date = new Date(in_date);

        let options = {
            //year: 'numeric',
            month: 'long',
            day: 'numeric',
            timezone: 'UTC'
        };
        let days = [
            'Воскресенье',
            'Понедельник',
            'Вторник',
            'Среда',
            'Четверг',
            'Пятница',
            'Суббота'
        ];

        let _time = days[in_date.getDay()] + ', ';
        _time += in_date.toLocaleString("ru", options);
        _time += `, ${String(in_date.getHours()).padStart(2, '0')}:${String(in_date.getMinutes()).padStart(2, '0')}`;

        return _time;
    }

    return (
        <Text style={[Styles.text_regular, Styles.currentDate]}>{date}</Text>
    );
};

export default CurrentDate;