import React, { useState, useEffect } from "react";

import QuickBook from "../components (old)/QuickBook";
import BackButton from "../components (old)/BackButton";
import DateSelect from "../components (old)/DateSelect";
import PersonSelect from "../components (old)/PersonSelect";
import BookBtn from "../components (old)/BookBtn";
import ChangeTopic from "../components (old)/ChangeTopic";

import { reservationCreate, reservationApprove } from '../components (old)/Connection';

import { useSelector } from 'react-redux';

const MenuBook = (props) => {
    const config = useSelector((state) => state.appData.config);
    const data = useSelector((state) => state.appData.data);

    const [topic, setTopic] = useState("");
    const [host, setHost] = useState({ text: "Нажмите, чтобы добавить", list: "" });
    const [participants, setParticipants] = useState({ text: "Нажмите, чтобы добавить", list: "" });

    useEffect(() => {
        if (props.selectedMenu === 0) {
            setHost({ text: "Нажмите, чтобы добавить", list: "" });
            setParticipants({ text: "Нажмите, чтобы добавить", list: "" });
            setTopic("");
        }
    }, [props.selectedMenu]);

    useEffect(() => {
        try {
            if (props.userSelector.type != "book-host" && props.userSelector.type != "book-participants") return;

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

            switch (props.userSelector.type) {
                case "book-host":
                    setHost({ text: _text, list: _list });
                    break;
                case "book-participants":
                    setParticipants({ text: _text, list: _list });
                    break;
            }
        } catch (e) {
            console.log('Menu: не удалось отобразить выбранный список пользователей');
        }
    }, [props.selected]);

    function getBookingTime(in_offset) {
        let _date = addMinutes(new Date(), in_offset);
        return new Date(_date).toISOString('ru');
    }

    function addMinutes(date, minutes) {
        return new Date(date.getTime() + minutes * 60000);
    }

    return (
        <>
            <BackButton selectMenu={props.selectMenu} title="Бронирование" />
            <QuickBook
                allignBottom={true}
                selectedMenu={props.selectedMenu}
                selectMenu={props.selectMenu}
                
                timePreset={props.timePreset} setTimePreset={props.setTimePreset}
            />
            <PersonSelect
                title="Организатор"
                highlighted={props.userSelector.type === "book-host" && props.userSelector.open}
                selected={host.text}
                openSelector={() => {
                    try {
                        props.selectUsers({
                            open: true, singleSelection: true,
                            type: "book-host", users: props.usersData
                        })
                    } catch (e) {
                        console.log('Menu: не удалось открыть PersonSelect', e);
                    }
                }}
            />
            <PersonSelect
                title="Участники"
                highlighted={props.userSelector.type === "book-participants" && props.userSelector.open}
                selected={participants.text}
                openSelector={() => {
                    try {
                        props.selectUsers({
                            open: true, singleSelection: false,
                            type: "book-participants", users: props.usersData
                        })
                    } catch (e) {
                        console.log('Menu: не удалось открыть PersonSelect', e);
                    }
                }}
            />
            <ChangeTopic
                title="Тема бронирования"
                value={topic}
                changeValue={setTopic}
            />
            <BookBtn
                setScroll={props.setScroll}
                enabled={host.list.length > 0 && topic && participants.list.length > 0}
                onPress={() => {
                    try {
                        reservationCreate(
                            config.hostname,
                            data.token,
                            props.objectId,
                            getBookingTime(1),
                            getBookingTime(1 + props.timePreset),
                            host.list[0],
                            topic,
                            participants.list,
                            props.setUpdate
                        );
                        props.selectMenu(0);
                    } catch (e) {
                        console.log('Menu: не удалось забронировать', e);
                    }
                }
                }
            />
        </>
    );
};

export default MenuBook;