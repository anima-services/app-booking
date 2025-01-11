import React, { useEffect, useState, useRef } from "react";
import { View, Pressable, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Styles } from '../utils/styles';

import ModalSettings from "../components/ModalSettings";
import ObjectContainer from './ObjectContainer';
import GridContainer from './GridContainer';
import Title from "../components/Title";

import MapContainer from "./MapContainer";

import { useSelector, useDispatch } from 'react-redux';
import { updateData } from '../data/tempDataSlice';

export default function MainContainer(props) {
    const config = useSelector((state) => state.appData.config);
    const data = useSelector((state) => state.appData.data);
    const dispatch = useDispatch();

    const [modalVisible, setModalVisible] = useState(false);

    const [selectedObject, selectObject] = useState(0);
    const [objectVisible, setObjectVisible] = useState(false);

    const [clickCount, setClickCount] = useState(0);
    const [lastClickTime, setLastClickTime] = useState(0);
    const handlePress = () => {
        const now = Date.now();
        if (now - lastClickTime <= 500) { // Проверяем, что между нажатиями прошло не более 500 мс 
            setClickCount(prevCount => prevCount + 1);
        } else {
            setClickCount(1); // Сбрасываем счетчик, если прошло больше времени 
        } setLastClickTime(now);
    };

    useEffect(() => {
        if (clickCount === 5) { // Ваша функция здесь 
            setModalVisible(true);
            setClickCount(0);
        }
    }, [clickCount]);

    const timerRef = useRef(null);
    const backTimerRef = useRef(null);

    const handlePressIn = () => {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setModalVisible(true);
        }, 10000);
    };

    const handlePressOut = () => {
        clearTimeout(timerRef.current);
    };

    function goToMain() {
        setObjectVisible(false);
    }

    useEffect(() => {
        if (!config.spaces) return;

        /* Показ единственного объекта */
        if (config.spaces.length < 2) {
            selectObject(config.spaces[0]);
            setObjectVisible(true);
        }
        /* Определение статуса бронирования */
        let _busy = false;
        for (let i = 0; i < config.spaces.length; i++) {
            let _itemData = data[`space_${i}`];
            if (!_itemData) continue;
            _busy &= _itemData.is_reserved_now;
        }
        dispatch(updateData({ busy: _busy }));
    }, [config.spaces]);

    useEffect(() => {
        if (config.spaces && config.spaces.length < 2) return;
        if (!objectVisible) {
            clearTimeout(backTimerRef.current);
        } else {
            let _time = 15 * 60 * 1000;
            backTimerRef.current = setTimeout(() => {
                setObjectVisible(false);
            }, _time);
        }
    }, [objectVisible]);

    return (
        <Pressable style={Styles.content}
            onPress={handlePress}
        >
            {objectVisible ?
                <ObjectContainer
                    objectId={selectedObject}
                    date={props.date}
                    setUpdate={props.setUpdate}
                    goToMain={goToMain} showBack={config.spaces && config.spaces.length > 1}
                />
                :
                config.mapId ?
                    <MapContainer select={(item) => { selectObject(item); setObjectVisible(true); }} />
                    :
                    <GridContainer>
                        {config.spaces ? config.spaces.map((item, i) => {
                            let _itemData = data[`space_${item}`]
                            if (!_itemData) return <></>;
                            return <Pressable
                                onPress={() => { selectObject(item); setObjectVisible(true); }}
                                key={`${i}_space_${item}`} style={Styles.fill}>
                                <View style={[Styles.fill, Styles.container]}>
                                    <ImageBackground
                                        style={[Styles.overlay]}
                                        source={_itemData.image} resizeMode="cover" />
                                    <View style={[Styles.overlay, _itemData.is_reserved_now ? Styles.busy : Styles.free]} />
                                    <LinearGradient
                                        colors={Styles.darkGradient.colors}
                                        start={Styles.darkGradient.start}
                                        end={Styles.darkGradient.end}
                                        style={[Styles.overlay]}
                                    />
                                    <Title objectData={_itemData} inverted={true} />
                                    {/* <Text style={[Styles.text_h2, { color: 'white' }]}>{_itemData.name}</Text> */}
                                </View>
                            </Pressable>;
                        }) : <></>}
                    </GridContainer>
            }
            <ModalSettings
                modalVisible={modalVisible} setModalVisible={setModalVisible}
            />
        </Pressable>
    );
}
