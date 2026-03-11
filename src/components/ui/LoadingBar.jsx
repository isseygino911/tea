import { useState, useEffect } from 'react';

export const LoadingBar = ({ 
  size = 'medium', 
  color = '#ffffff',
  text = 'Loading...',
  showText = true,
  className = '' 
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate progress animation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return 10; // Reset to create looping effect
        return prev + Math.random() * 15;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const sizes = {
    small: { height: '2px', width: '100px' },
    medium: { height: '3px', width: '150px' },
    large: { height: '4px', width: '200px' },
  };

  const sizeStyle = sizes[size] || sizes.medium;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      ...className,
    }}>
      <div style={{
        width: sizeStyle.width,
        height: sizeStyle.height,
        backgroundColor: `${color}20`,
        borderRadius: sizeStyle.height,
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{
          width: `${Math.min(progress, 100)}%`,
          height: '100%',
          backgroundColor: color,
          borderRadius: sizeStyle.height,
          transition: 'width 0.3s ease-out',
          boxShadow: `0 0 10px ${color}50`,
        }} />
        {/* Shimmer effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(90deg, transparent, ${color}30, transparent)`,
          animation: 'shimmer 1.5s infinite',
        }} />
      </div>
      
      {showText && (
        <span style={{
          fontSize: '0.875rem',
          color: `${color}80`,
          fontWeight: 500,
        }}>
          {text}
        </span>
      )}
    </div>
  );
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
