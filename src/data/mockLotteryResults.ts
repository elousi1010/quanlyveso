import type { ProvinceResult } from '../pages/Tickets/utils/winningChecker';

export const MOCK_LOTTERY_RESULTS: ProvinceResult[] = [
    {
        province: 'TP.HCM',
        code: 'HCM',
        prizes: [
            { name: 'ĐB', numbers: ['123456'] },
            { name: 'G1', numbers: ['654321'] },
            { name: 'G2', numbers: ['112233'] },
            { name: 'G3', numbers: ['445566', '778899'] },
            { name: 'G4', numbers: ['12121', '23232', '34343', '45454', '56565', '67676', '78787'] },
            { name: 'G5', numbers: ['9988'] },
            { name: 'G6', numbers: ['1122', '3344', '5566'] },
            { name: 'G7', numbers: ['123'] },
            { name: 'G8', numbers: ['34'] },
        ]
    },
    {
        province: 'Đồng Tháp',
        code: 'DT',
        prizes: [
            { name: 'ĐB', numbers: ['654321'] },
            { name: 'G8', numbers: ['12'] },
        ]
    }
];
