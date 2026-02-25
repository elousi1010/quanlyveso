import React, { useMemo } from 'react';
import { Table, Card, Typography, Statistic, Row, Col, Progress, Tag } from 'antd';
import { getDebtAgingStatus } from '../utils/partnerDebtHelpers';
import { usePartners } from '../../Partners/hooks/usePartners';

const { Title, Text } = Typography;

export const PartnerDebtAgingReport: React.FC = () => {
    const { data: partnersData, isLoading } = usePartners({ limit: 1000 });
    const partners: any[] = (partnersData?.data as any)?.data || partnersData?.data || [];

    // Giả lập Dữ liệu Tuổi nợ (Trong thực tế BE sẽ trả về qua 1 API /aging-report)
    // Ở đây chúng ta sẽ mock việc tính toán Tuổi nợ dựa trên danh sách đối tác đang nợ
    const agingData = useMemo(() => {
        return partners
            .filter(p => p.debt > 0)
            .map((p, index) => {
                // Tái lập một số ngày nợ ngẫu nhiên để test UI hoặc lấy từ BE
                // Tạm mock overdueDays từ 0 đến 45 ngày để phản ánh các mốc
                const mockOverdueDays = index % 4 === 0 ? 35 : index % 3 === 0 ? 15 : index % 2 === 0 ? 5 : 0;
                const agingInfo = getDebtAgingStatus(mockOverdueDays);

                return {
                    id: p.id,
                    partner_name: p.name,
                    phone: p.phone_number,
                    level: p.level,
                    total_debt: p.debt,
                    overdueDays: mockOverdueDays,
                    agingLabel: agingInfo.label,
                    agingColor: agingInfo.color,
                };
            })
            .sort((a, b) => b.total_debt - a.total_debt); // Xếp nợ nhiều lên đầu
    }, [partners]);

    // Thống kê tổng quan
    const stats = useMemo(() => {
        let shortTerm = 0; // <= 7
        let mediumTerm = 0; // <= 30
        let badDebt = 0; // > 30

        agingData.forEach(item => {
            if (item.overdueDays > 30) badDebt += item.total_debt;
            else if (item.overdueDays > 7) mediumTerm += item.total_debt;
            else shortTerm += item.total_debt;
        });

        const total = shortTerm + mediumTerm + badDebt;
        return { shortTerm, mediumTerm, badDebt, total };
    }, [agingData]);

    const columns = [
        {
            title: 'Đối Tác',
            dataIndex: 'partner_name',
            key: 'partner_name',
            render: (text: string, record: any) => (
                <div>
                    <Text strong>{text}</Text>
                    <div style={{ fontSize: '12px', color: '#888' }}>{record.phone} - Cấp {record.level}</div>
                </div>
            ),
        },
        {
            title: 'Tuổi Nợ',
            dataIndex: 'overdueDays',
            key: 'overdueDays',
            render: (days: number, record: any) => (
                <Tag color={record.agingColor}>{record.agingLabel} ({days} ngày)</Tag>
            ),
        },
        {
            title: 'Tổng Nợ (VNĐ)',
            dataIndex: 'total_debt',
            key: 'total_debt',
            align: 'right' as const,
            render: (amount: number) => (
                <Text strong style={{ color: amount > 10000000 ? '#f44336' : 'inherit' }}>
                    {amount.toLocaleString('vi-VN')} đ
                </Text>
            ),
        },
    ];

    return (
        <div style={{ marginTop: '16px' }}>
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} md={8}>
                    <Card bordered={false} style={{ borderRadius: '12px', background: '#f6ffed' }}>
                        <Statistic
                            title="Nợ Tốt / Ngắn Hạn (< 7 ngày)"
                            value={stats.shortTerm}
                            precision={0}
                            suffix=" VNĐ"
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card bordered={false} style={{ borderRadius: '12px', background: '#fff7e6' }}>
                        <Statistic
                            title="Nợ Trung Hạn (7 - 30 ngày)"
                            value={stats.mediumTerm}
                            precision={0}
                            suffix=" VNĐ"
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card bordered={false} style={{ borderRadius: '12px', background: '#fff1f0' }}>
                        <Statistic
                            title="Nợ Xấu / Khó Đòi (> 30 ngày)"
                            value={stats.badDebt}
                            precision={0}
                            suffix=" VNĐ"
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card
                title="Báo Cáo Chi Tiết Ghi Nhận Công Nợ"
                bordered={false}
                style={{ borderRadius: '12px' }}
            >
                <Table
                    columns={columns}
                    dataSource={agingData}
                    rowKey="id"
                    loading={isLoading}
                    pagination={{ pageSize: 15 }}
                    size="middle"
                />
            </Card>
        </div>
    );
};
