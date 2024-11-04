import React from 'react';

function Button({ children, onClick, type = 'button', className = '', variant = 'primary', ...props }) {
  const baseStyles = 'px-4 py-2 rounded focus:outline-none focus:ring';
  const variantStyles = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-300',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-300',
    success: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-300',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-300',
  };

  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${className}`;

  return (
    <button type={type} onClick={onClick} className={combinedStyles} {...props}>
      {children}
    </button>
  );
}

export default Button;

