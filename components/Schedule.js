import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from "react-redux";

import { useResponsiveSizes } from './hooks/useResponsiveSizes';
import { useEventData } from './hooks/useEventData';

import EventStatus from './EventStatus';

// Константы
const TIME_PRESETS = [25, 55];
const TIME_OFFSET = 5;
const TIME_END = 23;

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
  bubble: {
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: "flex-start",
    marginHorizontal: 8,
    marginVertical: 4,
  },
  divider: {
    borderBottomColor: colorScheme.container,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: 8,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0, 
    right: 0,
    height: 100,
  },
  bookButton: {
    padding: 12,
    borderRadius: 8,
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    alignItems: 'center',
  }
});

const format_hh_mm = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date(date));
};

// Оптимизированные компоненты
const Bubble = memo(({ 
  text, 
  title, 
  dsc, 
  disabled = false, 
  selected, 
  select,
  isCurrent,
  timeLeft,
  status
}) => {
  const sizes = useResponsiveSizes();
  
  return (
    <TouchableOpacity
      style={[
        selected ? styles.button_selected : styles.button,
        styles.rowContainer, 
        styles.bubble,
        { paddingVertical: sizes.textSize * 0.8 }
      ]}
      onPress={!disabled ? select : undefined}
      disabled={disabled}
    >
      <View style={{ opacity: disabled ? 0.3 : 1, flex: 1, gap: sizes.textSize * 0.5 }}>
        {title && (
          <Text style={[
            selected ? styles.button_text_selected : styles.button_text, 
            { fontSize: sizes.textSize }
          ]}>
            {title}
          </Text>
        )}
        {dsc && (
          <Text style={[
            selected ? styles.button_text_selected : styles.button_text, 
            { fontSize: sizes.subTextSize }
          ]}>
            {dsc}
          </Text>
        )}
      </View>
      <Text style={[
        selected ? styles.button_text_selected : styles.button_text, 
        { 
          fontSize: sizes.textSize,
          opacity: disabled ? 0.3 : 1, 
          textAlign: 'center',
          flex: 1
        }
      ]}>
        {text}
      </Text>
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
          paddingVertical: sizes.textSize * 0.4,
          paddingHorizontal: sizes.textSize * 0.8,
          borderRadius: sizes.textSize,
        }]}
      onPress={select}
    >
      <Text style={[
        selected ? styles.button_text_selected : styles.button_text,
        { fontSize: sizes.textSize }
      ]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
});

const BookBtn = memo(({ text, onPress, disabled = false }) => {
  const sizes = useResponsiveSizes();

  return (
    <TouchableOpacity
      style={[
        styles.bookButton,
        { 
          backgroundColor: disabled ? colorScheme.container : colorScheme.free,
          padding: sizes.textSize
        }
      ]}
      onPress={!disabled ? onPress : undefined}
      disabled={disabled}
    >
      <Text style={[
        disabled ? styles.button_text : styles.button_text_selected,
        { fontSize: sizes.textSize }
      ]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
});

// Основной компонент Schedule
const Schedule = ({ navigate }) => {
  const events_data = useSelector(state => state.data.events_data);
  const last_update = useSelector(state => state.data.last_update);
  const sizes = useResponsiveSizes();

  const eventData = useEventData(events_data, last_update);
  const [timePeriod, setTimePeriod] = useState(0);
  const [now, setNow] = useState(new Date());
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Обновление времени каждую минуту
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Генерация временных слотов
  const timeSchedule = useMemo(() => {
    if (!events_data || !Array.isArray(events_data)) {
      return TIME_PRESETS.map(() => []);
    }

    return TIME_PRESETS.map(preset => generateTimeSlots(preset, events_data, now));
  }, [events_data, now]);

  const handleTimePeriodChange = useCallback((index) => {
    setTimePeriod(index);
    setSelectedIndex(null);
  }, []);

  const handleBubblePress = useCallback((index) => {
    setSelectedIndex(prevIndex => prevIndex === index ? null : index);
  }, []);

  const handleBookPress = useCallback(() => {
    if (selectedIndex === null) return;
    
    const selectedSlot = timeSchedule[timePeriod][selectedIndex];
    navigate('Book', {
      timeStart: selectedSlot.start,
      timeEnd: selectedSlot.end,
      formatStart: selectedSlot.format_start,
      formatEnd: selectedSlot.format_end,
    });
  }, [selectedIndex, timePeriod, timeSchedule, navigate]);

  const renderBubble = useCallback(({ item, index }) => (
    <Bubble 
      {...item}
      selected={index === selectedIndex}
      select={() => handleBubblePress(index)}
    />
  ), [selectedIndex, handleBubblePress]);

  return (
    <View style={{ flex: 1 }}>
      {/* Tabs */}
      <View style={[styles.rowContainer, {
        gap: sizes.textSize * 0.5,
        marginVertical: sizes.textSize * 2
      }]}>
        {TIME_PRESETS.map((item, i) => (
          <Tab 
            key={i} 
            text={`На ${item} мин`}
            selected={timePeriod === i} 
            select={() => handleTimePeriodChange(i)}
          />
        ))}
      </View>

      {/* Current event bubble */}
      {eventData.show && (
        <>
          <Bubble
            text={`${format_hh_mm(eventData.start)} - ${format_hh_mm(eventData.end)}`}
            title={eventData.topic}
            dsc={`Организатор: ${eventData.host_fullname}`}
            status={eventData.status}
            selected={selectedIndex === null}
            select={() => setSelectedIndex(null)}
            isCurrent={eventData.isCurrent}
            timeLeft={eventData.timeUntilStart}
          />
          <View style={styles.divider} />
        </>
      )}

      {/* Оптимизированные списки */}
      {TIME_PRESETS.map((_, index) => (
        <FlatList
          key={index}
          data={timeSchedule[index]}
          renderItem={renderBubble}
          keyExtractor={(item, i) => `${index}-${i}`}
          style={{ display: timePeriod === index ? 'flex' : 'none', flex: 1 }}
          contentContainerStyle={{
            paddingBottom: sizes.textSize * 10,
            paddingHorizontal: 8
          }}
          removeClippedSubviews
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          windowSize={7}
        />
      ))}

      {/* Gradient overlay */}
      <LinearGradient
        colors={['transparent', colorScheme.dark]}
        pointerEvents="none"
        style={styles.gradient}
      />

      {/* Кнопка бронирования */}
      <BookBtn
        text="Забронировать"
        disabled={selectedIndex === null}
        onPress={handleBookPress}
      />
    </View>
  );
};

// Вспомогательные функции
function generateTimeSlots(preset, events, currentTime) {
  const slots = [];
  let lastTime = new Date(currentTime);
  
  for (const event of events) {
    const eventStart = new Date(event.start);
    
    // Слоты до начала события
    addIntervalSlots(slots, preset, lastTime, eventStart);
    
    // Добавляем само событие
    if (eventStart - currentTime > 15 * 60000) {
      slots.push({
        text: `${format_hh_mm(eventStart)} - ${format_hh_mm(event.end)}`,
        start: eventStart,
        end: new Date(event.end),
        format_start: format_hh_mm(eventStart),
        format_end: format_hh_mm(event.end),
        title: event.topic,
        dsc: `Организатор: ${event.host_fullname}`,
        disabled: true,
        status: false
      });
    }
    
    lastTime = new Date(event.end);
  }
  
  // Добавляем слоты после последнего события до конца дня
  const endOfDay = new Date(lastTime);
  endOfDay.setHours(TIME_END, 0, 0);
  addIntervalSlots(slots, preset, lastTime, endOfDay);
  
  return slots;
}

function addIntervalSlots(slots, preset, startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  while (start < end) {
    const slotEnd = new Date(start);
    slotEnd.setMinutes(start.getMinutes() + preset);
    
    if (slotEnd > end) break;
    
    slots.push({
      text: `${format_hh_mm(start)} - ${format_hh_mm(slotEnd)}`,
      start: new Date(start),
      end: slotEnd,
      format_start: format_hh_mm(start),
      format_end: format_hh_mm(slotEnd),
    });
    
    start.setMinutes(start.getMinutes() + preset + TIME_OFFSET);
  }
}

export default Schedule;