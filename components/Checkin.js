import React, { useState, useEffect } from "react";
import { View } from 'react-native';

import { PinCode, PinCodeT } from '@anhnch/react-native-pincode';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { Styles } from '../utils/styles';

const customTextes = {
    set: {
        title: 'Введите пин-код',
        subTitle: '',
        error: 'Пин-код отправлен'
    },
};

const Checkin = (props) => {
    const [pinVisible, setPinVisible] = useState(false);

    useEffect(() => {
        try {
            setPinVisible(props.selectedUser.length > 0);
        } catch (e) {
            console.log('Checkin: не удалось отобразить пин-код');
        }

    }, [props.selectedUser])

    return (
        <View style={{ flex: 1 }}>
            <PinCode visible={pinVisible} mode={PinCodeT.Modes.Set}
                options={{
                    backSpace: <FontAwesomeIcon style={Styles.icon} icon="fa-solid fa-delete-left" />,
                    retryLockDuration: 1000,
                    maxAttempt: 0,
                    pinLength: 6,
                    allowReset: false,
                    disableLock: true,
                    retryLockDuration: 0,
                }}
                styles={Styles.pincode}
                textOptions={customTextes}
                onSet={enteredPin => props.onEnter(enteredPin)}
            />
        </View>
    );
};

export default Checkin;