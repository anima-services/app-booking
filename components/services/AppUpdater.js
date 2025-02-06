import React, {
  useEffect,
  useState
} from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  Platform
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Updates from 'expo-updates';
import * as IntentLauncher from 'expo-intent-launcher';

import packageJson from '../../package.json';

const currentVersion = packageJson.version;

const AppUpdate = () => {
  const [isUpdateAvailable,
    setIsUpdateAvailable] = useState(false);
  const [downloadUrl,
    setDownloadUrl] = useState('');
  const [isDownloading,
    setIsDownloading] = useState(false);

  // Получение последнего релиза с вашего сервера
  const getLatestRelease = async () => {
    try {
      const response = await fetch('https://api.github.com/repos/anima-services/app-booking/releases/latest');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка при получении релиза:', error);
      return null;
    }
  };

  // Проверка доступности обновления
  const checkForUpdate = async () => {
    const release = await getLatestRelease();
    if (release && release.tag_name !== currentVersion) {
      for (let i = 0; i < release.assets.length; i++) {
        let _asset = release.assets[i];
        let _url = _asset.browser_download_url;
        if (_url.split(".apk")) {
          setIsUpdateAvailable(true);
          setDownloadUrl(release._url);
          break;
        }
      }
    }
  };

  // Скачивание APK
  const downloadUpdate = async (url) => {
    const path = FileSystem.documentDirectory + 'app.apk';
    try {
      setIsDownloading(true);
      const {
        uri
      } = await FileSystem.downloadAsync(url, path);
      setIsDownloading(false);
      Alert.alert('Обновление скачано', 'Вы хотите установить обновление?', [{
        text: 'Да',
        onPress: () => installUpdate(uri),
      },
        {
          text: 'Нет', style: 'cancel'
        },
      ]);
    } catch (error) {
      console.error('Ошибка при скачивании обновления:', error);
      setIsDownloading(false);
      Alert.alert('Ошибка скачивания', 'Не удалось скачать обновление.');
    }
  };

  // Установка APK (только для Android)
  const installUpdate = (apkUri) => {
    if (Platform.OS === 'android') {
      IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: apkUri,
        flags: 1,
        type: 'application/vnd.android.package-archive',
      });
    } else {
      Alert.alert('Установка', 'Установка обновлений поддерживается только на Android.');
    }
  };

  // Проверка обновлений при монтировании компонента
  useEffect(() => {
    checkForUpdate();
  }, []);

  return (
    <View style={ { padding: 20 }}>
      <Text>Текущая версия: {currentVersion}</Text>
      {isUpdateAvailable ? (
        <View>
          <Text>Доступно обновление!</Text>
          <Button
            title="Скачать обновление"
            onPress={() => downloadUpdate(downloadUrl)}
            disabled={isDownloading}
            />
          {isDownloading && <Text>Загрузка...</Text>}
        </View>
      ): (
        <Text>У вас установлена последняя версия.</Text>
      )}
    </View>
  );
};

export default AppUpdate;