import React, { useState, useEffect } from "react";
import { View, ScrollView, Pressable, Image, Text, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Styles } from '../utils/styles';

const UsersTable = (props) => {
    const [items, updateItems] = useState([]);
    const [filter, setFilter] = useState("");

    function select(in_item) {
        setFilter("");
        try {
            if (props.userSelector.singleSelection) {
                props.select([in_item]);
            } else {
                let _array = [...props.selected];
                let _index = _array.indexOf(in_item);

                if (_index > -1) _array.splice(_index, 1);
                else _array.push(in_item);

                props.select(_array);
            }
        } catch (e) {
            console.log('UsersTable: ошибка при выполнении select()');
        }
    }

    useEffect(() => {
        console.log(props.userSelector);
    }, [props.userSelector]);

    useEffect(() => {
        try {
            let _userArray = [];
            for (let i = 0; i < props.users.length; i++) {
                let item = props.users[i];
                if (item.HEADER) {
                    _userArray.push(
                        <HeaderContainer
                            key={i + "_HEADER"}
                            name={item.HEADER}
                        />
                    );
                    continue;
                }
                let _name = item["full_name"];
                let _dsc = item["email"];
                let _photoUrl = item["photo"];
                let _itemKey = i + "_USER_" + item["id"];

                if (_name == null || _name == "-") continue;

                /* Фильтрация */
                if (!_name.toLowerCase().includes(filter.toLowerCase())) continue;

                _userArray.push(
                    <UserContainer
                        key={_itemKey}
                        photoUrl={_photoUrl}
                        name={_name}
                        dsc={_dsc}
                        selected={props.selected.indexOf(item) > -1}
                        select={() => select(item)}
                    />
                );
            }
            updateItems(_userArray);
        } catch (e) { console.log('Ошибка при отрисовке списка пользователей: ' + e); }
    }, [props.users, props.selected, props.userSelector, filter]);

    return (
        <>
            {
                props.userSelector.type != "checkin" ?
                    <View style={Styles.scrollTable}>
                        <Text style={[Styles.text_regular]}>{props.title}</Text>
                        <TextInput
                            disableFullscreenUI={true}
                            style={[Styles.inputField_inv, Styles.inputField_inv.text, { marginTop: 0 }]}
                            onChangeText={setFilter}
                            value={filter}
                            placeholder="Поиск"
                        />
                    </View>
                    : <></>
            }
            <ScrollView showsVerticalScrollIndicator={false} style={Styles.scrollTable}>
                {items}
            </ScrollView>
        </>
    );
};

const UserContainer = ({ photoUrl, name, dsc, selected, select }) => {
    return (
        <Pressable onPress={select}>
            <LinearGradient
                style={selected
                    ? [Styles.tableEvent, Styles.tableEvent.busy, Styles.horizontalRow]
                    : [Styles.tableEvent, Styles.horizontalRow]}
                colors={selected ? Styles.primaryGradient.colors : Styles.primaryGradient.grayColors}
                start={Styles.primaryGradient.start}
                end={Styles.primaryGradient.end}
            >
                <Image
                    style={Styles.userPhoto}
                    source={{ uri: photoUrl }}
                />
                <View>
                    <Text style={selected
                        ? [Styles.text_regular, { color: 'white' }]
                        : Styles.text_regular} >{name}</Text>
                    <Text style={selected
                        ? [Styles.text_regularLC, { color: 'white' }]
                        : Styles.text_regularLC} >{dsc}</Text>
                </View>
            </LinearGradient>
        </Pressable>
    );
};

const HeaderContainer = ({ name }) => {
    return (
        <View>
            <Text style={Styles.text_regular} >{name}</Text>
        </View>
    );
};

export default UsersTable;