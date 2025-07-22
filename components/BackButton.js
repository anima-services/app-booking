import { StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Path } from "react-native-svg"

import { useNavigation } from '@react-navigation/native';

const BackButton = () => {
    const navigation = useNavigation();

    const { height: screenHeight } = Dimensions.get('screen');
    const buttonSize = screenHeight * .02;

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate('Home')}
            // onPress={() => navigation.goBack()}
            style={[styles.button, { width: buttonSize, height: buttonSize }]}>
            <Svg
                width="100%"
                height="100%"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <Path
                    d="M17 1L1 17M1 1l16 16"
                    stroke="#fff"
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