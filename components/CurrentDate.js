import { StyleSheet, View, Text } from 'react-native';
import { useState, useEffect } from 'react';

import { useResponsiveSizes } from './hooks/useResponsiveSizes';

const CurrentDate = ({style}) => {
    const sizes = useResponsiveSizes();
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Форматирование даты
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const dateStr = `${day}.${month}`;
    const daysShort = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const weekdayStr = daysShort[now.getDay()];
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;

    return (
        <View style={[styles.container, style]}>
            <Text style={[styles.text, { fontSize: sizes.textSize }]}>{dateStr}</Text>
            <Text style={[styles.text, {
                fontSize: sizes.textSize,
                opacity: .5,
                marginLeft: sizes.textSize * .2
            }]}>{weekdayStr}</Text>
            <View style={{
                width: sizes.textSize * .2,
                height: sizes.textSize * .2,
                borderRadius: sizes.textSize * .1,
                backgroundColor: colorScheme.light,
                marginHorizontal: sizes.textSize * .2
            }} />
            <Text style={[styles.text, { fontSize: sizes.textSize }]}>{timeStr}</Text>
        </View>
    );
};

const colorScheme = {
    dark: "#181818",
    light: "#FFFFFF",
    free: "#71EB8C",
    busy: "#FF6567",
    container: "#2F2F2F",
};

const styles = StyleSheet.create({
    text: {
        color: colorScheme.light,
        fontFamily: "Onest_500Medium",
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default CurrentDate;