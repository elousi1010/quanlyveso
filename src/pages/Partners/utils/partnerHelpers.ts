import type { Partner, CreatePartnerRequest, UpdatePartnerRequest } from '../types';

export const formDataToUpdateDto = (data: Record<string, unknown>): UpdatePartnerRequest => {
  return {
    name: data.name as string,
    address: data.address as string,
    phone_number: data.phone_number as string,
    type: data.type as 'agent' | 'seller' | 'customer' | 'supplier' | 'other',
    level: data.level as number,
  };
};

export const partnerToFormData = (partner: Partner | null): Record<string, unknown> => {
  if (!partner) return {};
  
  return {
    name: partner.name,
    address: partner.address,
    phone_number: partner.phone_number,
    type: partner.type,
    level: partner.level,
  };
};

export const partnerToDisplayData = (partner: Partner | null): Record<string, unknown> => {
  if (!partner) return {};
  
  return {
    name: partner.name,
    address: partner.address,
    phone_number: partner.phone_number,
    type: partner.type,
    level: partner.level,
    debt: partner.debt,
    organization: partner.organization?.name || 'N/A',
    created_at: partner.created_at,
    updated_at: partner.updated_at,
    is_active: partner.is_active,
  };
};