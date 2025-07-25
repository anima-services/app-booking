import React, { useState, useEffect, useRef } from "react";
import { Text, StatusBar, Animated } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useFonts } from 'expo-font';

import { fontAssets } from "./components/StaticImports";
import Background from "./components/Background";

import Home from "./components/screens/Home.screen";
import Config from "./components/screens/Config.screen";
import Book from "./components/screens/Book.screen";
import Approve from "./components/screens/Approve.screen";
import Results from "./components/screens/Results.screen";
import Logs from "./components/screens/Logs.screen";

import NavigationService from "./components/services/Navigation.services";

import MainApp from "./components/services/MainApp.services";
import QBicHandler from "./components/services/qbic.services";

import { Provider } from 'react-redux';
import { Store } from './components/data/Store';
import DataManager from "./components/data/DataManager";
import BusyListener from "./components/BusyListener";

export default function App() {
    const [fontsLoaded] = useFonts(fontAssets);
    const [currentScreen, setCurrentScreen] = useState(NavigationService.getCurrentScreen());
    const fadeAnim = useRef(new Animated.Value(1)).current;


    useEffect(() => {
        const unsubscribe = NavigationService.addListener(() => {
            fadeAnim.setValue(0);
            setCurrentScreen(NavigationService.getCurrentScreen());
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [currentScreen]);

    const renderScreen = () => {
        const { screen, params } = currentScreen;

        const screenProps = {
            navigate: NavigationService.navigate,
            goBack: NavigationService.goBack,
            resetToHome: NavigationService.resetToHome,
            params
        };

        switch (screen) {
            case 'Home': return <Home {...screenProps} />;
            case 'Config': return <Config {...screenProps} />;
            case 'Book': return <Book {...screenProps} />;
            case 'Approve': return <Approve {...screenProps} />;
            case 'Results': return <Results {...screenProps} />;
            case 'Logs': return <Logs {...screenProps} />;
            default: return <Home {...screenProps} />;
        }
    };

    const [isBusy, setBusy] = useState(false);

    if (!fontsLoaded) {
        return <Text>Шрифты загружаются</Text>;
    }

    return (
        <Provider store={Store}>
            <DataManager />
            <SafeAreaProvider style={{ backgroundColor: '#000000', flex: 1 }}>
                {/* Фоновый компонент */}
                <Background isBusy={isBusy} />

                {/* Навигационный стек поверх фона */}
                <Animated.View
                    style={{
                        flex: 1,
                        opacity: fadeAnim,
                    }}
                >
                    {renderScreen()}
                </Animated.View>

                {/* Services */}
                <MainApp />
                <QBicHandler isBusy={isBusy} />
                <BusyListener setBusy={setBusy} />
                <StatusBar hidden={true} translucent={true} />
            </SafeAreaProvider>
        </Provider>
    )
}
