import { StyleSheet, Dimensions, TouchableOpacity, Text, View } from 'react-native';
import Svg, { Circle, Path, G } from 'react-native-svg';

import { useTheme } from './ThemeContext';
import { useResponsiveSizes } from './hooks/useResponsiveSizes';

const EventStatus = ({ text, icon, onPress, style, busyColored = false, isBusy }) => {
    const sizes = useResponsiveSizes();
    const { theme, toggleTheme } = useTheme();
    const textSize = sizes.windowHeight * .0175;
    const borderRadius = sizes.windowHeight * .02;

    return (
        <TouchableOpacity
            style={[styles.button, {
                backgroundColor: busyColored
                    ? isBusy ? theme.busy : theme.free
                    : theme.light,
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
                    <Circle cx={3} cy={3} r={3} fill={theme.container} />
                    <Circle opacity={0.55} cx={11} cy={3} r={3} fill={theme.container} />
                    <Circle opacity={0.2} cx={19} cy={3} r={3} fill={theme.container} />
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
                        stroke={theme.container}
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
                            stroke={theme.dark}
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
                    backgroundColor: theme.light,
                    marginRight: textSize * .5,
                    display: isBusy ? "flex" : "none"
                }} />
                <Text style={[styles.buttonText, {
                    color: isBusy ? theme.light : theme.dark,
                    fontSize: textSize
                }]}>{text}</Text>
            </View>
        </TouchableOpacity>
    );
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