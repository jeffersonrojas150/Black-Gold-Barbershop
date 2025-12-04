import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label 
            className="block text-sm font-light text-gray-300 mb-2 tracking-wide"
            style={{ fontWeight: 300 }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          style={{ fontWeight: 300 }}
          className={`
            w-full px-4 py-3 
            border-2
            text-white placeholder-gray-500
            rounded-lg
            focus:outline-none
            transition-colors duration-200
            font-light
            ${error ? 'border-red-500 bg-[var(--color-dark-lighter)]' : 'bg-[var(--color-dark-lighter)] border-[var(--color-dark-light)] focus:border-[var(--color-primary)]'}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500 font-light">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';