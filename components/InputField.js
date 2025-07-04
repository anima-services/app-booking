import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, useWindowDimensions } from 'react-native';


const InputField = ({ name, placeholder, inputMode, secureTextEntry = false, }) => {
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const textSize = screenHeight * .02;

    const colorScheme = {
        dark: "#181818",
        light: "#FFFFFF",
        free: "#71EB8C",
        busy: "#FF6567",
        container: "#2F2F2F",
        lightGray: "#808080",
    };

    const propertyStyle = [styles.property, { color: colorScheme.light, fontSize: screenHeight * 0.0125 }];
    const inputStyle = [styles.text, { 
        color: colorScheme.light, fontSize: textSize, 
        includeFontPadding: false, padding: 0, margin: 0,
        height: textSize * 2
    }];

    const [focused, setFocused] = useState(false);
    const [text, setText] = useState('');

    return (
        <View style={{
            backgroundColor: colorScheme.container,
            paddingHorizontal: textSize,
            paddingVertical: textSize * .5,
            borderRadius: textSize,
            marginBottom: textSize * .5,
            flex: 1,
        }}>
            <Text style={propertyStyle}>{name}</Text>
            <TextInput
                style={inputStyle}
                placeholderTextColor={colorScheme.lightGray}
                selectionColor={colorScheme.light}
                cursorColor={colorScheme.light}
                placeholder={placeholder}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                value={text}
                onChangeText={setText}
                underlineColorAndroid="transparent"
                inputMode={inputMode}
                secureTextEntry={secureTextEntry}
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