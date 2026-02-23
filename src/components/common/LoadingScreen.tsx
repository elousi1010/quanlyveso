import React from 'react';
import { Flex, Typography, Spin } from 'antd';
import Logo from './Logo';

const { Text } = Typography;

interface LoadingScreenProps {
  message?: string;
  size?: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Đang tải...',
  size = 60
}) => {
  return (
    <Flex
      vertical
      align="center"
      justify="center"
      style={{ minHeight: '400px' }}
      gap={24}
    >
      {/* Animated Logo */}
      <Logo
        size={size}
        animated={true}
        variant="icon"
        showText={false}
      />

      {/* Loading message */}
      <Flex vertical align="center" gap={12}>
        <Spin size="large" />
        <Text
          type="secondary"
          style={{
            fontWeight: 500,
            textAlign: 'center',
          }}
        >
          {message}
        </Text>
      </Flex>
    </Flex>
  );
};

export { LoadingScreen };
export default LoadingScreen;
