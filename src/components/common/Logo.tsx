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
        transform: scale(1.05);
        opacity: 0.9;
      }
    }
    
    .logo-animated {
      animation: logoPulse 2s ease-in-out infinite !important;
    }
    
    .logo-orbit {
      animation: logoOrbitRotate 4s linear infinite !important;
    }
  `;

  // Inject CSS for animations
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      const existingStyle = document.getElementById('logo-animation-styles');
      if (!existingStyle) {
        const style = document.createElement('style');
        style.id = 'logo-animation-styles';
        style.textContent = logoKeyframes;
        document.head.appendChild(style);
      }
    }
  }, [logoKeyframes]);

  const renderIcon = () => (
    <svg
      width={size * 0.6}
      height={size * 0.6}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${animated ? 'logo-animated' : ''}`}
      style={{
        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
      }}
    >
      <defs>
        <linearGradient id={`lotteryOrbitGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0.8)" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      
      {/* Orbiting circles */}
      <g 
        className={animated ? 'logo-orbit' : ''}
        style={{
          transformOrigin: '12px 12px'
        }}
      >
        <circle
          cx="8"
          cy="8"
          r="2.5"
          fill={`url(#lotteryOrbitGradient-${size})`}
        />
        <circle
          cx="16"
          cy="8"
          r="2.5"
          fill={`url(#lotteryOrbitGradient-${size})`}
        />
        <circle
          cx="8"
          cy="16"
          r="2.5"
          fill={`url(#lotteryOrbitGradient-${size})`}
        />
        <circle
          cx="16"
          cy="16"
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
    return (
      <div
        className={animated ? 'logo-animated' : ''}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: isDark 
            ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          boxShadow: isDark 
            ? '0 3px 10px rgba(79, 172, 254, 0.3)'
            : '0 3px 10px rgba(102, 126, 234, 0.3)',
        }}
      >
        {renderIcon()}
      </div>
    );
  }

  return (
    <div 
      className={`flex items-center gap-3 ${className} ${animated ? 'logo-animated' : ''}`}
    >
      {/* Logo Icon Container */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: isDark 
            ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `${variant === 'collapsed' ? '1px' : '2px'} solid rgba(255, 255, 255, 0.3)`,
          boxShadow: isDark 
            ? '0 3px 10px rgba(79, 172, 254, 0.3)'
            : '0 3px 10px rgba(102, 126, 234, 0.3)',
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
