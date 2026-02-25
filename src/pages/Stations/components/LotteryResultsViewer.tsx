import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Statistic, Button, Table, Tag, Space, message, Spin, Alert, Flex } from 'antd';
import { SyncOutlined, TrophyOutlined, ClockCircleOutlined, NumberOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

// Giả lập kết quả lấy từ Scraper cho Miền Nam (Minh Ngọc)
const MOCK_RESULTS_SOUTH = [
    { rank: 'Giải Tám', numbers: ['88'] },
    { rank: 'Giải Bảy', numbers: ['813'] },
    { rank: 'Giải Sáu', numbers: ['0145', '7344', '2166'] },
    { rank: 'Giải Năm', numbers: ['8942'] },
    { rank: 'Giải Tư', numbers: ['51723', '01934', '11832', '31901', '55122', '31244', '80121'] },
    { rank: 'Giải Ba', numbers: ['55123', '10923'] },
    { rank: 'Giải Nhì', numbers: ['81923'] },
    { rank: 'Giải Nhất', numbers: ['10921'] },
    { rank: 'Đặc Biệt', numbers: ['501235'] }
];

export const LotteryResultsViewer: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(dayjs());
    const [isScraping, setIsScraping] = useState(false);
    const [results, setResults] = useState<any[]>([]);

    // Đếm ngược tới 16:30 hôm nay
    const getTargetTime = () => {
        let target = dayjs().hour(16).minute(30).second(0);
        if (dayjs().isAfter(target)) {
            // Nếu qua 16:30 thì đếm tới 16:30 ngày mai (Tùy logic)
            // Tạm thời hiển thị 00:00:00 nếu đã qua giờ xổ
            return target;
        }
        return target;
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(dayjs());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const targetTime = getTargetTime();
    const isPastDrawTime = currentTime.isAfter(targetTime);

    // Tính toán thời gian còn lại
    let diff = targetTime.diff(currentTime, 'second');
    if (diff < 0) diff = 0;
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;

    const handleRunScraper = () => {
        setIsScraping(true);
        // Mô phỏng gọi API Scraper Minhngoc
        setTimeout(() => {
            setResults(MOCK_RESULTS_SOUTH);
            setIsScraping(false);
            message.success('Đã lấy kết quả xổ số thành công!');
        }, 2000);
    };

    const handleRunWinningChecker = () => {
        setIsScraping(true);
        // Mô phỏng hàm so khớp vé trúng trong kho
        setTimeout(() => {
            setIsScraping(false);
            message.success('Hoàn tất dò số! Có 3 vé trúng giải trong hệ thống.');
        }, 2500);
    };

    const columns = [
        {
            title: 'Hạng Giải',
            dataIndex: 'rank',
            key: 'rank',
            width: 150,
            render: (text: string) => <Text strong style={{ color: text === 'Đặc Biệt' ? '#f5222d' : undefined }}>{text}</Text>,
        },
        {
            title: 'Dãy Số Trúng',
            dataIndex: 'numbers',
            key: 'numbers',
            render: (numbers: string[]) => (
                <Space wrap>
                    {numbers.map((num, i) => (
                        <Tag
                            key={i}
                            color={numbers.length === 1 && num.length === 6 ? 'error' : 'default'}
                            style={{ fontSize: '16px', padding: '4px 12px', fontWeight: 600 }}
                        >
                            {num}
                        </Tag>
                    ))}
                </Space>
            )
        }
    ];

    return (
        <div style={{ marginTop: '16px' }}>
            <Row gutter={[16, 16]}>
                {/* Panel Đếm Ngược */}
                <Col xs={24} md={8}>
                    <Card style={{ borderRadius: '12px', height: '100%', background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)', color: 'white' }} bordered={false}>
                        <div style={{ textAlign: 'center' }}>
                            <ClockCircleOutlined style={{ fontSize: '32px', marginBottom: '8px', opacity: 0.8 }} />
                            <Title level={4} style={{ color: 'white', margin: 0 }}>Thời Gian Mở Thưởng</Title>
                            <Text style={{ color: 'rgba(255,255,255,0.8)' }}>Xổ số Miền Nam (16h30)</Text>

                            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
                                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: '8px', minWidth: '70px' }}>
                                    <Title level={2} style={{ color: 'white', margin: 0 }}>{hours.toString().padStart(2, '0')}</Title>
                                    <Text style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>GIỜ</Text>
                                </div>
                                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: '8px', minWidth: '70px' }}>
                                    <Title level={2} style={{ color: 'white', margin: 0 }}>{minutes.toString().padStart(2, '0')}</Title>
                                    <Text style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>PHÚT</Text>
                                </div>
                                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: '8px', minWidth: '70px' }}>
                                    <Title level={2} style={{ color: 'white', margin: 0 }}>{seconds.toString().padStart(2, '0')}</Title>
                                    <Text style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>GIÂY</Text>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>

                {/* Info Panel & Actions */}
                <Col xs={24} md={16}>
                    <Card style={{ borderRadius: '12px', height: '100%' }}>
                        <Flex justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                            <Title level={5} style={{ margin: 0 }}><NumberOutlined /> Trình cào kết quả (Scraper)</Title>
                            <Space>
                                <Button
                                    icon={<SyncOutlined spin={isScraping} />}
                                    onClick={handleRunScraper}
                                    disabled={isScraping}
                                >
                                    Cào thủ công
                                </Button>
                                <Button
                                    type="primary"
                                    icon={<TrophyOutlined />}
                                    onClick={handleRunWinningChecker}
                                    disabled={isScraping || results.length === 0}
                                    style={{ background: '#52c41a', borderColor: '#52c41a' }}
                                >
                                    Dò Số Trúng Khách Hàng
                                </Button>
                            </Space>
                        </Flex>

                        {!isPastDrawTime && results.length === 0 ? (
                            <Alert
                                message="Chưa đến giờ xổ số"
                                description="Hệ thống sẽ tự động lấy kết quả từ minhngoc.net.vn sau 16h30. Bạn có thể bấm [Cào thủ công] để buộc lấy dữ liệu hiện tại."
                                type="info"
                                showIcon
                            />
                        ) : results.length === 0 ? (
                            <Alert
                                message="Đã đến giờ xổ số"
                                description="Đang chờ hệ thống tự động cào hoặc bạn có thể kích hoạt thủ công."
                                type="warning"
                                showIcon
                            />
                        ) : (
                            <Spin spinning={isScraping}>
                                <Table
                                    dataSource={results}
                                    columns={columns}
                                    pagination={false}
                                    rowKey="rank"
                                    size="small"
                                    bordered
                                />
                            </Spin>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
