import type { Ticket, TicketResponse } from '../types/ticketTypes';
import dayjs from 'dayjs';

const today = dayjs().format('YYYY-MM-DD');

export const MOCK_TICKETS: Ticket[] = [
    {
        id: '1',
        ticket_code: '123456',
        ticket_type: 'traditional',
        station_id: 'HCM',
        draw_date: today,
        status: 'sold',
        note: 'Khách quen mua',
        created_at: dayjs().toISOString(),
    },
    {
        id: '2',
        ticket_code: '654321',
        ticket_type: 'traditional',
        station_id: 'HCM',
        draw_date: today,
        status: 'sold',
        note: 'Vé may mắn',
        created_at: dayjs().toISOString(),
    },
    {
        id: '3',
        ticket_code: '112233',
        ticket_type: 'traditional',
        station_id: 'HCM',
        draw_date: today,
        status: 'sold',
        created_at: dayjs().toISOString(),
    },
    {
        id: '4',
        ticket_code: '34343',
        ticket_type: 'traditional',
        station_id: 'HCM',
        draw_date: today,
        status: 'sold',
        created_at: dayjs().toISOString(),
    },
    {
        id: '5',
        ticket_code: '12121',
        ticket_type: 'traditional',
        station_id: 'HCM',
        draw_date: today,
        status: 'available',
        created_at: dayjs().toISOString(),
    },
    {
        id: '6',
        ticket_code: '34',
        ticket_type: 'traditional',
        station_id: 'HCM',
        draw_date: today,
        status: 'sold',
        created_at: dayjs().toISOString(),
    },
    {
        id: '7',
        ticket_code: '9988',
        ticket_type: 'traditional',
        station_id: 'HCM',
        draw_date: today,
        status: 'returned',
        created_at: dayjs().toISOString(),
    },
    {
        id: '8',
        ticket_code: '123457',
        ticket_type: 'traditional',
        station_id: 'HCM',
        draw_date: today,
        status: 'sold',
        created_at: dayjs().toISOString(),
    }
];

export const MOCK_TICKET_RESPONSE: TicketResponse = {
    data: MOCK_TICKETS,
    total: MOCK_TICKETS.length,
    page: 1,
    limit: 10
};
