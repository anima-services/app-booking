import { Dimensions, Image, StyleSheet } from 'react-native';

import { useTheme } from './ThemeContext';

export const UserImage = ({ photoUrl, customStyle }) => {
    const { theme, toggleTheme } = useTheme();

    const styles = StyleSheet.create({
        userPhoto: {
            width: windowHeight * .04,
            height: windowHeight * .04,
            borderRadius: windowHeight * .04 / 2,
            backgroundColor: theme.light,
            overflow: "hidden",
            borderWidth: 1, 
            borderColor: theme.container,
        },
    });

    // Проверка на валидность photoUrl
    const isValidUrl = photoUrl && typeof photoUrl === 'string' && photoUrl.trim() !== '' && photoUrl.startsWith('http');
    return (
        <Image
            style={[customStyle, styles.userPhoto]}
            source={isValidUrl ? { uri: photoUrl } : require('../assets/icon.png')}
        />
    );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;