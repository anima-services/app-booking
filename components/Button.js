import { StyleSheet, useWindowDimensions, TouchableOpacity, Text } from 'react-native';

const Button = ({ title, disabled = false, onPress, style }) => {
    const { height: screenHeight } = useWindowDimensions();
    const textSize = screenHeight * .0225;
    const borderRadius = screenHeight * .02;

    return (
        <TouchableOpacity
            style={[styles.button, {
                padding: textSize * .8,
                borderRadius: borderRadius,
                marginVertical: textSize * .5,
                backgroundColor: disabled ? colorScheme.container : colorScheme.free,
            }, style]}
            onPress={!disabled ? onPress : null}
        >
            <Text style={[styles.buttonText, {
                fontSize: textSize, opacity: disabled ? .3 : 1,
                color: disabled ? colorScheme.light : colorScheme.dark
            }]}>{title}</Text>
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
    },
    buttonText: {
        fontFamily: 'Onest_500Medium',
    },
});

export default Button;