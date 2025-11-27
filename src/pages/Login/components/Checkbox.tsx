interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Checkbox = ({ label, checked, onChange }: CheckboxProps) => {
  return (
    <label className="checkbox-container">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="checkmark"></span>
      {label}
    </label>
  );
};
