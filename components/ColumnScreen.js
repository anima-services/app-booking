import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { useResponsiveSizes } from './hooks/useResponsiveSizes';
import { useTheme } from './ThemeContext';

const ColumnScreen = ({ leftContent, rightContent, pages = [leftContent, rightContent] }) => {
    const sizes = useResponsiveSizes();
    const { theme, toggleTheme } = useTheme();
    const [columnSelected, selectColumn] = useState(0);

    const columnStyle = [styles.column, {
        marginHorizontal: sizes.windowWidth * (sizes.type === 'landscape' ? .025 : .15),
        marginVertical: sizes.windowHeight * .025,
    }];

    const containerStyle = [styles.container, {
        flexDirection: sizes.type === 'landscape' ? 'row' : 'column',
    }];

    const squareStyle = [styles.container, {
        margin: sizes.windowHeight * .025,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 10,
    }];

    if (sizes.type === 'square') {
        return (
            <View style={{ flex: 1 }}>
                <View style={squareStyle}>{pages[columnSelected]}</View>
                <View style={{ flex: 1.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: sizes.subtitleSize, opacity: .5 }}>
                    {pages.length > 1 && pages.map((item, i) => (
                        <TouchableOpacity key={i} onPress={() => selectColumn(i)} style={{
                            width: columnSelected !== i ? sizes.subtitleSize : sizes.subtitleSize * .8,
                            height: columnSelected !== i ? sizes.subtitleSize : sizes.subtitleSize * .8,
                            borderRadius: columnSelected !== i ? sizes.subtitleSize * .5 : sizes.subtitleSize * .4,
                            backgroundColor: columnSelected === i ? theme.light : theme.lightGray,
                        }} />
                    ))}
                </View>
            </View>
        );
    }

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