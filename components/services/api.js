import axios from 'axios';
import { Store } from '../data/Store';

export async function createReservation(user, participants, topic, start, end) {
    const data = Store.getState().data;
    const api = axios.create({
        baseURL: data.hostname,
        timeout: 5000,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Token ${data.token}`,
        },
    });
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