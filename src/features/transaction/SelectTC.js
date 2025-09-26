import React, { useState } from 'react';
import CategoryEmoji from '../../utils/CategoryEmoji';
import categoryCache from '../../utils/CategoryCache';

const SelectTC = ({ id, value, onChange, type }) => {
  let categories = [];
  if (type === 'transaction') {
    categories = categoryCache.getCategoriesByType('transaction');
  } else if (type === 'travel') {
    categories = categoryCache.getCategoriesByType('travel');
  } else if (type === 'group') {
    categories = categoryCache.getCategoriesByType('group');
  }

  const [isOpen, setIsOpen] = useState(false);
  const selectedValue = value || categories[0].tcCode;
  const selectedCategory =
    categories.find(cat => cat.tcCode === selectedValue) || categories[0];

  const handleSelect = category => {
    onChange(category.tcCode);
    setIsOpen(false);
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleOptionKeyDown = (e, category) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect(category);
    }
  };

  return (
    <div className="w-full relative">
      <div
        id={`${id}-selector`}
        role="button"
        tabIndex={0}
        className="rounded min-w-40 bg-white p-2 cursor-pointer flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-5"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="카테고리 선택"
      >
        <div className="flex items-center gap-1">
          <CategoryEmoji categoryCode={selectedCategory.tcCode} size={6} />
          <div className="text-md text-gray-2 font-medium">
            {selectedCategory.tcName}
          </div>
        </div>
        <svg
          className={`ml-2 w-5 h-5 text-gray-500 transform transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
      {isOpen && (
        <div
          id={`${id}-listbox`}
          role="listbox"
          className="absolute top-full left-0 right-0 mt-1 bg-white rounded shadow-lg z-50 overflow-hidden border border-gray-200 max-h-40 overflow-y-auto"
        >
          {categories.map(category => (
            <div
              key={category.tcCode}
              id={`${id}-option-${category.tcCode}`}
              role="option"
              tabIndex={0}
              className="px-4 py-2 cursor-pointer hover:bg-gray-50 flex items-center gap-1 transition-colors focus:outline-none focus:bg-blue-50"
              onClick={() => handleSelect(category)}
              onKeyDown={e => handleOptionKeyDown(e, category)}
              aria-selected={selectedValue === category.tcCode}
            >
              <CategoryEmoji categoryCode={category.tcCode} size={6} />
              <span className="text-md text-gray-2 font-medium">
                {category.tcName}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectTC;
