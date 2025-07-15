import { useEffect, useState } from 'react';

export const useEventData = (data) => {
  const defaultEvent = {
    isCurrent: false, show: false,
    timeUntilEnd: 0, timeUntilStart: 0,
    topic: "", participants_info: [], user_info: [],
    status: "", host_fullname: "",
    start: new Date(), end: new Date()
  };

  const [eventData, setEventData] = useState(defaultEvent);

  useEffect(() => {
    if (!data.events_data) {
      setEventData(defaultEvent);
      return;
    }

    const date = new Date();
    let isCurrent, timeUntilStart, timeUntilEnd;

    const event = data.events_data.find((item) => {
      const startDate = new Date(item.start);
      const endDate = new Date(item.end);
      const canceled = item.status === "automatically_canceled" || item.status === "canceled";
      isCurrent = date > startDate && date < endDate;
      timeUntilStart = Math.ceil((startDate - date) / 60000);
      timeUntilEnd = Math.ceil((endDate - date) / 60000);
      return !canceled && (isCurrent || (timeUntilStart <= 15 && timeUntilStart > -1));
    });

    if (event) {
      setEventData({
        isCurrent, show: true,
        timeUntilEnd, timeUntilStart,
        topic: event.topic, 
        participants_info: event.participants_info,
        user_info: event.user_info,
        status: event.status, host_fullname: event.user_info.full_name,
        start: event.start, end: event.end,
      });
    } else {
      setEventData(defaultEvent);
    }
  }, [data.events_data, data.last_update]);

  return eventData;
}; 