'use client';

import { useFormContext, Controller } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Label } from '../ui/label';

type Option = string | { value: string; label: string };
interface SelectInputProps {
  name: string;
  label: string;
  options: Option[];
}

export function SelectInput({ name, label, options }: SelectInputProps) {
  const { control } = useFormContext();
  return (
    <div className="p-2">
      <Label htmlFor={name} className="pb-2">
        {label}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select value={field.value || ''} onValueChange={field.onChange} name={field.name}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {options.map((option) => {
                  if (typeof option === 'string') {
                    return (
                      <SelectItem key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </SelectItem>
                    );
                  } else {
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    );
                  }
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
}
