import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { CardBaseProps, CardHeaderProps, CardContentProps } from './types';

export const Card = forwardRef<HTMLDivElement, CardBaseProps>(({ 
  children, 
  className,
  ...props 
}, ref) => {
  return (
    <div 
      ref={ref}
      className={clsx(
        'bg-white dark:bg-dark-card rounded-xl shadow-sm overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(({ 
  children, 
  className,
  ...props 
}, ref) => {
  return (
    <div 
      ref={ref}
      className={clsx(
        'px-4 py-3 border-b border-gray-100 dark:border-gray-800',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(({ 
  children, 
  className,
  ...props 
}, ref) => {
  return (
    <div 
      ref={ref}
      className={clsx('p-4', className)}
      {...props}
    >
      {children}
    </div>
  );
});

// Add displayNames for better debugging
Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardContent.displayName = 'CardContent';

// Export types for external use
export type { CardBaseProps, CardHeaderProps, CardContentProps };