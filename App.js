import React, { useState } from "react";
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { fontsLoaded } from "./components/StaticImports";
import Background from "./components/Background";

import Home from "./components/screens/Home.screen";
import Config from "./components/screens/Config.screen";
import Book from "./components/screens/Book.screen";
import Approve from "./components/screens/Approve.screen";
import Results from "./components/screens/Results.screen";
import Logs from "./components/screens/Logs.screen";

import MainApp from "./components/services/MainApp.services";
import QBicHandler from "./components/services/qbic.services";

import { Provider } from 'react-redux';
import { Store } from './components/data/Store';
import DataManager from "./components/data/DataManager";
import BusyListener from "./components/BusyListener";

const Stack = createStackNavigator();

export default function App() {
    let checkFonts = fontsLoaded();

    const screens = [
        { name: "Home", title: "Главная", component: Home },
        { name: "Config", title: "Конфигурация", component: Config },
        { name: "Book", title: "Бронирование", component: Book },
        { name: "Approve", title: "Подтверждение", component: Approve },
        { name: "Results", title: "Результат", component: Results },
        { name: "Logs", title: "Результат", component: Logs },
    ];

    const [isBusy, setBusy] = useState(false);

    return (
        <Provider store={Store}>{
            !checkFonts ?
                <Text>Шрифты загружаются</Text> :
                <SafeAreaProvider>
                    <NavigationContainer>
                        {/* Фоновый компонент */}
                        <Background isBusy={isBusy} />

                        {/* Навигационный стек поверх фона */}
                        <Stack.Navigator
                            screenOptions={{
                                headerTransparent: true,
                                headerTitleStyle: { color: 'white' },
                                headerTintColor: 'white',
                            }}
                        >
                            {screens.map((item, i) => <Stack.Screen key={i}
                                name={item.name}
                                component={item.component}
                                options={{ title: item.title, headerShown: false, cardStyle: { backgroundColor: 'transparent' } }}
                            />)}
                        </Stack.Navigator>
                    </NavigationContainer>
                    {/* Services */}
                    <MainApp />
                    <QBicHandler isBusy={isBusy} />
                    <BusyListener setBusy={setBusy} />
                </SafeAreaProvider>
        }
            <DataManager />
        </Provider>
    )
}
