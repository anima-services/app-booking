import { View, StyleSheet } from 'react-native';

const ColumnScreen = ({ leftContent, rightContent }) => {
    return (
        <View style={styles.container}>
            {/* Левая колонка */}
            <View style={[styles.column, {}]}>
                {leftContent}
            </View>
            {/* Правая колонка */}
            <View style={[styles.column, {}]}>
                {rightContent}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        width: "100%",
        height: "100%",
        flexDirection: 'row',
    },
    column: {
        height: '90%',
        width: '45%',
        marginHorizontal: '2.5%',
        marginTop: '5%',

        // Отладка:
        // backgroundColor: "yellow",
        // opacity: .5,
    },

    buttonContainer: {
        width: '70%',
        borderRadius: 10,
        overflow: 'hidden',
    },
});

export default ColumnScreen;