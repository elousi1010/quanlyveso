import React from 'react';

interface LogoProps {
  size?: number;
  animated?: boolean;
  showText?: boolean;
  variant?: 'full' | 'icon' | 'collapsed';
  className?: string;
  style?: React.CSSProperties;
}

const Logo: React.FC<LogoProps> = ({
  size = 36,
  showText = true,
  variant = 'full',
  className = '',
  style = {}
}) => {
  const renderIcon = () => (
    <svg
      width={size * 0.6}
      height={size * 0.6}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 2L3 7V17L12 22L21 17V7L12 2Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 22V12"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 7L12 12L3 7"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const renderText = () => {
    if (variant === 'collapsed') {
      return (
        <div
          style={{
            color: '#1e293b',
            fontWeight: '800',
            fontSize: `${Math.max(12, size * 0.33)}px`,
            lineHeight: 1,
            fontFamily: '"Plus Jakarta Sans", sans-serif',
          }}
        >
          D
        </div>
      );
    }

    return (
      <div>
        <div
          style={{
            color: '#1e293b',
            fontWeight: '800',
            fontSize: `${Math.max(16, size * 0.45)}px`,
            lineHeight: 1.1,
            fontFamily: '"Plus Jakarta Sans", sans-serif',
          }}
        >
          Daily
        </div>
        <div
          style={{
            color: '#64748b',
            fontWeight: '600',
            fontSize: `${Math.max(10, size * 0.25)}px`,
            lineHeight: 1,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
          }}
        >
          Veso
        </div>
      </div>
    );
  };

  if (variant === 'icon') {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '12px',
          background: '#2563eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
          ...style
        }}
      >
        {renderIcon()}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 ${className}`}
      style={style}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '10px',
          background: '#2563eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {renderIcon()}
      </div>
      {showText && renderText()}
    </div>
  );
};

export { Logo };
export default Logo;
