import React from 'react';
import { View, Text, StyleSheet, Button, useWindowDimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';


const SpaceInfo = () => {
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const topOffset = screenHeight * .2;
    const bottomOffset = screenHeight * .05;
    const propertyOffset = screenHeight * 0.0175;
    const titleSize = screenHeight * .045;
    const subtitleSize = screenHeight * .0325;
    const textSize = screenHeight * .0225;

    const colorScheme = {
        dark: "#181818",
        light: "#FFFFFF",
        free: "#71EB8C",
        busy: "#FF6567",
        container: "#2F2F2F",
    };

    const propertyStyle = [styles.property, { color: colorScheme.light, fontSize: textSize }];
    const textStyle = [styles.text, { color: colorScheme.light, marginHorizontal: 5, fontSize: textSize }];

    // Заглушка
    const properties = [
        { name: "Интерактивная доска" },
        { name: "Кондиционер" },
        { name: "Проветривание" },
        { name: "Маскирование звука" },
        { name: "Биодинамическое освещение" },
    ];

    return (
        <View style={{ marginTop: topOffset, flex: 1 }}>
            <Text style={[styles.title, { color: colorScheme.light, fontSize: titleSize }]}>Переговорная альфа</Text>
            {/* Вместимость */}
            <View style={styles.rowContainer}>
                <Text style={propertyStyle}>Вместимость:</Text>
                <Text style={textStyle}>до 15</Text>
                <Svg width={textSize} height={textSize} viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg" >
                    <Path
                        d="M19.166 17.25v-1.833a3.668 3.668 0 00-2.75-3.551m-3.208-10.85a3.668 3.668 0 010 6.8m1.375 9.434c0-1.709 0-2.563-.28-3.236a3.667 3.667 0 00-1.984-1.985c-.673-.279-1.528-.279-3.236-.279h-2.75c-1.708 0-2.563 0-3.237.28a3.667 3.667 0 00-1.984 1.984c-.279.673-.279 1.527-.279 3.236M11.375 4.417a3.667 3.667 0 11-7.334 0 3.667 3.667 0 017.334 0z"
                        stroke={colorScheme.light}
                        strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
                    />
                </Svg>
            </View>
            {/* Характеристики */}
            <View>
                <Text style={[propertyStyle, { paddingVertical: propertyOffset }]}>Характеристики:</Text>
                <View style={styles.propertiesContainer}>
                    {properties.map((item, i) => (
                        <View key={i} style={{
                            backgroundColor: colorScheme.container,
                            padding: textSize * .25,
                            borderRadius: textSize
                        }}>
                            <Text style={[textStyle, { fontSize: textSize * .8 }]}>{item.name}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Текущее бронирование */}
            <View style={{
                backgroundColor: colorScheme.container,
                bottom: propertyOffset,
                padding: textSize,
                borderRadius: textSize,
                position: "absolute",
                bottom: bottomOffset,
                width: "80%"
            }}>
                <Text style={[styles.text, { color: colorScheme.light, fontSize: subtitleSize }]}>Текущее бронирование</Text>
                <View style={[styles.rowContainer, {marginTop: textSize * .5}]}>
                    <Text style={propertyStyle}>Закончится через:</Text>
                    <Text style={textStyle}>5 мин</Text>
                </View>
                <View style={[styles.rowContainer, {marginTop: textSize * .5}]}>
                    <Text style={propertyStyle}>Тема:</Text>
                    <Text style={textStyle}>Daily toxic</Text>
                </View>
                <View style={[styles.rowContainer, {marginTop: textSize * .5}]}>
                    <Text style={propertyStyle}>Участники:</Text>
                    <Text style={textStyle}>5</Text>
                </View>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    title: {
        fontFamily: "Onest_600SemiBold",
        marginBottom: 16
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    property: {
        fontFamily: "Onest_500Medium",
        opacity: .3,
    },
    text: {
        fontFamily: "Onest_500Medium",
    },
    propertiesContainer: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        alignItems: "stretch",
        alignContent: "stretch",
        gap: 10
    },
});

export default SpaceInfo;