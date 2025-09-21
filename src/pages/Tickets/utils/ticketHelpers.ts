import type { Ticket } from '../types';

export const formatTicketData = (ticket: Ticket) => {
  return {
    ...ticket,
    draw_date: ticket.draw_date 
      ? new Date(ticket.draw_date).toLocaleDateString('vi-VN')
      : '',
    created_at: ticket.created_at 
      ? new Date(ticket.created_at).toLocaleDateString('vi-VN')
      : '',
    updated_at: ticket.updated_at 
      ? new Date(ticket.updated_at).toLocaleDateString('vi-VN')
      : '',
  };
};

export const validateTicketData = (data: Partial<Ticket>) => {
  const errors: Record<string, string> = {};

  if (!data.ticket_code?.trim()) {
    errors.ticket_code = 'Mã vé là bắt buộc';
  }

  if (!data.ticket_type?.trim()) {
    errors.ticket_type = 'Loại vé là bắt buộc';
  }

  if (!data.station_id?.trim()) {
    errors.station_id = 'ID trạm là bắt buộc';
  }

  if (!data.draw_date?.trim()) {
    errors.draw_date = 'Ngày quay là bắt buộc';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const getTicketTypeLabel = (type: string) => {
  const typeMap: Record<string, string> = {
    'traditional': 'Truyền thống',
    'online': 'Trực tuyến',
    'instant': 'Tức thời',
  };
  return typeMap[type] || type;
};
