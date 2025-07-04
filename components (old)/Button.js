import React from "react";
import { Text, Pressable, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Styles } from '../utils/styles';

const Button = (props) => {
    const animated = new Animated.Value(1);

    const fadeIn = () => {
        Animated.timing(animated, {
            toValue: 0.4,
            duration: 10,
            useNativeDriver: true,
        }).start();
    };
    const fadeOut = () => {
        Animated.timing(animated, {
            toValue: 1,
            duration: 10,
            useNativeDriver: true,
        }).start();
    };

    function Press() {
        try {
            props.onPress();
        } catch (e) {
            console.log('Button: не удалось выполнить функцию в кнопке!');
            console.log(e);
        }
    }

    return (
        <Pressable
            onPressIn={fadeIn}
            onPressOut={fadeOut}
            onPress={Press}
        >
            <Animated.View style={{ opacity: props.status ? 0.5 : animated }}>
                <LinearGradient
                    colors={Styles.primaryGradient.colors}
                    start={Styles.primaryGradient.start}
                    end={Styles.primaryGradient.end}
                    style={Styles.button_primary}
                >
                    <Text style={[Styles.text_h2, { color: 'white' }]}>{props.title}</Text>
                </LinearGradient>
            </Animated.View>
        </Pressable >
    );
};

export default Button;