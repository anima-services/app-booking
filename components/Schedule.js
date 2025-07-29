import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from "react-redux";

import { useResponsiveSizes } from './hooks/useResponsiveSizes';
import { useEventData } from './hooks/useEventData';

import EventStatus from './EventStatus';

const Schedule = ({ navigate }) => {
    const time_presets = [25, 55];
    const time_offset = 5;
    const time_end = 23;

    const events_data = useSelector(state => state.data.events_data);
    const last_update = useSelector(state => state.data.last_update);
    const sizes = useResponsiveSizes();

    const eventData = useEventData(events_data, last_update);
    const [timePeriod, setTimePeriod] = useState(0);
    const [now, setNow] = useState(new Date());
    const [selectedIndex, setSelectedIndex] = useState(null);

    // Оптимизация: уменьшена частота обновления времени
    useEffect(() => {
        const timer = setInterval(() => {
            const currentTime = new Date();
            const newMinutes = currentTime.getMinutes() + 3;
            currentTime.setMinutes(newMinutes);
            setNow(currentTime);
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    // Оптимизация: мемоизация расписания
    const timeSchedule = useMemo(() => {
        if (events_data && Array.isArray(events_data)) {
            return time_presets.map(countTable);
        }
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
        setSelectedIndex(null);
    }, []);

    const handleBubblePress = useCallback((i) => {
        setSelectedIndex(prevIndex => prevIndex === i ? null : i);
    }, []);

    const handleBookPress = useCallback(() => {
        navigate('Book', {
            timeStart: timeSchedule[timePeriod][selectedIndex].start,
            timeEnd: timeSchedule[timePeriod][selectedIndex].end,
            formatStart: timeSchedule[timePeriod][selectedIndex].format_start,
            formatEnd: timeSchedule[timePeriod][selectedIndex].format_end,
        });
    }, [selectedIndex, timePeriod, timeSchedule]);

    function countTable(preset = 10) {
        let _table = [];
        let _date = new Date(now);
        let _dateEnd = new Date(now);

        for (const event of events_data) {
            _dateEnd = new Date(event.start);
            _table.push(...countBubbles(preset, _date, _dateEnd));

            _date = new Date(event.start);
            _dateEnd = new Date(event.end);

            const _timeUntilStart = Math.ceil((_date - new Date(now)) / 60000);
            if (_timeUntilStart > 15) {
                _table.push({
                    text: `${format_hh_mm(_date)} - ${format_hh_mm(_dateEnd)}`,
                    start: _date,
                    end: _dateEnd,
                    format_start: format_hh_mm(_date),
                    format_end: format_hh_mm(_dateEnd),
                    title: event.topic,
                    dsc: `Организатор: ${event.host_fullname}`,
                    disabled: true
                });
            }
            _date = new Date(event.end);
        }
        _dateEnd.setHours(time_end, 0, 0);
        _table.push(...countBubbles(preset, _date, _dateEnd));

        return _table;
    }

    function countBubbles(preset = 10, in_time_start, in_time_end) {
        let _bubbleArray = [];
        const _date = new Date(in_time_start);
        const _endDate = new Date(in_time_end);
        const _hour = _date.getHours();

        for (let i = _hour; i < _endDate.getHours(); i++) {
            const _intervals = Math.floor(60 / preset);
            let _intervalStart = new Date(_date);
            let _intervalEnd = new Date(_intervalStart);

            for (let k = 0; k < _intervals; k++) {
                const _offset = k > 0 ? time_offset : 0;
                _intervalStart.setHours(i, _offset + preset * k, 0);
                _intervalEnd.setHours(i, _offset + preset * (k + 1), 0);

                if (_intervalStart > _date) {
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
                    selected={selectedIndex === null}
                    select={() => { setSelectedIndex(null) }}
                    isCurrent={eventData.isCurrent}
                    timeLeft={eventData.timeUntilStart}
                />
                <View
                    style={{
                        borderBottomColor: colorScheme.container,
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
                            selected={i === selectedIndex}
                            select={() => handleBubblePress(i)}
                        />
                    ))}
                </ScrollView>
            ))}

            {/* Gradient overlay */}
            <LinearGradient
                colors={['transparent', colorScheme.dark]}
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
                disabled={selectedIndex === null}
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

    return (
        <TouchableOpacity
            style={[
                styles.button, {
                    padding: sizes.textSize,
                    borderRadius: sizes.textSize,
                    backgroundColor: disabled ? colorScheme.container : colorScheme.free,
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

const colorScheme = {
    dark: "#181818",
    light: "#FFFFFF",
    free: "#71EB8C",
    busy: "#FF6567",
    container: "#2F2F2F",
};

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
        backgroundColor: colorScheme.container,
        color: colorScheme.light,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button_selected: {
        backgroundColor: colorScheme.light,
        color: colorScheme.container,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button_text: {
        fontFamily: 'Onest_500Medium',
        color: colorScheme.light,
    },
    button_text_selected: {
        fontFamily: 'Onest_500Medium',
        color: colorScheme.container,
    },
});

export function format_hh_mm(in_date) {
    const formattedTime = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).format(new Date(in_date));
    return formattedTime;
}

export default Schedule;