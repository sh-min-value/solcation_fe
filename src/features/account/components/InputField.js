import React from 'react';

// 입력 필드
const InputField = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  type = 'text',
  maxLength,
  className = '',
  disabled = false,
}) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <label htmlFor={id} className="text-gray04 text-base font-medium">
          {label}
        </label>
        {error && <span className="text-group-1 text-[10px]">{error}</span>}
      </div>
      <div className="relative">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`w-full text-lg border-none outline-none bg-transparent text-white placeholder-gray04 px-1 py-2 text-left ${
            disabled ? 'opacity-100 cursor-default' : ''
          } ${className}`}
          value={value || ''}
          onChange={onChange}
          disabled={disabled}
        />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-main"></div>
      </div>
    </div>
  );
};

export default InputField;
