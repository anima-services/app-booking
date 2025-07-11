import { StyleSheet, useWindowDimensions, TouchableOpacity, Text } from 'react-native';

const Button = ({ title, disabled = false, onPress }) => {
    const { height: screenHeight } = useWindowDimensions();
    const textSize = screenHeight * .0225;
    const borderRadius = screenHeight * .02;

    return (
        <TouchableOpacity
            style={[styles.button, {
                padding: textSize * .8,
                borderRadius: borderRadius,
                marginVertical: textSize * .5
            }]}
            onPress={onPress}
        >
            <Text style={[styles.buttonText, { fontSize: textSize }]}>{title}</Text>
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
        backgroundColor: colorScheme.free,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontFamily: 'Onest_500Medium',
        color: colorScheme.dark,
    },
});

export default Button;