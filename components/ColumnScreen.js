import { View, StyleSheet } from 'react-native';

import { useResponsiveSizes } from './hooks/useResponsiveSizes';

const ColumnScreen = ({ leftContent, rightContent }) => {
    const sizes = useResponsiveSizes();

    const columnStyle = [styles.column, {
        marginHorizontal: sizes.windowWidth*.025,
        marginVertical: sizes.windowHeight*.05,
    }];

    const containerStyle = [styles.container, {
        flexDirection: sizes.type === 'landscape' ? 'row' : 'column',
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
    },
    column: {
        flex: 1,
    },
});

export default ColumnScreen;