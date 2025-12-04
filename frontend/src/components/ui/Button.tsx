import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed tracking-wide';
  
  const variants = {
    primary: 'text-black shadow-lg hover:shadow-xl',
    secondary: 'text-white',
    outline: 'border-2 hover:text-black',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]';
      case 'secondary':
        return 'bg-[var(--color-dark-lighter)] hover:bg-[var(--color-dark-light)]';
      case 'outline':
        return 'border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700';
      default:
        return '';
    }
  };

  return (
    <button
      style={{ fontWeight: 500 }}
      className={`${baseStyles} ${getVariantStyles()} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
          Cargando...
        </div>
      ) : (
        children
      )}
    </button>
  );
};