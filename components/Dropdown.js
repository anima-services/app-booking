import React, { useState, useEffect, useRef } from "react";
import {
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Text,
    View,
    Dimensions
} from 'react-native';
import Svg, { Circle, Path } from "react-native-svg"
import { useResponsiveSizes } from './hooks/useResponsiveSizes';
import { UserImage } from "./UserCard";

const Dropdown = ({ name, data = [], placeholder, pictureTag, textTag, attributeTag, maxItems = 1, onSelect }) => {
    const sizes = useResponsiveSizes();
    const [focused, setFocused] = useState(false);
    const [text, setText] = useState("");
    const [list, setList] = useState(data);
    const [selected, setSelected] = useState([]);
    const [showList, setShowList] = useState(false);
    const [buttonLayout, setButtonLayout] = useState({
        x: 0, y: 0, width: 0, height: 0
    });
    const screenHeight = Dimensions.get('window').height;

    const buttonRef = useRef(null);

    const handleShowList = () => {
        if (!Array.isArray(data) || data.length === 0) return;
        setShowList(true);
        setText("");
    };

    useEffect(() => {
        if (!Array.isArray(data)) {
            onSelect([]);
            return;
        }

        const validSelected = selected.filter(index =>
            index >= 0 && index < data.length
        );

        onSelect(validSelected.map(index => data[index]));
    }, [selected, data, onSelect]);

    useEffect(() => {
        if (!Array.isArray(data)) return;
        setList(data.filter((item, i) => {
            let _text = item[textTag];
            let _picture = item[pictureTag];
            let _attribute = item[attributeTag];

            if (_text == null || _text == "-") return false;

            const _byText = _text.toLowerCase().includes(text.toLowerCase());
            const _byAttribute = _attribute?.toLowerCase().includes(text.toLowerCase());
            if (!_byText && !_byAttribute) return false;

            return true;
        }));
    }, [text, data, textTag, attributeTag, pictureTag]);

    const handleSelect = (index) => {
        setSelected((prev) => {
            const alreadySelected = prev.includes(index);
            if (alreadySelected) {
                return prev.filter(i => i !== index);
            } else {
                if (prev.length >= maxItems) {
                    return [...prev.slice(1), index];
                } else {
                    const _array = [...prev, index];
                    if (_array.length === maxItems) setShowList(false);
                    return _array;
                }
            }
        });
    };

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
            backgroundColor: colorScheme.container,
        },
        searchContainer: {
            flex: 1
        },
        inputStyle: {
            color: colorScheme.light,
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
            color: colorScheme.light,
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
                    backgroundColor: colorScheme.container,
                    paddingHorizontal: sizes.text_2,
                    paddingVertical: sizes.text_2 * .5,
                    borderRadius: sizes.text_2,
                    marginBottom: sizes.text_2 * .5,
                    height: sizes.text_2 * 4,
                    gap: sizes.text_2,
                }]}>
                <Text style={[styles.text, { fontSize: sizes.text_2 }]}>{name}</Text>
                <Text style={[styles.text, { fontSize: sizes.text_2, opacity: .3 }]}>{`Выбрано: ${selected.length}/${maxItems}`}</Text>
                <Svg
                    width={sizes.text_2}
                    height={sizes.text_2}
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ position: "absolute", right: sizes.text_2 }}
                >
                    <Path
                        d="M5 7.5l5 5 5-5"
                        stroke="#fff"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </Svg>
            </TouchableOpacity>
            {showList && (<>
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={() => setShowList(false)}
                />
                <View style={[
                    styles.listContainer,
                    {
                        top: listTop,
                        width: buttonLayout.width,
                        maxHeight: listHeight,
                        zIndex: 10,
                    }
                ]}>
                    <View style={[
                        styles.searchContainer,
                        {
                            backgroundColor: colorScheme.lightContainer,
                            paddingHorizontal: sizes.text_2,
                            paddingVertical: sizes.text_2 * .5,
                            borderRadius: sizes.text_2,
                            marginBottom: sizes.text_2 * .5,
                            height: sizes.text_2 * 4,
                        }
                    ]}>
                        <TextInput
                            style={[styles.inputStyle, { fontSize: sizes.text_2 }]}
                            placeholderTextColor={colorScheme.lightGray}
                            selectionColor={colorScheme.light}
                            cursorColor={colorScheme.light}
                            placeholder={placeholder}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            value={text}
                            onChangeText={setText}
                            underlineColorAndroid="transparent"
                            inputMode="text"
                            autoFocus={true}
                        />
                    </View>
                    <ScrollView style={{ flex: 1 }}>
                        {list.map((item, i) => {
                            const dataIndex = data.indexOf(item);
                            const isSelected = selected.includes(dataIndex);
                            return (
                                <TouchableOpacity
                                    key={i}
                                    style={[styles.rowContainer, {
                                        marginTop: sizes.text_2 * .5,
                                        gap: sizes.text_2 * .5,
                                        borderRadius: sizes.text_2 * 0.5,
                                    }]}
                                    onPress={() => handleSelect(dataIndex)}
                                >
                                    <UserImage photoUrl={item[pictureTag]} />
                                    <Text style={styles.text}>
                                        {item[textTag]}
                                    </Text>
                                    <View style={{
                                        backgroundColor: colorScheme.lightContainer,
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
                </View>
            </>)}
        </>
    );
};

const colorScheme = {
    dark: "#181818",
    light: "#FFFFFF",
    free: "#71EB8C",
    busy: "#FF6567",
    container: "#2F2F2F",
    lightContainer: "#4F4F4F",
    lightGray: "#808080",
};

export default Dropdown;