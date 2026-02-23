import type { User, UserListResponse } from '../pages/Users/types/userTypes';
import type { Partner, PartnerListResponse } from '../pages/Partners/types/partnerTypes';
import type { PartnerDebt, PartnerDebtListResponse } from '../pages/PartnerDebt/types/partnerDebtTypes';

const org = {
    id: 'org1',
    name: 'Đại lý Tổng HCM',
    address: '123 Lê Lợi, Q1, HCM',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_active: true,
    owner_id: 'owner1',
    created_by: null,
    updated_by: null,
    deleted_at: null
};

export const MOCK_USERS: User[] = [
    {
        id: 'u1',
        name: 'Nguyễn Văn Admin',
        phone_number: '0901234567',
        role: 'admin',
        is_active: true,
        organization_id: 'org1',
        organization: org,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'system',
        updated_by: null,
        deleted_at: null
    },
    {
        id: 'u2',
        name: 'Trần Thị Thu Ngân',
        phone_number: '0907654321',
        role: 'employee',
        is_active: true,
        organization_id: 'org1',
        organization: org,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'u1',
        updated_by: null,
        deleted_at: null
    }
];

export const MOCK_USER_LIST_RESPONSE: UserListResponse = {
    message: 'Success',
    error: '',
    statusCode: 200,
    data: {
        data: MOCK_USERS,
        total: MOCK_USERS.length
    }
};

export const MOCK_PARTNERS: Partner[] = [
    {
        id: 'p1',
        name: 'Đại lý Kim Anh',
        phone_number: '0911223344',
        address: '456 Nguyễn Huệ, Q1, HCM',
        type: 'agent',
        level: 1,
        debt: 150000000,
        credit_limit: 500000000,
        commission_rate: 10,
        last_payment_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        debt_overdue_days: 5,
        status_risk: 'normal',
        is_active: true,
        organization_id: 'org1',
        organization: org,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'u1',
        updated_by: null,
        deleted_at: null
    },
    {
        id: 'p2',
        name: 'Đại lý Minh Sang',
        phone_number: '0988776655',
        address: '789 Lê Lợi, Q.Ninh Kiều, Cần Thơ',
        type: 'agent',
        level: 2,
        debt: 450000000,
        credit_limit: 400000000, // Vượt hạn mức
        commission_rate: 8,
        last_payment_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        debt_overdue_days: 15,
        status_risk: 'high_risk',
        is_active: true,
        organization_id: 'org1',
        organization: org,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'u1',
        updated_by: null,
        deleted_at: null
    },
    {
        id: 'p3',
        name: 'Chú Tư Bán Dạo',
        phone_number: '0905111222',
        address: 'Hẻm 45 Mai Thị Lựu, Q1, HCM',
        type: 'seller',
        level: 3,
        debt: 2500000,
        credit_limit: 10000000,
        commission_rate: 12,
        last_payment_at: new Date().toISOString(),
        debt_overdue_days: 0,
        status_risk: 'normal',
        work_area: 'Khu vực Công viên Lê Văn Tám',
        notes: 'Có thuê bàn gỗ và 1 ghế đẩu',
        is_active: true,
        organization_id: 'org1',
        organization: org,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'u1',
        updated_by: null,
        deleted_at: null
    },
    {
        id: 'p4',
        name: 'Cô Ba Xổ Số',
        phone_number: '0903888999',
        address: '22 Bis Phan Đăng Lưu, Bình Thạnh',
        type: 'seller',
        level: 3,
        debt: 8000000,
        credit_limit: 15000000,
        commission_rate: 12,
        last_payment_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        debt_overdue_days: 2,
        status_risk: 'warning',
        work_area: 'Góc ngã tư Hàng Xanh',
        notes: 'Người khuyết tật, cần hỗ trợ khi giao vé tận nơi',
        is_active: true,
        organization_id: 'org1',
        organization: org,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'u1',
        updated_by: null,
        deleted_at: null
    }
];

export const MOCK_PARTNER_LIST_RESPONSE: PartnerListResponse = {
    message: 'Success',
    error: '',
    statusCode: 200,
    data: {
        data: {
            data: MOCK_PARTNERS,
            total: MOCK_PARTNERS.length
        }
    }
};

export const MOCK_PARTNER_DEBTS: PartnerDebt[] = [
    {
        id: 'd1',
        created_at: new Date().toISOString(),
        created_by: 'u1',
        updated_at: new Date().toISOString(),
        updated_by: null,
        deleted_at: null,
        is_active: true,
        partner_id: 'p1',
        payment_method: 'winning_ticket',
        payment_type: 'income',
        transaction_sub_type: 'winning_settlement',
        amount: '50000000',
        tax_amount: '4000000', // (50tr - 10tr) * 10%
        description: 'Cấn trừ nợ bằng vé trúng giải Nhì (50 triệu)',
        inventory_transaction_id: null,
        organization_id: 'org1',
        partner: MOCK_PARTNERS[0],
        organization: org
    },
    {
        id: 'd2',
        created_at: new Date().toISOString(),
        created_by: 'u1',
        updated_at: new Date().toISOString(),
        updated_by: null,
        deleted_at: null,
        is_active: true,
        partner_id: 'p2',
        payment_method: 'bank_transfer',
        payment_type: 'expense',
        amount: '2500000',
        description: 'Chi phí vận chuyển vé',
        inventory_transaction_id: null,
        organization_id: 'org1',
        partner: MOCK_PARTNERS[1],
        organization: org
    }
];

export const MOCK_PARTNER_DEBT_LIST_RESPONSE: PartnerDebtListResponse = {
    message: 'Success',
    error: '',
    statusCode: 200,
    data: {
        data: MOCK_PARTNER_DEBTS,
        total: MOCK_PARTNER_DEBTS.length
    }
};
