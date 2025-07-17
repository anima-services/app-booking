import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Alert, Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";

import packageJson from "../../package.json";

const currentVersion = packageJson.version;

import Button from "../Button";

const AppUpdate = () => {
    const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState("");
    const [isDownloading, setIsDownloading] = useState(false);
    const [updateVersion, setUpdateVersion] = useState(currentVersion);

    // Получение последнего релиза с GitHub
    const getLatestRelease = async () => {
        try {
            const response = await fetch(
                "https://api.github.com/repos/anima-services/app-booking/releases/latest"
            );
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Ошибка при получении релиза:", error);
            return null;
        }
    };

    // Проверка доступности обновления
    const checkForUpdate = async () => {
        const release = await getLatestRelease();
        if (release && release.tag_name !== currentVersion) {
            setUpdateVersion(release.tag_name);
            for (let i = 0; i < release.assets.length; i++) {
                let _asset = release.assets[i];
                let _url = _asset.browser_download_url;
                if (_url.split(".apk")) {
                    setIsUpdateAvailable(true);
                    setDownloadUrl(_url);
                    break;
                }
            }
        }
    };

    // Скачивание APK
    const downloadUpdate = async (url) => {
        const path = FileSystem.documentDirectory + "app.apk";
        try {
            setIsDownloading(true);
            const { uri } = await FileSystem.downloadAsync(url, path);

            // Проверка существования файла
            const fileInfo = await FileSystem.getInfoAsync(uri);
            if (!fileInfo.exists) {
                throw new Error("Файл не был скачан.");
            }

            setIsDownloading(false);
            Alert.alert(
                "Обновление скачано",
                "Вы хотите установить обновление?",
                [
                    {
                        text: "Да",
                        onPress: () => installUpdate(uri),
                    },
                    {
                        text: "Нет",
                        style: "cancel",
                    },
                ]
            );
        } catch (error) {
            console.error("Ошибка при скачивании обновления:", error);
            setIsDownloading(false);
            Alert.alert("Ошибка скачивания", "Не удалось скачать обновление.");
        }
    };

    // Установка APK
    const installUpdate = async (apkUri) => {
        if (Platform.OS === "android") {
            try {
                let fileUri = apkUri;

                // Для Android 7.0 и выше используем FileProvider
                if (Platform.Version >= 24) {
                    fileUri = await FileSystem.getContentUriAsync(apkUri);
                }

                // Запуск установки
                await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
                    data: fileUri,
                    flags: 1,
                    type: "application/vnd.android.package-archive",
                });
            } catch (e) {
                Alert.alert("Ошибка установки", e.message);
            }
        } else {
            Alert.alert(
                "Установка",
                "Установка обновлений поддерживается только на Android."
            );
        }
    };

    // Проверка обновлений при монтировании компонента
    useEffect(() => {
        checkForUpdate();
    }, []);

    return (
        <View>
            <Text style={styles.text}>Текущая версия: {currentVersion}</Text>
            {isUpdateAvailable ? (
                <View>
                    <Text style={styles.text}>Последняя версия на сервере: {updateVersion}</Text>
                    <Button
                        title="Скачать обновление"
                        onPress={() => downloadUpdate(downloadUrl)}
                        disabled={isDownloading}
                    />
                    {isDownloading && <Text>Загрузка...</Text>}
                </View>
            ) : (
                <Text style={styles.text}>У вас установлена последняя версия.</Text>
            )}
        </View>
    );
};

const colorScheme = {
    dark: "#181818",
    light: "#FFFFFF",
    free: "#71EB8C",
    busy: "#FF6567",
    container: "#2F2F2F",
};

const styles = StyleSheet.create({
    text: {
        fontFamily: 'Onest_500Medium',
        color: colorScheme.free
    },
});

export default AppUpdate;