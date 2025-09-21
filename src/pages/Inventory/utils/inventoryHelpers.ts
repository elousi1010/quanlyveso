import type { Inventory } from '../types';

export const formatInventoryData = (inventory: Inventory) => {
  return {
    ...inventory,
    created_at: inventory.created_at 
      ? new Date(inventory.created_at).toLocaleDateString('vi-VN')
      : '',
    updated_at: inventory.updated_at 
      ? new Date(inventory.updated_at).toLocaleDateString('vi-VN')
      : '',
  };
};

export const validateInventoryData = (data: Partial<Inventory>) => {
  const errors: Record<string, string> = {};

  // Since inventory has minimal fields, we'll add basic validation
  // This can be extended when more fields are added to the API
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
