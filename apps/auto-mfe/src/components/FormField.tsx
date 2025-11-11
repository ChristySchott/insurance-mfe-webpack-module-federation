import { UseFormRegister, FieldError } from 'react-hook-form'

interface FormFieldProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'tel' | 'date'
  placeholder?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>
  error?: FieldError
  maxLength?: number
  disabled?: boolean
}

export function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  register,
  error,
  maxLength,
  disabled = false,
}: FormFieldProps) {
  return (
    <div>
      <label htmlFor={name} className="label">
        {label}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        className={`input-field ${error ? 'input-error' : ''}`}
        {...register(name)}
      />
      {error && <p className="error-message">{error.message}</p>}
    </div>
  )
}
