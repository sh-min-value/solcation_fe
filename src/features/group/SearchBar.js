import React from 'react';

const SearchBar = ({
  searchTerm,
  onChange,
  onSubmit,
  placeholder,
  icon: IconComponent,
  submitOnChange = false,
}) => {
  const handleSubmit = e => {
    const value = e.target.value;
    onChange(value);
    if (submitOnChange) {
      // 입력할 때마다 바로 submit 호출
      onSubmit?.(e);
    }
  };

  return (
    <div className="mb-5">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder || '검색어를 입력하세요'}
          className="w-full px-4 py-2 pr-12 rounded-3xl border-2 border-main focus:outline-none focus:ring-2 focus:ring-main/20"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <IconComponent className="w-6 h-6 text-main" />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
