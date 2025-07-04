import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const GridContainer = ({ children }) => {
    const childrenArray = React.Children.toArray(children);
    const itemWidth = width / Math.min(childrenArray.length, 2);
    const itemHeight = height / Math.ceil(childrenArray.length / 2);

    return (
        <View style={styles.container}>
            {childrenArray.map((child, index) => (
                <View key={index} style={[styles.item, { width: itemWidth, height: itemHeight }]}>
                    {child}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        //flexDirection: 'row',
        flexWrap: 'wrap',
    },
    item: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default GridContainer