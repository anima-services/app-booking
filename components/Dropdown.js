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

const Dropdown = ({ name, data = [], placeholder, pictureTag, textTag, attributeTag, maxItems = 1, onSelect }) => {
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
        if (!Array.isArray(data) || data.length === 0) return;
        setShowList(true);
        setText("");
    };

    // Первичная отрисовка
    useEffect(() => {
        if (!Array.isArray(data)) return;
        setFormatted(data.map((item, i) => {
            let _text = item[textTag];
            let _picture = item[pictureTag];
            let _attribute = item[attributeTag];


            return {
                [textTag]: _text,
                [pictureTag]: _picture,
                [attributeTag]: _attribute,
                "origin": item,
                "selected": false
            };
        }));
    }, [])
    useEffect(() => {
        setList([...formattedData]);
    }, [formattedData])

    // Фильтрация данных
    const filterData = (array) => {
        return array.filter((item, i) => {
            let _text = item[textTag];
            let _picture = item[pictureTag];
            let _attribute = item[attributeTag];

            if (_text == null || _text == "-") return false;

            const _byText = _text.toLowerCase().includes(text.toLowerCase());
            const _byAttribute = _attribute?.toLowerCase().includes(text.toLowerCase());
            if (!_byText && !_byAttribute) return false;

            return true;
        });
    };

    // Сортировка данных
    const sortData = (array) => {
        array.sort((a, b) => {
            if (a.selected == b.selected) return 0;
            else if (a.selected) return -1;
            else return 1;
        });
        return array;
    };

    const selectItem = (in_item) => {
        /* Проверка maxItems-1 */
        let _items = 0;
        let _newArray = list.filter(item => {
            if (item.selected && _items < maxItems - 1) {
                _items++;
                return true;
            } else {
                item.selected = false;
                return false;
            }
        });

        /* Обновление списка */
        in_item.selected = !in_item.selected;
        setText("");
        updateArray();

        /* Обновление onSelect */
        let _originArray = list.filter(item => item.selected).map(item => item.origin);
        setSelected(_originArray);
        onSelect(_originArray);

        /* Скрытие DropDown */
        if (_originArray.length >= maxItems) setShowList(false);
    }

    const updateArray = () => {
        let _newArray = [...formattedData];
        _newArray = sortData(_newArray);
        setList([..._newArray]);
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
                        {filterData(list).map((item, i) => {
                            const isSelected = item.selected;
                            return (
                                <TouchableOpacity
                                    key={i}
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
                            onChangeText={setText}
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