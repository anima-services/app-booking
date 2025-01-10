import { useEffect, useState } from "react";
import { NativeModules } from 'react-native';

const { NewbestSDK } = NativeModules;

import { useSelector } from 'react-redux';

const Newbest = (props) => {
    const config = useSelector((state) => state.appData.config);
    const tempData = useSelector((state) => state.tempData);
    const [isAuth, setAuth] = useState(false);

    useEffect(() => {
        try {
            if (NewbestSDK == undefined ||
                config.panel != "newbest"
            ) return;

            setAuth(false);
    
            NewbestSDK.initModule("newbest", (err, msg) => {
                if (err) return console.log(err);
                else setAuth(true);
                console.log(msg);
            });
        } catch (e) {
            let _logText = (new Date).toLocaleString("ru") + " >>> ";
            _logText += 'Newbest: ошибка в инициализации модуля';
            console.log(_logText);
            props.setLogs([...props.logs, _logText]);
        }
    }, [config.panel]);

    useEffect(() => {
        try {
            if (NewbestSDK == undefined ||
                !isAuth ||
                config.panel != "newbest"
            ) return;
    
            if (tempData.busy) NewbestSDK.setColorRed();
            else NewbestSDK.setColorGreen();
        } catch (e) {
            let _logText = (new Date).toLocaleString("ru") + " >>> ";
            _logText += 'Newbest: ошибка в работе модуля';
            console.log(_logText);
            props.setLogs([...props.logs, _logText]);
        }
    }, [tempData.busy]);

    return (<></>);
};

export default Newbest;