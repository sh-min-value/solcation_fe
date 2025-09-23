const InputForm = ({
  value,
  onChange,
  type = 'text',
  placeholder,
  maxLength,
  title,
  error,
}) => {
  return (
    <div className="w-full flex flex-col items-right justify-center">
      <div className="mb-1 font-md text-md text-white ml-1">{title}</div>
      <div className="w-full bg-white rounded-2xl p-4 py-2 shadow-sm">
        <input
          type={type}
          placeholder={placeholder}
          className="w-full text-lg border-none outline-none bg-transparent"
          maxLength={maxLength}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      </div>
      <div className="flex flex-row items-center justify-between mx-2 mt-1">
        <p
          className={`text-red-500 text-xs mt-1 ${
            !value || error ? 'text-red-500' : 'text-third'
          }`}
        >
          {error ? error : ''}
        </p>
        <div className="text-right text-white text-sm">
          {Math.min(value.length, maxLength)}/{maxLength}
        </div>
      </div>
    </div>
  );
};

export default InputForm;
