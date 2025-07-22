import React, { useEffect } from 'react';
import { useEventData } from './hooks/useEventData';
import { useSelector } from 'react-redux';

export default function BusyListener({ setBusy }) {
    const last_update = useSelector(state => state.data.last_update);
    const events_data = useSelector(state => state.data.events_data);
    const { isCurrent } = useEventData(events_data, last_update);

    useEffect(() => {
        setBusy(isCurrent);
    }, [isCurrent, last_update]);

    return null;
} 