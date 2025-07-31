import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions } from 'react-native';
import { useTheme } from './ThemeContext';


const InputField = ({ name, placeholder, inputMode, secureTextEntry = false, setText, value, disabled = false }) => {
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
    const textSize = screenHeight * .02;
    const { theme, toggleTheme } = useTheme();

    const propertyStyle = [styles.property, { color: theme.light, fontSize: screenHeight * 0.0125 }];
    const inputStyle = [styles.text, {
        color: theme.light, fontSize: textSize,
        includeFontPadding: false, padding: 0, margin: 0,
        flex: 1,
        opacity: disabled ? .3 : 1,
    }];

    const [focused, setFocused] = useState(false);

    return (
        <View style={{
            backgroundColor: theme.container,
            paddingHorizontal: textSize,
            paddingVertical: textSize * .5,
            borderRadius: textSize,
            marginBottom: textSize * .5,
            height: textSize * 4,
            flex: 1
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