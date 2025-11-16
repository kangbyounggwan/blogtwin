import React from 'react';

interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  children,
  className = '',
  onClick,
}) => {
  const baseStyles = 'bg-white rounded-lg p-4';

  const variantStyles = {
    default: 'shadow-md border border-gray-100',
    elevated: 'shadow-lg',
    outlined: 'border-2 border-gray-200',
  };

  const clickableStyles = onClick ? 'cursor-pointer hover:shadow-xl transition-shadow active:scale-[0.98]' : '';

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${clickableStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
