import React from 'react';
import { CommonFormDrawer } from '@/components/common';
import { PARTNER_FORM_FIELDS } from '../constants';
import type { CreatePartnerRequest } from '../types';

interface PartnerFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CreatePartnerRequest) => void;
  title: string;
  loading?: boolean;
}

export const PartnerFormDialog: React.FC<PartnerFormDialogProps> = ({
  open,
  onClose,
  onSave,
  title,
  loading = false,
}) => {
  const handleSave = (data: Record<string, unknown>) => {
    const partnerData = data as unknown as CreatePartnerRequest;
    onSave(partnerData);
  };

  return (
    <CommonFormDrawer
      open={open}
      onClose={onClose}
      onSave={handleSave}
      title={title}
      fields={PARTNER_FORM_FIELDS}
      initialData={{}}
      loading={loading}
      submitText="Tạo đối tác"
      width={500}
    />
  );
};
