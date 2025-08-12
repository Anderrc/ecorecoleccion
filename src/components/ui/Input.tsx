import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="text-gray-400">
                {icon}
              </div>
            </div>
          )}
          <input
            ref={ref}
            className={`
              block w-full rounded-lg border border-gray-300 px-3 py-2 
              placeholder-gray-500 shadow-sm transition-eco
              focus:border-eco-primary focus:outline-none focus:ring-1 focus:ring-eco-primary
              disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500
              ${icon ? 'pl-10' : ''}
              ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
