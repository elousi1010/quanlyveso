import React from 'react';
import { useTheme } from '@mui/material';

interface LogoProps {
  size?: number;
  animated?: boolean;
  showText?: boolean;
  variant?: 'full' | 'icon' | 'collapsed';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  size = 36,
  animated = false,
  showText = true,
  variant = 'full',
  className = ''
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // CSS Animation for rotating logo
  const logoKeyframes = `
    @keyframes logoOrbitRotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    
    @keyframes logoPulse {
      0%, 100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.1);
        opacity: 0.8;
      }
    }
  `;

  // Inject CSS for animations
  React.useEffect(() => {
    if (animated && typeof document !== 'undefined') {
      const existingStyle = document.getElementById('logo-animation-styles');
      if (!existingStyle) {
        const style = document.createElement('style');
        style.id = 'logo-animation-styles';
        style.textContent = logoKeyframes;
        document.head.appendChild(style);
      }
    }
  }, [animated, logoKeyframes]);

  const renderIcon = () => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
        ...(animated && {
          animation: 'logoPulse 2s ease-in-out infinite'
        })
      }}
    >
      <defs>
        <linearGradient id={`lotteryGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isDark ? '#4facfe' : '#667eea'} stopOpacity="1" />
          <stop offset="100%" stopColor={isDark ? '#00f2fe' : '#764ba2'} stopOpacity="1" />
        </linearGradient>
        <linearGradient id={`lotteryOrbitGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0.8)" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      
      {/* Main circle */}
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={`url(#lotteryGradient-${size})`}
        strokeWidth="2.5"
        fill={`url(#lotteryGradient-${size})`}
        opacity="0.1"
      />
      
      {/* Orbiting circles */}
      <g 
        transform="translate(12, 12)"
        style={{
          ...(animated && {
            animation: 'logoOrbitRotate 4s linear infinite',
            transformOrigin: '0 0'
          })
        }}
      >
        <circle
          cx="-4"
          cy="-4"
          r="2.5"
          fill={`url(#lotteryOrbitGradient-${size})`}
        />
        <circle
          cx="4"
          cy="-4"
          r="2.5"
          fill={`url(#lotteryOrbitGradient-${size})`}
        />
        <circle
          cx="-4"
          cy="4"
          r="2.5"
          fill={`url(#lotteryOrbitGradient-${size})`}
        />
        <circle
          cx="4"
          cy="4"
          r="2.5"
          fill={`url(#lotteryOrbitGradient-${size})`}
        />
      </g>
      
      {/* Center circle */}
      <circle
        cx="12"
        cy="12"
        r="3.5"
        fill="rgba(255, 255, 255, 0.2)"
        stroke="rgba(255, 255, 255, 0.5)"
        strokeWidth="1"
      />
      
      {/* Dollar sign */}
      <text
        x="12"
        y="15"
        textAnchor="middle"
        fontSize="8"
        fill="white"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
        style={{
          filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))'
        }}
      >
        $
      </text>
    </svg>
  );

  const renderText = () => {
    if (variant === 'collapsed') {
      return (
        <div
          style={{
            color: 'white',
            fontWeight: '800',
            fontSize: `${Math.max(12, size * 0.33)}px`,
            lineHeight: 1,
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
            letterSpacing: '0.5px',
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          }}
        >
          O
        </div>
      );
    }

    return (
      <div>
        <div
          style={{
            color: 'white',
            fontWeight: '800',
            fontSize: `${Math.max(18, size * 0.5)}px`,
            lineHeight: 1,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            letterSpacing: '1px',
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          }}
        >
          Hnoa
        </div>
        <div
          style={{
            color: 'rgba(255, 255, 255, 0.95)',
            fontWeight: '600',
            fontSize: `${Math.max(10, size * 0.28)}px`,
            lineHeight: 1,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
          }}
        >
          Lottery
        </div>
      </div>
    );
  };

  if (variant === 'icon') {
    return renderIcon();
  }

  return (
    <div 
      className={`flex items-center gap-3 ${className}`}
      style={{
        ...(animated && {
          animation: 'logoPulse 2s ease-in-out infinite'
        })
      }}
    >
      {/* Logo Icon Container */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: variant === 'collapsed' ? '6px' : '10px',
          background: 'rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `${variant === 'collapsed' ? '1px' : '2px'} solid rgba(255, 255, 255, 0.3)`,
        }}
      >
        {renderIcon()}
      </div>
      
      {/* Logo Text */}
      {showText && renderText()}
    </div>
  );
};

export { Logo };
export default Logo;
