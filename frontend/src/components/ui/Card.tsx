import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', style, onClick }) => {
  return (
    <div 
      className={`rounded-xl shadow-2xl ${className}`}
      style={{
        backgroundColor: 'var(--color-dark-light)',
        borderColor: 'var(--color-dark-lighter)',
        borderWidth: '1px',
        ...style
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};