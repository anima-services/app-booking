import { StyleSheet, useWindowDimensions, TouchableOpacity, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

const EventStatus = ({ status, onPress }) => {
    const { height: screenHeight } = useWindowDimensions();
    const textSize = screenHeight * .0175;
    const borderRadius = screenHeight * .02;

    const statusName = {
        "reserved": "Подтверждается",
        "approved": "Подтверждено",
        "canceled": "Отменен",
        "automatically_canceled": "Отменен автоматически",
        "finished": "Завершено",
    }

    return (
        <TouchableOpacity
            style={[styles.button, { paddingHorizontal: textSize * .8, paddingVertical: textSize * .5, borderRadius: borderRadius, marginVertical: textSize * .5 }]}
            onPress={onPress}
        >
            <View style={styles.rowContainer}>
                <Svg
                    width={textSize}
                    height={textSize}
                    viewBox="0 0 22 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ marginRight: textSize * .5, display: status === "reserved" ? "flex" : "none" }}
                >
                    <Circle cx={3} cy={3} r={3} fill={colorScheme.container} />
                    <Circle opacity={0.55} cx={11} cy={3} r={3} fill={colorScheme.container} />
                    <Circle opacity={0.2} cx={19} cy={3} r={3} fill={colorScheme.container} />
                </Svg>
                <Svg
                    width={textSize}
                    height={textSize}
                    viewBox="0 0 15 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ marginRight: textSize * .5, display: status === "approved" ? "flex" : "none" }}
                >
                    <Path
                        d="M14.167 7.39v.613a6.667 6.667 0 11-3.953-6.093m3.953.756L7.501 9.34l-2-2"
                        stroke={colorScheme.container}
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </Svg>
                <Text style={[styles.buttonText, { fontSize: textSize }]}>{statusName[status]}</Text>
            </View>
        </TouchableOpacity>
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
    button: {
        backgroundColor: colorScheme.light,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: "flex-start"
    },
    buttonText: {
        fontFamily: 'Onest_500Medium',
        color: colorScheme.dark,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default EventStatus;