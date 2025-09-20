import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from "react-redux";

import { useResponsiveSizes } from './hooks/useResponsiveSizes';
import { useTheme } from './ThemeContext';
import { useEventData } from './hooks/useEventData';

import EventStatus from './EventStatus';

const Schedule = ({ navigate }) => {
    const time_presets = [25, 55];
    const time_offset = 5;
    const time_end = 23;

    const events_data = useSelector(state => state.data.events_data);
    const { theme } = useTheme();
    const last_update = useSelector(state => state.data.last_update);
    const sizes = useResponsiveSizes();

    const eventData = useEventData(events_data, last_update);
    const [timePeriod, setTimePeriod] = useState(0);
    const [now, setNow] = useState(new Date());
    const [selected, setSelected] = useState([]);

    const styles = StyleSheet.create({
        rowContainer: {
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignContent: "start",
            flexDirection: 'row',
            alignItems: 'center',
        },
        button: {
            backgroundColor: theme.container,
            color: theme.light,
            alignItems: 'center',
            justifyContent: 'center',
        },
        button_selected: {
            backgroundColor: theme.light,
            color: theme.container,
            alignItems: 'center',
            justifyContent: 'center',
        },
        button_text: {
            fontFamily: 'Onest_500Medium',
            color: theme.light,
        },
        button_text_selected: {
            fontFamily: 'Onest_500Medium',
            color: theme.container,
        },
    });

    useEffect(() => {
        const timer = setInterval(() => {
            const currentTime = new Date();
            const newMinutes = currentTime.getMinutes();
            currentTime.setMinutes(newMinutes);
            setNow(currentTime);
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    // Оптимизация: мемоизация расписания
    const timeSchedule = useMemo(() => {
        if (events_data && Array.isArray(events_data) && events_data.length > 0) {
            // Валидация событий перед обработкой
            const validEvents = events_data.filter(event => {
                const startDate = safeParseDate(event.start);
                const endDate = safeParseDate(event.end);
                return !isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) &&
                    startDate < endDate && event.status &&
                    !["canceled", "automatically_canceled"].includes(event.status);
            });

            if (validEvents.length > 0) {
                return time_presets.map(countTable);
            }
        }

        // Fallback: показываем свободные слоты если нет валидных событий
        return time_presets.map((preset) => {
            const _date = new Date(now);
            const _endDate = new Date(now);
            _endDate.setHours(time_end, 0, 0);
            return countBubbles(preset, _date, _endDate);
        });
    }, [events_data, now]);

    // Оптимизация: мемоизация функций
    const handleTimePeriodChange = useCallback((i) => {
        setTimePeriod(i);
        setSelected([]);
    }, []);

    const handleBubblePress = useCallback((i) => {
        setSelected(prevSelected => {
            let newSelected = prevSelected;
            console.log(newSelected, i, newSelected.includes(i));
            // Filter by includes
            newSelected = newSelected.includes(i) ? newSelected.filter(index => index !== i) : [...newSelected, i];
            // Filter by sequence
            newSelected = newSelected.length <= 1 || i - newSelected[newSelected.length - 2] === 1 ||
                newSelected[0] - i === 1
                ? newSelected : [i];
            // Sort by date
            newSelected = newSelected.sort((a, b) => {
                return timeSchedule[timePeriod][a].start - timeSchedule[timePeriod][b].start;
            });
            // Sort by count
            if (newSelected.length > 4) {
                newSelected = newSelected.indexOf(i) === 0 ? newSelected.slice(0, -1) : newSelected.slice(1);
            }

            return newSelected;
        });
    }, []);

    const handleBookPress = useCallback(() => {
        navigate('Book', {
            timeStart: timeSchedule[timePeriod][selected[0]].start,
            timeEnd: timeSchedule[timePeriod][selected[selected.length - 1]].end,
            formatStart: timeSchedule[timePeriod][selected[0]].format_start,
            formatEnd: timeSchedule[timePeriod][selected[selected.length - 1]].format_end,
        });
    }, [selected, timePeriod, timeSchedule]);

    function countTable(preset = 10) {
        let _table = [];
        let _date = new Date(now);
        let _dateEnd = new Date(now);

        // Отладочная информация для Android
        if (__DEV__ && events_data && events_data.length > 0) {
            console.log('Schedule: Обработка событий:', events_data.length);
            events_data.forEach((event, index) => {
                const startDate = safeParseDate(event.start);
                const endDate = safeParseDate(event.end);
                console.log(`Event ${index}:`, {
                    original: { start: event.start, end: event.end },
                    parsed: { start: startDate, end: endDate },
                    valid: !isNaN(startDate.getTime()) && !isNaN(endDate.getTime())
                });
            });
        }

        for (const event of events_data) {
            _dateEnd = safeParseDate(event.start);
            _table.push(...countBubbles(preset, _date, _dateEnd));
            if (_dateEnd < _date) continue;

            _date = safeParseDate(event.start);
            _dateEnd = safeParseDate(event.end);
            const _timeUntilStart = Math.ceil((_date - new Date(now)) / 60000);
            if (_timeUntilStart > time_offset) {
                _table.push({
                    text: `${format_hh_mm(_date)} - ${format_hh_mm(_dateEnd)}`,
                    start: _date,
                    end: _dateEnd,
                    format_start: format_hh_mm(_date),
                    format_end: format_hh_mm(_dateEnd),
                    title: event.topic,
                    dsc: `Организатор: ${event.user_info.full_name}`,
                    disabled: true
                });
            }
            _date = safeParseDate(event.end);
        }
        _dateEnd = new Date(_date);
        _dateEnd.setHours(time_end, 0, 0);
        _table.push(...countBubbles(preset, _date, _dateEnd));

        return _table;
    }

    function countBubbles(preset = 10, in_time_start, in_time_end) {
        let _bubbleArray = [];
        const _date = safeParseDate(in_time_start);
        const _endDate = safeParseDate(in_time_end);
        const _hour = _date.getHours();

        for (let i = _hour; i < _endDate.getHours() + 1; i++) {
            const _intervals = Math.floor(60 / preset);
            let _intervalStart = new Date(_date);
            let _intervalEnd = new Date(_intervalStart);

            for (let k = 0; k < _intervals; k++) {
                const _offset = k > 0 ? time_offset : 0;
                _intervalStart.setHours(i, _offset + preset * k, 0);
                _intervalEnd.setHours(i, _offset + preset * (k + 1), 0);

                if (_intervalStart > _date && _intervalEnd < _endDate) {
                    _bubbleArray.push({
                        text: `${format_hh_mm(_intervalStart)} - ${format_hh_mm(_intervalEnd)}`,
                        start: new Date(_intervalStart),
                        end: new Date(_intervalEnd),
                        format_start: format_hh_mm(_intervalStart),
                        format_end: format_hh_mm(_intervalEnd),
                    });
                }
            }
        }
        return _bubbleArray;
    }

    return (
        <View style={{ flex: 1 }}>
            {/* Tabs */}
            <View style={[styles.rowContainer, {
                gap: sizes.textSize * .5,
                marginVertical: sizes.textSize * 2
            }]}>
                {time_presets.map((item, i) => (
                    <Tab key={i} text={`На ${item} мин`}
                        selected={timePeriod === i}
                        select={() => handleTimePeriodChange(i)}
                    />
                ))}
            </View>

            {/* Current event bubble */}
            <View style={{
                display: eventData.show == true ? "flex" : "none"
            }}>
                <Bubble
                    text={`${format_hh_mm(eventData.start)} - ${format_hh_mm(eventData.end)}`}
                    title={eventData.topic}
                    dsc={`Организатор: ${eventData.host_fullname}`}
                    status={eventData.status}
                    selected={selected.length === 0}
                    select={() => { setSelected([]) }}
                    isCurrent={eventData.isCurrent}
                    timeLeft={eventData.timeUntilStart}
                />
                <View
                    style={{
                        borderBottomColor: theme.container,
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        marginVertical: sizes.textSize * .5,
                    }}
                />
            </View>

            {/* Bubbles */}
            {time_presets.map((preset, k) => (
                <ScrollView
                    key={k}
                    style={{ display: timePeriod === k ? 'flex' : 'none' }}
                    contentContainerStyle={{
                        rowGap: sizes.textSize * .5,
                        paddingBottom: sizes.textSize * 10
                    }}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    {timeSchedule[k].map((item, i) => (
                        <Bubble key={`${k}-${i}`}
                            text={item.text}
                            title={item.title}
                            dsc={item.dsc}
                            disabled={item.disabled}
                            selected={selected.includes(i)}
                            select={() => handleBubblePress(i)}
                        />
                    ))}
                </ScrollView>
            ))}

            {/* Gradient overlay */}
            <LinearGradient
                colors={['transparent', theme.dark]}
                pointerEvents="none"
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0, right: 0,
                    height: sizes.textSize * 10,
                }}
            />

            {/* Booking button */}
            <BookBtn
                style={{ display: true ? "flex" : "none" }}
                text={"Забронировать"}
                disabled={selected.length === 0}
                onPress={handleBookPress}
            />
        </View>
    );
};

// Оптимизация: memo для компонентов
const Bubble = memo(({
    text,
    select,
    selected,
    title,
    dsc,
    disabled = false,
    status,
    style,
    isCurrent,
    timeLeft
}) => {
    const sizes = useResponsiveSizes();
    const { theme, toggleTheme } = useTheme();

    const styles = StyleSheet.create({
        rowContainer: {
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignContent: "start",
            flexDirection: 'row',
            alignItems: 'center',
        },
        button: {
            backgroundColor: theme.container,
            color: theme.light,
            alignItems: 'center',
            justifyContent: 'center',
        },
        button_selected: {
            backgroundColor: theme.light,
            color: theme.container,
            alignItems: 'center',
            justifyContent: 'center',
        },
        button_text: {
            fontFamily: 'Onest_500Medium',
            color: theme.light,
        },
        button_text_selected: {
            fontFamily: 'Onest_500Medium',
            color: theme.container,
        },
    });

    return (
        <TouchableOpacity
            style={[
                selected ? styles.button_selected : styles.button,
                styles.rowContainer, {
                    paddingVertical: sizes.textSize * .8,
                    paddingHorizontal: sizes.textSize * .8,
                    borderRadius: sizes.textSize,
                    justifyContent: "flex-start",
                }, style]}
            onPress={!disabled ? select : null}
            disabled={disabled}
        >
            <View style={{ opacity: disabled ? .3 : 1, flex: 1, gap: sizes.textSize * .5 }}>
                {title && (
                    <Text style={[
                        selected ? styles.button_text_selected : styles.button_text, {
                            fontSize: sizes.textSize, flex: 1
                        }
                    ]}>{title}</Text>
                )}
                {dsc && (
                    <Text style={[
                        selected ? styles.button_text_selected : styles.button_text, {
                            fontSize: sizes.subTextSize, flex: 1
                        }
                    ]}>{dsc}</Text>
                )}
            </View>
            <Text style={[
                selected ? styles.button_text_selected : styles.button_text, {
                    fontSize: sizes.textSize,
                    flex: 1, opacity: disabled ? .3 : 1, textAlign: 'center',
                }
            ]}>{text}</Text>
            <View style={{ flex: 1 }}>
                {status && (
                    <EventStatus
                        text={isCurrent ? "Текущая встреча" : `Начало через ${timeLeft} мин`}
                        busyColored={true}
                        isBusy={isCurrent}
                    />
                )}
            </View>
        </TouchableOpacity>
    );
});

const Tab = memo(({ text, select, selected }) => {
    const sizes = useResponsiveSizes();
    const { theme, toggleTheme } = useTheme();

    const styles = StyleSheet.create({
        rowContainer: {
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignContent: "start",
            flexDirection: 'row',
            alignItems: 'center',
        },
        button: {
            backgroundColor: theme.container,
            color: theme.light,
            alignItems: 'center',
            justifyContent: 'center',
        },
        button_selected: {
            backgroundColor: theme.light,
            color: theme.container,
            alignItems: 'center',
            justifyContent: 'center',
        },
        button_text: {
            fontFamily: 'Onest_500Medium',
            color: theme.light,
        },
        button_text_selected: {
            fontFamily: 'Onest_500Medium',
            color: theme.container,
        },
    });

    return (
        <TouchableOpacity
            style={[
                selected ? styles.button_selected : styles.button, {
                    paddingVertical: sizes.textSize * .4,
                    paddingHorizontal: sizes.textSize * .8,
                    borderRadius: sizes.textSize,
                }]}
            onPress={select}
        >
            <Text style={[
                selected ? styles.button_text_selected : styles.button_text,
                { fontSize: sizes.textSize }
            ]}>{text}</Text>
        </TouchableOpacity>
    );
});

const BookBtn = memo(({ text, onPress, disabled = false, style }) => {
    const sizes = useResponsiveSizes();
    const { theme, toggleTheme } = useTheme();

    const styles = StyleSheet.create({
        rowContainer: {
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignContent: "start",
            flexDirection: 'row',
            alignItems: 'center',
        },
        button: {
            backgroundColor: theme.container,
            color: theme.light,
            alignItems: 'center',
            justifyContent: 'center',
        },
        button_selected: {
            backgroundColor: theme.light,
            color: theme.container,
            alignItems: 'center',
            justifyContent: 'center',
        },
        button_text: {
            fontFamily: 'Onest_500Medium',
            color: theme.light,
        },
        button_text_selected: {
            fontFamily: 'Onest_500Medium',
            color: theme.container,
        },
    });

    return (
        <TouchableOpacity
            style={[
                styles.button, {
                    padding: sizes.textSize,
                    borderRadius: sizes.textSize,
                    backgroundColor: disabled ? theme.container : theme.free,
                    position: "absolute",
                    bottom: sizes.textSize * 2,
                    left: 0, right: 0,
                }, style]}
            onPress={!disabled ? onPress : null}
        >
            <Text style={[
                disabled ? styles.button_text : styles.button_text_selected,
                { fontSize: sizes.textSize }
            ]}>{text}</Text>
        </TouchableOpacity>
    );
});

// Утилита для безопасного парсинга дат на Android
function safeParseDate(dateString) {
    if (!dateString) return new Date();

    // Если это уже Date объект
    if (dateString instanceof Date) return dateString;

    // Пробуем разные форматы для Android
    let parsed = new Date(dateString);

    // Если парсинг не удался, пробуем добавить таймзону
    if (isNaN(parsed.getTime())) {
        // Пробуем формат YYYY-MM-DD HH:mm:ss без таймзоны
        const isoMatch = dateString.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})/);
        if (isoMatch) {
            parsed = new Date(isoMatch[1] + 'T' + isoMatch[2] + 'Z');
        }
    }

    // Если все еще не удалось, возвращаем текущую дату
    if (isNaN(parsed.getTime())) {
        console.warn('Не удалось распарсить дату:', dateString);
        return new Date();
    }

    return parsed;
}

export function format_hh_mm(in_date) {
    const safeDate = safeParseDate(in_date);
    const formattedTime = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).format(safeDate);
    return formattedTime;
}

export default Schedule;