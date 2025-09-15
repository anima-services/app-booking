import { StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { useTheme } from './ThemeContext';
import { useResponsiveSizes } from './hooks/useResponsiveSizes';

const Button = ({ title, disabled = false, onPress, style }) => {
    const { theme, toggleTheme } = useTheme();
    const sizes = useResponsiveSizes();
    const borderRadius = sizes.windowHeight * .02;

    return (
        <TouchableOpacity
            style={[styles.button, {
                padding: sizes.textSize * .8,
                borderRadius: borderRadius,
                marginVertical: sizes.textSize * .5,
                backgroundColor: disabled ? theme.container : theme.free,
            }, style]}
            onPress={!disabled ? onPress : null}
        >
            <Text style={[styles.buttonText, {
                fontSize: sizes.textSize, opacity: disabled ? .3 : 1,
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