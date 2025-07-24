import { View, StyleSheet } from 'react-native';

import { useResponsiveSizes } from './hooks/useResponsiveSizes';

const ColumnScreen = ({ leftContent, rightContent }) => {
    const sizes = useResponsiveSizes();

    const columnStyle = [styles.column, {
        marginHorizontal: sizes.windowWidth*.025,
        marginVertical: sizes.windowHeight*.05,
    }];

    const containerStyle = [styles.container, {
       
    }];

    return (
        <View style={containerStyle}>
            {/* Левая колонка */}
            <View style={columnStyle}>
                {leftContent}
            </View>
            {/* Правая колонка */}
            <View style={columnStyle}>
                {rightContent}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    column: {
        flex: 1,
        // height: '90%',
        // width: '45%',
        // marginHorizontal: '2.5%',
        // marginTop: '5%',

        // Отладка:
        // backgroundColor: "yellow",
        // opacity: .5,
    },
});

export default ColumnScreen;