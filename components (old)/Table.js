import React, { useState, useEffect, useRef } from "react";
import { View, ScrollView, Text } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { Styles } from "../utils/styles";
import TableEvent from "./TableEvent";
import Button from "./Button";

import structuredClone from "@ungap/structured-clone";

const Table = props => {
	const scrollViewRef = useRef(null);
	const [items, updateItems] = useState([]);

	useEffect(() => {
		try {
			let _eventList = [...props.reservationsData];
			_eventList.sort(function (a, b) {
				return new Date(a.start) - new Date(b.start);
			});

			_eventList = _eventList.filter(item => {
				if (
					!item.status ||
					item.status === "canceled" ||
					item.status === "automatically_canceled"
				)
					return false;
				return true;
			});

			let _tableEvents = [];
			let _nowDate = new Date();

			/* Сброс информации о текущем событии */
			props.updateCurrentEvent({});

			let _wasSelected = false;
			for (let i = 0; i < _eventList.length; i++) {
				let item = _eventList[i];
				let _time = `${getTime(item.start)} - ${getTime(item.end)}`;
				let _status, _name, _participants;
				let _itemKey = "TableEvent_" + _time;

				/* Определение занятости */
				let _busyState = false;
				if (
					_nowDate < new Date(item.end) &&
					_nowDate > new Date(item.start)
				) {
					setFocused(_itemKey);
					_busyState = true;
				}

				/* Атрибуты события */
				_status = item.status;
				_name = item.topic ? item.topic : `Встреча №${item.id}`;
				_participants = `${item.user_info.full_name}`;
				for (let p = 0; p < item.participants_info.length; p++) {
					_participants += ", " + item.participants_info[p].full_name;
				}

				/* Выбор события для чек-ина */
				function _checkIn() {
					let _item = structuredClone(item);
					_item["displayedName"] = _name;
					_item["IN_participants"] = [..._item["participants_info"]];
					_item["IN_participants"].unshift({ HEADER: "Участники" });
					_item["IN_participants"].push({ HEADER: "Организатор" });
					_item["IN_participants"].push(item.user_info);
					props.selectReservation(_item);
				}

				/* Вывод информации о текущем событии */
				if (
					_busyState ||
					(!_wasSelected && _nowDate < new Date(item.start))
				) {
					props.updateCurrentEvent(structuredClone(item));
					_wasSelected = true;
					if (props.selectedMenu != 2) _checkIn();
				}

				_tableEvents.push(
					<View
						key={_itemKey}
						onLayout={event => {
							const layout = event.nativeEvent.layout;
							coordinate[_itemKey] = layout.y;
						}}>
						<TableEvent
							time={_time}
							status={_status}
							name={_name}
							participants={_participants}
							busy={_busyState}
							onPress={() => {
								_checkIn();
								props.selectMenu(2);
							}}
						/>
					</View>
				);
			}

			updateItems(_tableEvents);
		} catch (e) {
			console.log("Ошибка при отрисовке графика: " + e);
		}
	}, [props.reservationsData, props.date]);

	function getTime(in_date) {
		try {
			in_date = new Date(in_date);
			return `${String(in_date.getHours()).padStart(2, "0")}:${String(
				in_date.getMinutes()
			).padStart(2, "0")}`;
		} catch (e) {
			console.log("Table: ошибка при выполнении getTime()");
			return "";
		}
	}

	const [coordinate, setCoordinate] = useState([]);
	const [focusedItem, setFocused] = useState("");

	useEffect(() => {
		try {
			if (!props.scroll) return;
			scrollViewRef.current.scrollTo({ y: coordinate[focusedItem] });
			props.setScroll(false);
		} catch (e) {
			console.log("Table: ошибка в прокрутке графика");
		}
	}, [props.scroll]);

	return items.length > 0 ? (
		/* График событий */
		<ScrollView
			showsVerticalScrollIndicator={false}
			ref={scrollViewRef}
			style={Styles.scrollTable}>
			{[...items,                 <Button title="Забронировать новое событие" onPress={() => props.selectMenu(1)} />]}
		</ScrollView>
	) : (
		/* Плейсхолдер с пустым графиком */
		<View style={Styles.tablePlaceHolder}>
			<FontAwesomeIcon
				style={Styles.tablePlaceHolderLogo}
				icon="fa-regular fa-calendar-check"
			/>
			<Text style={[Styles.text_regular, { textAlign: "center" }]}>
				На сегодня ничего не запланировано!
			</Text>
			<Button title="Забронировать" onPress={() => props.selectMenu(1)} />
		</View>
	);
};

export default Table;
