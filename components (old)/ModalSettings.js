import React, { useState, useEffect } from "react";
import {
	View,
	ScrollView,
	Text,
	Button,
	Modal,
	TextInput,
	StyleSheet,
	Dimensions,
	Pressable
} from "react-native";

import AppUpdater from "./services/AppUpdater";

import structuredClone from "@ungap/structured-clone";

import { useSelector, useDispatch } from "react-redux";
import { setConfig } from "../data (old)/appDataSlice";
import { updateData } from "../data (old)/tempDataSlice";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const ModalSettings = props => {
	const config = useSelector(state => state.appData.config);
	const tempData = useSelector(state => state.tempData);
	const logs = useSelector(state => state.tempData.logs);
	const dispatch = useDispatch();

	const [formData, setFormData] = useState({
		hostname: "",
		hostname_main: "",
		hostname_prefix: "",
		id: "",
		login: "",
		password: "",
		/* конфигурация объектов бронирования */
		mapId: "",
		spaceCount: "",
		spaces: [],
		/* конфигурация панели бронирования */
		panel: "",
		panelHost: "",
		panelLogin: "",
		panelPassword: "",
		panelId: ""
	});
	const [panelSettings, setPanelSettings] = useState({});

	const handleSave = () => {
		dispatch(setConfig(formData));
		props.setModalVisible(false);
	};

	useEffect(() => {
		for (let i = 0; i < formData.spaces.length; i++) {
			if (!formData.spaces[i]) formData.spaces[i] = 0;
		}
		setFormData({ ...formData, ...formData.spaces });
	}, [formData.spaceCount]);

	useEffect(() => {
		try {
			switch (formData.panel) {
				case "qbic":
					setPanelSettings({
						panelHost: true,
						panelLogin: true,
						panelPassword: true,
						panelId: false
					});
					break;
				case "newbest":
					setPanelSettings({
						panelHost: false,
						panelLogin: false,
						panelPassword: false,
						panelId: false
					});
					break;
				case "webapi":
					setPanelSettings({
						panelHost: true,
						panelLogin: true,
						panelPassword: true,
						panelId: true
					});
					break;
				default:
					setPanelSettings({
						panelHost: false,
						panelLogin: false,
						panelPassword: false,
						panelId: false
					});
					break;
			}
		} catch (e) {
			console.log("ModalSettings: обновить поля панели");
		}
	}, [formData.panel]);

	return (
		<Modal
			visible={props.modalVisible}
			animationType="slide"
			presentationStyle="pageSheet">
			<ScrollView style={styles.container}>
				<AppUpdater />
				<Text
					style={
						styles.header
					}>{`A4S / хост: ${config.hostname}`}</Text>
				<View style={{ flexDirection: "row" }}>
					<TextInput
						placeholder="https://"
						value={formData.hostname_prefix}
						onChangeText={value =>
							setFormData({
								...formData,
								hostname_prefix: value,
								hostname: value + formData.hostname_main
							})
						}
						style={{ ...styles.input, width: "20%" }}
					/>
					<TextInput
						placeholder="hostname"
						value={formData.hostname_main}
						onChangeText={value =>
							setFormData({
								...formData,
								hostname_main: value,
								hostname: formData.hostname_prefix + value
							})
						}
						style={{ ...styles.input, width: "80%" }}
					/>
				</View>
				<Text>адрес бэкэнда системы бронирования</Text>
				<Text
					style={
						styles.header
					}>{`A4S / login: ${config.login}`}</Text>
				<TextInput
					placeholder="login"
					value={formData.login}
					onChangeText={value =>
						setFormData({ ...formData, login: value })
					}
					style={styles.input}
				/>
				<Text>логин от учетной записи со статусом "внешний админ</Text>
				<Text
					style={
						styles.header
					}>{`A4S / password: ${config.password}`}</Text>
				<TextInput
					placeholder="password"
					value={formData.password}
					onChangeText={value =>
						setFormData({ ...formData, password: value })
					}
					style={styles.input}
				/>
				<Text>
					пароль от учетной записи со статусом "внешний админ"
				</Text>
				<Text
					style={
						styles.header
					}>{`A4S / id карты: ${config.mapId}`}</Text>
				<TextInput
					placeholder="mapId"
					value={formData.mapId}
					onChangeText={value =>
						setFormData({ ...formData, mapId: value })
					}
					style={styles.input}
					inputMode="numeric"
				/>
				<Text>
					идентификатор карты. Если не указывать, то стартовой
					страницей будет не карта, а страница помещения
				</Text>
				<Text
					style={
						styles.header
					}>{`A4S / Число объектов: ${config.spaceCount}`}</Text>
				<TextInput
					placeholder="spaceCount"
					type="number"
					value={formData.spaceCount}
					onChangeText={value => {
						let array = formData.spaces;
						array.length = value;
						setFormData({
							...formData,
							spaceCount: value,
							spaces: array
						});
					}}
					style={styles.input}
				/>
				<Text>
					число объектов - если указать 1, то не будет выбора
					помещений. При указанном идентификаторе карты, заполнять не
					нужно
				</Text>
				{formData.spaces.map((item, i) => {
					return (
						<View key={`space-${i}`}>
							<Text style={styles.header}>{`ID ${i}:`}</Text>
							<TextInput
								placeholder="-"
								value={formData.spaces[i]}
								onChangeText={value => {
									let array = formData.spaces;
									array[i] = value;
									setFormData({ ...formData, spaces: array });
								}}
								style={styles.input}
							/>
						</View>
					);
				})}
				<Text
					style={styles.header}>{`Тип панели: ${config.panel}`}</Text>
				<TextInput
					placeholder="-"
					value={formData.panel}
					onChangeText={value =>
						setFormData({ ...formData, panel: value })
					}
					style={styles.input}
				/>
				<Text>
					выбор вендора панели для настройки драйвера подсветки. В
					зависимости от выбранного драйвера могут меняться поля его
					конфигурации.
				</Text>
				{panelSettings.panelHost ? (
					<>
						<Text
							style={
								styles.header
							}>{`Хост: ${config.panelHost}`}</Text>
						<TextInput
							placeholder="-"
							value={formData.panelHost}
							onChangeText={value =>
								setFormData({ ...formData, panelHost: value })
							}
							style={styles.input}
						/>
					</>
				) : (
					<></>
				)}
				{panelSettings.panelLogin ? (
					<>
						<Text
							style={
								styles.header
							}>{`Логин: ${config.panelLogin}`}</Text>
						<TextInput
							placeholder="-"
							value={formData.panelLogin}
							onChangeText={value =>
								setFormData({ ...formData, panelLogin: value })
							}
							style={styles.input}
						/>
					</>
				) : (
					<></>
				)}
				{panelSettings.panelPassword ? (
					<>
						<Text
							style={
								styles.header
							}>{`Пароль: ${config.panelPassword}`}</Text>
						<TextInput
							placeholder="-"
							value={formData.panelPassword}
							onChangeText={value =>
								setFormData({
									...formData,
									panelPassword: value
								})
							}
							style={styles.input}
						/>
					</>
				) : (
					<></>
				)}
				{panelSettings.panelId ? (
					<>
						<Text
							style={
								styles.header
							}>{`ID панели: ${config.panelId}`}</Text>
						<TextInput
							placeholder="-"
							value={formData.panelId}
							onChangeText={value =>
								setFormData({ ...formData, panelId: value })
							}
							style={styles.input}
						/>
					</>
				) : (
					<></>
				)}
				<View style={{ marginVertical: 5 }}>
					<Button
						title="Вернуть параметры"
						onPress={() => setFormData(structuredClone(config))}
					/>
				</View>
				<View style={{ marginVertical: 5 }}>
					<Button
						title={`Подсветка: ${
							tempData.data.busy ? "занято" : "свободно"
						}`}
						onPress={() =>
							dispatch(updateData({ busy: !tempData.data.busy }))
						}
					/>
				</View>
				<View style={{ marginVertical: 5 }}>
					<Button title="Сохранить" onPress={handleSave} />
				</View>
				<View style={{ marginVertical: 5 }}>
					<Button
						title="Закрыть"
						onPress={() => props.setModalVisible(false)}
					/>
				</View>
				<Text style={styles.header}>Логи приложения</Text>
				<View style={{ marginBottom: 50 }}>
					{logs.map((item, i) => (
						<Text key={i}>{item}</Text>
					))}
				</View>
			</ScrollView>
		</Modal>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: windowWidth * 0.025
	},
	containerSmall: {
		padding: windowWidth * 0.01
	},
	input: {
		borderWidth: 1,
		borderRadius: 5,
		padding: 2
	},
	header: {
		paddingTop: windowWidth * 0.01,
		fontWeight: "500"
	}
});

export default ModalSettings;
