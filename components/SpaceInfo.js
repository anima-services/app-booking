import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useRoute } from '@react-navigation/native';

import { useSelector } from "react-redux";
import { useResponsiveSizes } from './hooks/useResponsiveSizes';
import { useSpaceData } from './hooks/useSpaceData';
import { useEventData } from './hooks/useEventData';

import Button from './Button';
import EventStatus from './EventStatus';
import { UserImage } from './UserCard';

const SpaceInfo = () => {
    const route = useRoute();
    const data = useSelector(state => state.data);
    const sizes = useResponsiveSizes();
    const spaceData = useSpaceData(data);
    const eventData = useEventData(data);
    const colorScheme = {
        dark: "#181818",
        light: "#FFFFFF",
        free: "#71EB8C",
        busy: "#FF6567",
        container: "#2F2F2F",
    };
    const propertyStyle = [styles.property, { color: colorScheme.light, fontSize: sizes.textSize }];
    const textStyle = [styles.text, { color: colorScheme.light, marginHorizontal: 5, fontSize: sizes.textSize }];
    return (
        <View style={{ marginTop: sizes.topOffset, flex: 1 }}>
            <Text style={[styles.title, { color: colorScheme.light, fontSize: sizes.titleSize }]}>{spaceData.title}</Text>
            {/* Вместимость */}
            <View style={[styles.rowContainer, { display: spaceData.quantity ? "flex" : "none" }]}>
                <Text style={propertyStyle}>Вместимость:</Text>
                <Text style={textStyle}>{spaceData.quantity}</Text>
                <Svg width={sizes.textSize} height={sizes.textSize} viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg" >
                    <Path
                        d="M19.166 17.25v-1.833a3.668 3.668 0 00-2.75-3.551m-3.208-10.85a3.668 3.668 0 010 6.8m1.375 9.434c0-1.709 0-2.563-.28-3.236a3.667 3.667 0 00-1.984-1.985c-.673-.279-1.528-.279-3.236-.279h-2.75c-1.708 0-2.563 0-3.237.28a3.667 3.667 0 00-1.984 1.984c-.279.673-.279 1.527-.279 3.236M11.375 4.417a3.667 3.667 0 11-7.334 0 3.667 3.667 0 017.334 0z"
                        stroke={colorScheme.light}
                        strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
                    />
                </Svg>
            </View>
            {/* Характеристики */}
            <View style={{ display: spaceData.properties.length > 0 ? "flex" : "none" }}>
                <Text style={[propertyStyle, { paddingVertical: sizes.propertyOffset }]}>Характеристики:</Text>
                <View style={styles.propertiesContainer}>
                    {spaceData.properties.map((item, i) => (
                        <View key={i} style={{
                            backgroundColor: colorScheme.container,
                            padding: sizes.textSize * .25,
                            borderRadius: sizes.textSize
                        }}>
                            <Text style={[textStyle, { fontSize: sizes.textSize * .8 }]}>{item.name}</Text>
                        </View>
                    ))}
                </View>
            </View>
            {/* Текущее бронирование */}
            <View style={{
                backgroundColor: colorScheme.container,
                padding: sizes.textSize,
                paddingBottom: sizes.textSize * .25,
                borderRadius: sizes.textSize,
                position: "absolute",
                bottom: sizes.bottomOffset,
                width: "80%",
                display: eventData.show ? "flex" : "none"
            }}>
                <Text style={[styles.text, { color: colorScheme.light, fontSize: sizes.subtitleSize }]}>{{
                    true: "Текущее бронирование",
                    false: "Ближайшее бронирование"
                }[eventData.isCurrent]}</Text>
                <View style={[styles.rowContainer, { marginTop: sizes.textSize * .5 }]}>
                    <Text style={propertyStyle}>{{
                        true: "Закончится через:",
                        false: "Начнется через:"
                    }[eventData.isCurrent]}</Text>
                    <Text style={textStyle}>{
                        `${eventData.isCurrent ? eventData.timeUntilEnd : eventData.timeUntilStart} мин`
                    }</Text>
                </View>
                <View style={[styles.rowContainer, { marginTop: sizes.textSize * .5 }]}>
                    <Text style={propertyStyle}>Тема:</Text>
                    <Text style={textStyle}>{eventData.topic}</Text>
                </View>
                <View style={[styles.rowContainer, { marginTop: sizes.textSize * .5 }]}>
                    <Text style={propertyStyle}>Участники:</Text>
                    <Text style={textStyle}>{eventData.participants_info.length}</Text>
                    {eventData.participants_info.map((item, i) =>
                        <UserImage key={i} photoUrl={item.photo} customStyle={i > 0 ? { marginLeft: -sizes.textSize } : {}} />
                    )}
                </View>
                {route.name != "Config" && eventData.status === "reserved" ?
                    <Button
                        title="Подтвердить" onPress={() => navigation.navigate('Config')}
                    />
                    :
                    <EventStatus
                        status={eventData.status}
                    />
                }
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