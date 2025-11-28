'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface TextInputProps {
  name?: string;
  type?: string;
  placeholder?: string;
  label?: string;
  readOnly?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function TextInput({
  name,
  type = 'text',
  placeholder,
  label,
  readOnly = false,
  value,
  onChange,
}: TextInputProps) {
  const formContext = useFormContext();
  const {
    register,
    setValue,
    formState: { errors },
    getValues,
  } = formContext || {};

  const error = name && (errors?.[name]?.message as string | undefined);

  // Handler for currency input
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e);
      return;
    }

    if (!name || !setValue) return;

    // Allow user to freely type, just update form value as number (or empty)
    let raw = e.target.value.replace(/,/g, '');
    let num = parseFloat(raw);
    if (isNaN(num)) {
      setValue(name, '');
    } else {
      setValue(name, num, { shouldValidate: true });
    }
  };

  // Format on blur
  const handleCurrencyBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/,/g, '');
    let num = parseFloat(raw);
    if (!isNaN(num)) {
      num = Math.round(num * 100) / 100;
      e.target.value = num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  };

  // Handler for number input
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e);
      return;
    }

    if (!name || !setValue) return;

    let raw = e.target.value;
    let num = parseFloat(raw);
    if (isNaN(num)) {
      setValue(name, '');
    } else {
      setValue(name, num, { shouldValidate: true });
    }
  };

  return (
    <div className="flex flex-col p-2">
      {label && (
        <Label htmlFor={name} className="pb-2">
          {label}
        </Label>
      )}
      {type === 'currency' ? (
        <Input
          type="text"
          inputMode="decimal"
          placeholder={placeholder}
          className={`w-full ${error ? 'border-red-500' : ''} bg-white ${
            readOnly ? 'bg-gray-100' : ''
          }`}
          readOnly={readOnly}
          defaultValue={
            name &&
            getValues &&
            getValues(name) !== undefined &&
            getValues(name) !== ''
              ? Number(getValues(name)).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : ''
          }
          {...(value !== undefined && { value })}
          {...(onChange ? { onChange } : { onChange: handleCurrencyChange })}
          onBlur={handleCurrencyBlur}
        />
      ) : type === 'number' ? (
        <Input
          type="number"
          inputMode="numeric"
          placeholder={placeholder}
          className={`w-full ${error ? 'border-red-500' : ''} bg-white ${
            readOnly ? 'bg-gray-100' : ''
          }`}
          readOnly={readOnly}
          defaultValue={
            name && getValues && getValues(name) !== undefined
              ? getValues(name)
              : ''
          }
          {...(value !== undefined && { value })}
          {...(onChange ? { onChange } : { onChange: handleNumberChange })}
        />
      ) : (
        <Input
          type={type}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full ${readOnly ? 'bg-gray-100' : 'bg-white'}`}
          {...(value !== undefined && { value })}
          {...(onChange && { onChange })}
          {...(name && register ? register(name) : {})}
        />
      )}
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
  );
}
