import React, { useState, useEffect, useRef } from "react";
import {
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Text,
    View,
    Dimensions,
} from 'react-native';
import Svg, { Circle, Path, G } from "react-native-svg"
import { useResponsiveSizes } from './hooks/useResponsiveSizes';
import { useTheme } from "./ThemeContext";
import { UserImage } from "./UserCard";

const Dropdown = ({ name, data = [], placeholder, pictureTag, textTag, attributeTag, maxItems = 1, onSelect, onTextChange }) => {
    const sizes = useResponsiveSizes();
    const { theme, toggleTheme } = useTheme();
    const [text, setText] = useState("");
    const [list, setList] = useState([]);
    const [selected, setSelected] = useState([]);
    const [formattedData, setFormatted] = useState([]);
    const [showList, setShowList] = useState(false);
    const [buttonLayout, setButtonLayout] = useState({
        x: 0, y: 0, width: 0, height: 0
    });
    const screenHeight = Dimensions.get('window').height;

    const buttonRef = useRef(null);

    const handleShowList = () => {
        setShowList(true);
        setText("");
        onTextChange("");
    };

    const handleTextChange = (newText) => {
        setText(newText);
        if (onTextChange) {
            onTextChange(newText);
        }
    };

    const formatItem = (item) => {
        return {
            [textTag]: item[textTag],
            [pictureTag]: item[pictureTag],
            [attributeTag]: item[attributeTag],
            "origin": item,
            "selected": false
        };
    };

    useEffect(() => {
        const selectedIds = new Set(selected.map(item => item.id));
        
        const formattedSelected = selected
            .filter(item => item.id != null)
            .map(formatItem)
            .map(item => ({ ...item, selected: true }));
        
        const dataArray = Array.isArray(data) ? data : [];
        const formattedDataItems = dataArray
            .filter(item => !selectedIds.has(item.id))
            .map(formatItem);
        
        const combined = [...formattedSelected, ...formattedDataItems];
        
        setFormatted(combined);
    }, [data, textTag, pictureTag, attributeTag, selected])
    
    useEffect(() => {
        const sorted = [...formattedData].sort((a, b) => {
            if (a.selected === b.selected) return 0;
            return a.selected ? -1 : 1;
        });
        setList(sorted);
    }, [formattedData])

    const selectItem = (in_item) => {
        const currentSelectedIds = new Set(selected.map(item => item.id));
        const itemId = in_item.origin.id;
        const isCurrentlySelected = currentSelectedIds.has(itemId);
        
        let newSelected;
        if (isCurrentlySelected) {
            newSelected = selected.filter(item => item.id !== itemId);
        } else {
            if (selected.length >= maxItems) {
                newSelected = selected.slice(1);
            } else {
                newSelected = [...selected];
            }
            newSelected.push(in_item.origin);
        }
        
        setSelected(newSelected);
        setText("");
        
        if (onSelect) {
            onSelect(newSelected);
        }
        
        if (newSelected.length >= maxItems) {
            setShowList(false);
        }
    }


    // Рассчитываем позицию для списка
    const listTop = buttonLayout.y + buttonLayout.height + sizes.text_2 * 0.5;
    const maxListHeight = screenHeight - listTop - sizes.text_2;
    const listHeight = Math.min(maxListHeight, sizes.text_2 * 15);

    const styles = StyleSheet.create({
        overlay: {
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 9,
        },
        listContainer: {
            position: 'absolute',
            padding: sizes.text_2 * .5,
            borderRadius: sizes.text_2,
            backgroundColor: theme.container,
        },
        searchContainer: {
            flex: 1
        },
        inputStyle: {
            color: theme.light,
            includeFontPadding: false,
            padding: 0,
            margin: 0,
            flex: 1,
            opacity: 1,
            fontFamily: "Onest_500Medium",
        },
        rowContainer: {
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center'
        },
        text: {
            fontFamily: "Onest_500Medium",
            color: theme.light,
            fontSize: sizes.textSize
        },
    });

    return (
        <>
            <TouchableOpacity
                ref={buttonRef}
                onPress={handleShowList}
                onLayout={(event) => {
                    const { x, y, width, height } = event.nativeEvent.layout;
                    setButtonLayout({ x, y, width, height });
                }}
                style={[styles.rowContainer, {
                    backgroundColor: theme.container,
                    paddingHorizontal: sizes.text_2,
                    paddingVertical: sizes.text_2 * .5,
                    borderRadius: sizes.text_2,
                    borderWidth: StyleSheet.hairlineWidth,
                    borderColor: theme.free,
                    marginBottom: sizes.text_2 * .5,
                    height: sizes.text_2 * 4,
                    gap: sizes.text_2,
                }]}>
                <Text style={[styles.text, { fontSize: sizes.text_2 }]}>{name}</Text>
                <Text style={[styles.text, { fontSize: sizes.text_2, opacity: .3 }]}>
                    {`Выбрано: ${selected.length}${maxItems < 100 ? "/" + maxItems : ""}`}
                </Text>
                <Svg
                    width={sizes.text_2}
                    height={sizes.text_2}
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ position: "absolute", right: sizes.text_2 }}
                >
                    <G transform={showList ? "rotate(180, 10, 10)" : "rotate(0, 10, 10)"}>
                        <Path
                            d="M5 7.5l5 5 5-5"
                            stroke="#fff"
                            strokeWidth={1.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </G>
                </Svg>
            </TouchableOpacity>
            {showList && (<>
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={() => setShowList(false)}
                />
                <View
                    style={[
                        styles.listContainer,
                        {
                            top: listTop,
                            width: buttonLayout.width,
                            maxHeight: listHeight,
                            zIndex: 10,
                        }
                    ]}>
                    <ScrollView style={{ flex: 1 }}>
                        {list.map((item, i) => {
                            const isSelected = item.selected;
                            return (
                                <TouchableOpacity
                                    key={`${item.origin.id || i}-${isSelected}`}
                                    style={[styles.rowContainer, {
                                        marginTop: sizes.text_2 * .5,
                                        gap: sizes.text_2 * .5,
                                        borderRadius: sizes.text_2 * 0.5,
                                    }]}
                                    onPress={() => { selectItem(item) }}
                                >
                                    <UserImage photoUrl={item[pictureTag]} />
                                    <Text style={styles.text}>
                                        {item[textTag]}
                                    </Text>
                                    <View style={{
                                        backgroundColor: theme.lightContainer,
                                        paddingHorizontal: sizes.text_2 * .5,
                                        paddingVertical: sizes.text_2 * .25,
                                        borderRadius: sizes.text_2,
                                    }}>
                                        <Text style={styles.text}>
                                            {item[attributeTag]}
                                        </Text>
                                    </View>
                                    <Svg
                                        width={sizes.text_2 * 1.5}
                                        height={sizes.text_2 * 1.5}
                                        viewBox="0 0 28 28"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        style={{ position: "absolute", right: 0 }}
                                    >
                                        <Circle cx={14} cy={14} r={14} fill="#4F4F4F" />
                                        <Path
                                            opacity={isSelected ? 1 : 0.12}
                                            d="M8 14l4.333 4.5L21 9.5"
                                            stroke="#fff"
                                            strokeWidth={1.5}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </Svg>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                    <View style={[
                        styles.searchContainer,
                        {
                            backgroundColor: theme.lightContainer,
                            paddingHorizontal: sizes.text_2,
                            paddingVertical: sizes.text_2 * .5,
                            borderRadius: sizes.text_2,
                            marginVertical: sizes.text_2 * .25,
                            height: sizes.text_2 * 4,
                        }
                    ]}>
                        <TextInput
                            style={[styles.inputStyle, { fontSize: sizes.text_2 }]}
                            placeholderTextColor={theme.lightGray}
                            selectionColor={theme.light}
                            cursorColor={theme.light}
                            placeholder={placeholder}
                            value={text}
                            onChangeText={handleTextChange}
                            underlineColorAndroid="transparent"
                            inputMode="text"
                            autoFocus={false}
                            disableFullscreenUI={true}
                        />
                    </View>
                </View>
            </>)}
        </>
    );
};

export default Dropdown;