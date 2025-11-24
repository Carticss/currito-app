import type { ChangeEvent } from 'react';

interface InputProps {
  id: string;
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  label?: string;
  rightElement?: React.ReactNode;
}

export const Input = ({
  id,
  type,
  value,
  onChange,
  placeholder,
  required = false,
  label,
  rightElement,
}: InputProps) => {
  return (
    <div className="form-group">
      {label && <label htmlFor={id}>{label}</label>}
      <div className={rightElement ? "password-input-wrapper" : ""}>
        <input
          type={type}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
        {rightElement}
      </div>
    </div>
  );
};
