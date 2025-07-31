import { StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Path } from "react-native-svg"

import { useTheme } from './ThemeContext';

const BackButton = ({ goBack }) => {

    const { height: screenHeight } = Dimensions.get('window');
    const buttonSize = screenHeight * .05;
    const { theme, toggleTheme } = useTheme();

    return (
        <TouchableOpacity
            onPress={goBack}
            style={[styles.button, { width: buttonSize, height: buttonSize, marginTop: buttonSize*.8 }]}>
            <Svg
                width="100%"
                height="100%"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <Path
                    d="M17 1L1 17M1 1l16 16"
                    stroke={theme.light}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </Svg>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        position: "absolute",
        top: 0,
        right: 0
    },
});

export default BackButton;