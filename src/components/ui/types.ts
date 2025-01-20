import { ButtonHTMLAttributes, HTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonBaseProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'>;

export interface ButtonProps extends ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  className?: string;
  children: React.ReactNode;
}

export interface BaseComponentProps extends Omit<HTMLAttributes<HTMLElement>, 'className'> {
  className?: string;
  children: React.ReactNode;
}

export interface CardBaseProps extends BaseComponentProps {}
export interface CardHeaderProps extends BaseComponentProps {}
export interface CardContentProps extends BaseComponentProps {}