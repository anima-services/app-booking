import axios from 'axios';
import { Store } from '../data/Store';
import { setState, setLogs } from "../data/DataSlice";

function apiConfiguration(hostname, token) {
    return {
        baseURL: hostname,
        timeout: 5000,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
    };
}

export async function createReservation(user, participants, topic, start, end) {
    const data = Store.getState().data;
    const api = axios.create(apiConfiguration(data.hostname, data.token));
    const response = await api.post(`/api/reservation/extend_admin/`, {
        user,
        topic,
        space: data.id,
        start,
        end,
        participants,
    });
    return response;
}

export async function approveReservation(event_id, user_email, user_pincode) {
    const data = Store.getState().data;
    const api = axios.create(apiConfiguration(data.hostname, data.token));
    const response = await api.post(`/api/reservation/${event_id}/approve/`, {
        reserve_token: user_pincode,
        email: user_email
    });
    return response;
}

export async function getReservations(dispatch, signal) {
    const data = Store.getState().data;
    const api = axios.create(apiConfiguration(data.hostname, data.token));

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    const eventsParams = new URLSearchParams({
        space: data.id,
        start_after: now.toISOString(),
        end_before: tomorrow.toISOString()
    });

    const eventsResponse = await api.get(
        `/api/reservation/?${eventsParams}`,
        signal ? { signal } : {}
    );

    if (eventsResponse.data.results != null) {
        const filteredEvents = eventsResponse.data.results
            .filter(item => item.status &&
                !["canceled", "automatically_canceled"].includes(item.status))
            .sort((a, b) => new Date(a.start) - new Date(b.start));

        dispatch(setState({ events_data: filteredEvents }));
        dispatch(setLogs(`События получены!`));
    }

    // Обновление времени последнего обновления
    dispatch(setState({ last_update: new Date().toISOString() }));
} 