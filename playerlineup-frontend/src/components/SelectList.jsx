import { useFormContext } from 'react-hook-form';

export default function SelectList({
  label, name, placeholder, items, validationRules, ...rest
}) {
  const {
    register,
    formState: {
      errors,
      isSubmitting,
    },
  } = useFormContext();

  const hasError = name in errors;

  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <select
        {...register(name, validationRules)}
        id={name}
        className="form-select"
        disabled={isSubmitting}
        {...rest}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {items.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
        
      </select>
      {hasError ? (
        <div className="form-text text-danger">
          {errors[name].message}
        </div>
      ) : null}
    </div>
  );
}