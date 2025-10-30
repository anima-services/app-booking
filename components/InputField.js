import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions } from 'react-native';
import { useTheme } from './ThemeContext';
import { useResponsiveSizes } from './hooks/useResponsiveSizes';

const InputField = ({ name, placeholder, inputMode, secureTextEntry = false, setText, value, disabled = false }) => {
    const sizes = useResponsiveSizes();
    const { theme, toggleTheme } = useTheme();

    const propertyStyle = [styles.property, { color: theme.light, fontSize: sizes.windowHeight * 0.0125 }];
    const inputStyle = [styles.text, {
        color: theme.light, fontSize: sizes.text_2,
        includeFontPadding: false, padding: 0, margin: 0,
        flex: 1,
        opacity: disabled ? .3 : 1,
    }];

    const [focused, setFocused] = useState(false);

    return (
        <View style={{
            backgroundColor: theme.container,
            paddingHorizontal: sizes.text_2,
            paddingVertical: sizes.text_2 * .5,
            borderRadius: sizes.text_2,
            marginBottom: sizes.text_2 * .5,
            height: sizes.text_2 * 4,
            flex: 1,
            borderWidth: disabled ? 0 : StyleSheet.hairlineWidth,
            borderColor: theme.free,
        }}>
            <Text style={[propertyStyle, { display: value ? 'flex' : 'none' }]}>{name}</Text>
            <TextInput
                style={inputStyle}
                placeholderTextColor={theme.lightGray}
                cursorColor={theme.light}
                placeholder={placeholder}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                value={value}
                onChangeText={setText}
                underlineColorAndroid="transparent"
                inputMode={inputMode}
                secureTextEntry={secureTextEntry}
                editable={!disabled}
                selectTextOnFocus={!disabled}
                contextMenuHidden={disabled} // For iOS
                caretHidden={disabled}
                disableFullscreenUI={true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    property: {
        fontFamily: "Onest_500Medium",
        opacity: .3,
    },
    text: {
        fontFamily: "Onest_500Medium",
    },
});

export default InputField;