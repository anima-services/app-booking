import React, { useEffect } from 'react';
import { useEventData } from './hooks/useEventData';
import { useSelector } from 'react-redux';

export default function BusyListener({ setBusy }) {
    const data = useSelector(state => state.data);
    const { isCurrent } = useEventData(data);

    useEffect(() => {
        setBusy(isCurrent);
    }, [isCurrent, setBusy]);

    return null; 
} 