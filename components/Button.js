import { StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { useTheme } from './ThemeContext';

const Button = ({ title, disabled = false, onPress, style }) => {
    const { theme, toggleTheme } = useTheme();
    const { height: screenHeight } = Dimensions.get('window');
    const textSize = screenHeight * .0225;
    const borderRadius = screenHeight * .02;

    return (
        <TouchableOpacity
            style={[styles.button, {
                padding: textSize * .8,
                borderRadius: borderRadius,
                marginVertical: textSize * .5,
                backgroundColor: disabled ? theme.container : theme.free,
            }, style]}
            onPress={!disabled ? onPress : null}
        >
            <Text style={[styles.buttonText, {
                fontSize: textSize, opacity: disabled ? .3 : 1,
                color: disabled ? theme.light : theme.dark
            }]}>{title}</Text>
        </TouchableOpacity>
    );
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