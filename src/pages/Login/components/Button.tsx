import type { ReactNode } from 'react';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  onClick?: () => void;
  children: ReactNode;
  disabled?: boolean;
}

export const Button = ({
  type = 'button',
  className = '',
  onClick,
  children,
  disabled = false,
}: ButtonProps) => {
  return (
    <button type={type} className={className} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};
