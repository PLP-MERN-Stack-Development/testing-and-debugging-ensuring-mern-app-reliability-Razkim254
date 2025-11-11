import React from 'react';

export default function Button({ children, onClick, disabled, variant = 'primary', size = 'md', className = '', ...props }) {
  const classes = `btn-${variant} btn-${size} ${disabled ? 'btn-disabled' : ''} ${className}`.trim();

  return (
    <button onClick={onClick} disabled={disabled} className={classes} {...props}>
      {children}
    </button>
  );
}
