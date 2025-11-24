interface CheckboxProps {
  label: string;
}

export const Checkbox = ({ label }: CheckboxProps) => {
  return (
    <label className="checkbox-container">
      <input type="checkbox" />
      <span className="checkmark"></span>
      {label}
    </label>
  );
};
