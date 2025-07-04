import React, { useState, useEffect } from "react";

import BackButton from "../components (old)/BackButton";
import PersonSelect from "../components (old)/PersonSelect";
import Checkin from "../components (old)/Checkin";

import { reservationCreate, reservationApprove } from '../components (old)/Connection';

import { useSelector } from 'react-redux';

const MenuCheckin = (props) => {
    const config = useSelector((state) => state.appData.config);
    const data = useSelector((state) => state.appData.data);

    const [checkinUser, setCheckinUser] = useState({ text: "Нажмите, чтобы добавить", list: "" });

    useEffect(() => {
        if (props.selectedMenu === 0) {
            setCheckinUser({ text: "Нажмите, чтобы добавить", list: "" });
        }
    }, [props.selectedMenu]);

    useEffect(() => {
        try {
            if (props.userSelector.type != "checkin") return;

            let _text = "Нажмите, чтобы добавить";
            let _list = [];
            let _items = [];

            if (props.selected.length > 0) {
                _text = "";
                for (let i = 0; i < props.selected.length; i++) {
                    _text += props.selected[i]["full_name"];
                    if (i < props.selected.length - 1) _text += ", ";
                    _list.push(props.selected[i]["id"]);
                    _items.push(props.selected[i]);
                }
            }

            setCheckinUser({ text: _text, list: _list, items: _items });
        } catch (e) {
            console.log('Menu: не удалось отобразить выбранный список пользователей');
        }
    }, [props.selected]);

    return (
        <>
            <BackButton selectMenu={props.selectMenu} title="Подтверждение бронирования" />
            <PersonSelect
                title="Выбранное бронирование"
                highlighted={!props.userSelector.open}
                selected={
                    props.reservationSelected &&
                        props.reservationSelected.displayedName != null
                        ? props.reservationSelected.displayedName : ""
                }
                openSelector={() => {
                    try {
                        props.selectUsers({
                            open: false, singleSelection: true,
                            type: "checkin", users: props.reservationSelected.IN_participants
                        })
                    } catch (e) {
                        console.log('Menu: не удалось открыть PersonSelect');
                    }
                }}
            />
            <PersonSelect
                title="Участник"
                highlighted={props.userSelector.type === "checkin" && props.userSelector.open}
                selected={checkinUser.text}
                openSelector={() => {
                    try {
                        props.selectUsers({
                            open: true, singleSelection: true,
                            type: "checkin", users: props.reservationSelected.IN_participants
                        })
                    } catch (e) {
                        console.log('Menu: не удалось открыть PersonSelect');
                    }
                }}
            />
            <Checkin
                selectedUser={checkinUser.list}
                onEnter={pin => {
                    try {
                        reservationApprove(
                            config.hostname,
                            data.token,
                            props.reservationSelected.id,
                            pin,
                            checkinUser.items[0].email,
                            props.setUpdate
                        );
                        props.selectMenu(0);
                    } catch (e) {
                        console.log('Menu: не удалось ввести пин-код');
                    }
                }}
            />
        </>
    );
};

export default MenuCheckin;