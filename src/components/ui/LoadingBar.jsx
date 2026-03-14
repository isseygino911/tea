import { useState, useEffect } from 'react';

export const LoadingBar = ({ 
  size = 'medium', 
  color = '#ffffff',
  text = 'Luminating your space...',
  showText = true,
  fullPage = false,
  className = '' 
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 98) return 5;
        const jump = Math.random() * 8;
        return prev + jump;
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  const sizes = {
    small: { height: '3px', width: '120px' },
    medium: { height: '4px', width: '200px' },
    large: { height: '6px', width: '300px' },
  };

  const sizeStyle = sizes[size] || sizes.medium;

  const content = (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1.5rem',
      ...(!fullPage ? className : {}),
    }}>
      <div style={{
        width: sizeStyle.width,
        height: sizeStyle.height,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '100px',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: `0 0 20px rgba(255, 255, 255, 0.03)`,
      }}>
        {/* Main Progress Bar */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: `${progress}%`,
          backgroundColor: color,
          borderRadius: '100px',
          transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: `0 0 15px ${color}80, 0 0 30px ${color}40`,
        }} />

        {/* The "Power Beam" - a faster light pulse moving across the progress */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          height: '100%',
          width: '50%',
          background: `linear-gradient(90deg, transparent, ${color}80, transparent)`,
          animation: 'beam 2s infinite cubic-bezier(0.4, 0, 0.2, 1)',
        }} />

        {/* Small "Sparkle" particles that travel across the bar */}
        {[1, 2, 3].map((i) => (
          <div key={i} style={{
            position: 'absolute',
            top: '50%',
            left: '0',
            width: '2px',
            height: '2px',
            backgroundColor: '#fff',
            borderRadius: '50%',
            boxShadow: `0 0 8px #fff`,
            transform: 'translateY(-50%)',
            animation: `particle ${1.5 + i * 0.5}s infinite linear`,
            animationDelay: `${i * 0.3}s`,
          }} />
        ))}
      </div>
      
      {showText && (
        <span style={{
          fontSize: '0.75rem',
          color: 'rgba(255, 255, 255, 0.5)',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.25em',
          animation: 'illuminate 2s infinite alternate ease-in-out',
        }}>
          {text}
        </span>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}>
        {content}
      </div>
    );
  }

  return content;
};

// Circular loading spinner variant
export const LoadingSpinner = ({ 
  size = 40, 
  color = '#ffffff',
  thickness = 3,
  className = '' 
}) => {
  return (
    <div style={{
      width: size,
      height: size,
      border: `${thickness}px solid ${color}20`,
      borderTopColor: color,
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
      ...className,
    }} />
  );
};

// Dots loading animation
export const LoadingDots = ({ 
  size = 8, 
  color = '#ffffff',
  className = '' 
}) => {
  return (
    <div style={{
      display: 'flex',
      gap: '6px',
      alignItems: 'center',
      ...className,
    }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            borderRadius: '50%',
            animation: 'pulse 1.4s ease-in-out infinite',
            animationDelay: `${i * 0.16}s`,
            opacity: 0.4,
          }}
        />
      ))}
    </div>
  );
};

// Full page loading overlay
export const PageLoader = ({ text = 'Loading...' }) => {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      gap: '2rem',
    }}>
      <LoadingSpinner size={60} />
      <span style={{
        fontSize: '1rem',
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: 500,
      }}>
        {text}
      </span>
    </div>
  );
};
