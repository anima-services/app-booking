import { StyleSheet, Dimensions, TouchableOpacity, Text, View } from 'react-native';
import Svg, { Circle, Path, G } from 'react-native-svg';

const EventStatus = ({ text, icon, onPress, style, busyColored = false, isBusy }) => {
    const { height: screenHeight } = Dimensions.get('window');
    const textSize = screenHeight * .0175;
    const borderRadius = screenHeight * .02;

    return (
        <TouchableOpacity
            style={[styles.button, {
                backgroundColor: busyColored
                    ? isBusy ? colorScheme.busy : colorScheme.free
                    : colorScheme.light,
                paddingHorizontal: textSize * .8,
                paddingVertical: textSize * .5,
                borderRadius: borderRadius,
                marginVertical: textSize * .5
            }, style]}
            onPress={onPress}
        >
            <View style={styles.rowContainer}>
                <Svg
                    width={textSize}
                    height={textSize}
                    viewBox="0 0 22 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ marginRight: textSize * .5, display: icon === "reserved" ? "flex" : "none" }}
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
                    style={{ marginRight: textSize * .5, display: icon === "approved" ? "flex" : "none" }}
                >
                    <Path
                        d="M14.167 7.39v.613a6.667 6.667 0 11-3.953-6.093m3.953.756L7.501 9.34l-2-2"
                        stroke={colorScheme.container}
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </Svg>
                <Svg
                    width={textSize*1.2}
                    height={textSize*1.2}
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ marginRight: textSize * .5, display: busyColored && !isBusy ? "flex" : "none" }}
                >
                    <G clipPath="url(#clip0_797_1913)">
                        <Path
                            d="M8 4v4l2.667 1.333m4-1.333A6.667 6.667 0 111.334 8a6.667 6.667 0 0113.333 0z"
                            stroke={colorScheme.dark}
                            strokeWidth={1.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </G>
                </Svg>
                <View style={{
                    width: textSize * .8,
                    height: textSize * .8,
                    borderRadius: textSize * .4,
                    backgroundColor: colorScheme.light,
                    marginRight: textSize * .5,
                    display: isBusy ? "flex" : "none"
                }} />
                <Text style={[styles.buttonText, {
                    color: isBusy ? colorScheme.light : colorScheme.dark,
                    fontSize: textSize
                }]}>{text}</Text>
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
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: "flex-start"
    },
    buttonText: {
        fontFamily: 'Onest_500Medium',
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default EventStatus;