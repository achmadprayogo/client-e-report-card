import './Input.css';
import { Option } from 'index';
import OptionsInput from './OptionsInput';

interface inputProps {
  label: string;
  labelWidth: string;
  type: string;
  name: string;
  required?: boolean;
  value?: string | number;
  readOnly?: boolean;
  placeholder?: string;
  options?: Option[];
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>,
  ) => void;
}

export default function Input({
  label,
  type,
  name,
  options,
  labelWidth,
  required,
  value,
  readOnly,
  onChange,
  placeholder,
}: inputProps) {
  const className =
    'font-mono block w-full border-b bg-transparent text-lg text-white focus:outline-none pb-1';
  return (
    <div className="flex flex-row space-x-4 h-fit">
      <label className="text-nowrap text-lg font-medium text-white" style={{ width: labelWidth }}>
        {label}
      </label>
      {(() => {
        switch (type) {
          case 'select':
            return (
              <select
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className={className}
              >
                <OptionsInput options={options} />
              </select>
            );
          case 'date':
            return (
              <input
                type={type}
                value={
                  value
                    ? new Date(
                        new Date(value).getTime() - new Date(value).getTimezoneOffset() * 60000,
                      )
                        .toISOString()
                        .split('T')[0]
                    : value
                }
                readOnly={readOnly}
                name={name}
                onChange={onChange}
                required={required}
                className={
                  className +
                  '[&::-webkit-calendar-picker-indicator]:bg-transparent [&::-webkit-calendar-picker-indicator]:invert-[1] [&::-webkit-calendar-picker-indicator]:hover:cursor-pointer'
                }
              />
            );
          default:
            return (
              <input
                type={type}
                value={value}
                placeholder={placeholder}
                readOnly={readOnly}
                name={name}
                onChange={onChange}
                required={required}
                className={className}
              />
            );
        }
      })()}
    </div>
  );
}
