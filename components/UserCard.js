import { Dimensions, Image, StyleSheet } from 'react-native';

export const UserImage = ({ photoUrl, customStyle }) => {
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

const colorScheme = {
    dark: "#181818",
    light: "#FFFFFF",
    free: "#71EB8C",
    busy: "#FF6567",
    container: "#2F2F2F",
};

const styles = StyleSheet.create({
    userPhoto: {
        width: windowHeight * .04,
        height: windowHeight * .04,
        borderRadius: windowHeight * .04 / 2,
        backgroundColor: colorScheme.light,
        overflow: "hidden",
        borderWidth: 1, 
        borderColor: colorScheme.container,
    },
});