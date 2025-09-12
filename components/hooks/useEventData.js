import { useEffect, useState } from 'react';

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

export const useEventData = (events_data, last_update) => {
  const defaultEvent = {
    isCurrent: false, show: false,
    timeUntilEnd: 0, timeUntilStart: 0,
    topic: "", participants_info: [], user_info: [],
    status: "", host_fullname: "", id: "",
    start: new Date(), end: new Date()
  };

  const [eventData, setEventData] = useState(defaultEvent);

  useEffect(() => {
    if (!events_data) {
      setEventData(defaultEvent);
      return;
    }

    const date = new Date();
    let isCurrent, timeUntilStart, timeUntilEnd;

    const event = events_data.find((item) => {
      const startDate = safeParseDate(item.start);
      const endDate = safeParseDate(item.end);
      const canceled = item.status === "automatically_canceled" || item.status === "canceled";
      isCurrent = date > startDate && date < endDate;
      timeUntilStart = Math.ceil((startDate - date) / 60000);
      timeUntilEnd = Math.ceil((endDate - date) / 60000);
      return !canceled && (isCurrent || (timeUntilStart <= 5 && timeUntilStart > -1));
    });

    if (event) {
      setEventData({
        isCurrent, show: true,
        timeUntilEnd, timeUntilStart,
        topic: event.topic, 
        participants_info: event.participants_info,
        user_info: event.user_info,
        status: event.status, host_fullname: event.user_info.full_name,
        id: event.id,
        start: safeParseDate(event.start), 
        end: safeParseDate(event.end),
      });
    } else {
      setEventData(defaultEvent);
    }
  }, [events_data, last_update]);

  return eventData;
}; 