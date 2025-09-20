import React, { useState } from 'react';
import CategoryEmoji from '../../utils/CategoryEmoji';

const transactionCategories = [
  { id: 1, name: '식비', code: 'FOOD' },
  { id: 2, name: '카페, 간식', code: 'CAFE_AND_SNACK' },
  { id: 3, name: '편의점, 마트', code: 'STORE' },
  { id: 4, name: '술, 유흥', code: 'PLEASURE' },
  { id: 5, name: '쇼핑', code: 'SHOPPING' },
  { id: 6, name: '의료', code: 'MEDICAL_TREATMENT' },
  { id: 7, name: '숙박', code: 'LODGMENT' },
  { id: 8, name: '교통', code: 'TRANSPORTATION' },
  { id: 9, name: '이체', code: 'TRANSFER' },
  { id: 10, name: '기타', code: 'ETC' },
];

const travelCategories = [
  { id: 1, name: '음식 · 미식', code: 'FOOD' },
  { id: 2, name: '카페 · 간식', code: 'CAFE_AND_SNACK' },
  { id: 3, name: '쇼핑 · 마트', code: 'STORE' },
  { id: 4, name: '술 · 유흥', code: 'PLEASURE' },
  { id: 5, name: '쇼핑', code: 'SHOPPING' },
  { id: 6, name: '의료', code: 'MEDICAL_TREATMENT' },
  { id: 7, name: '숙박', code: 'LODGMENT' },
  { id: 8, name: '교통', code: 'TRANSPORTATION' },
  { id: 9, name: '이체', code: 'TRANSFER' },
  { id: 10, name: '기타', code: 'ETC' },
];

const groupCategories = [
  { id: 1, name: '친구', code: 'FRIENDS' },
  { id: 2, name: '가족', code: 'FAMILY' },
  { id: 3, name: '연인', code: 'LOVER' },
  { id: 4, name: '기타', code: 'ETC' },
];

const SelectTC = ({ id, value, onChange, type }) => {
  let categories = [];
  if (type === 'transaction') {
    categories = transactionCategories;
  } else if (type === 'travel') {
    categories = travelCategories;
  } else if (type === 'group') {
    categories = groupCategories;
  }

  const [isOpen, setIsOpen] = useState(false);
  const selectedValue = value || categories[0].code;
  const selectedCategory =
    categories.find(cat => cat.code === selectedValue) || categories[0];

  const handleSelect = category => {
    onChange(category.code);
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
        id={id}
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
          <CategoryEmoji categoryCode={selectedCategory.code} size={6} />
          <div className="text-md text-gray-2 font-medium">
            {selectedCategory.name}
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
          id={id}
          role="listbox"
          className="absolute top-full left-0 right-0 mt-1 bg-white rounded shadow-lg z-50 overflow-hidden border border-gray-200 max-h-40 overflow-y-auto"
        >
          {categories.map(category => (
            <div
              key={category.code}
              id={id}
              role="option"
              tabIndex={0}
              className="px-4 py-2 cursor-pointer hover:bg-gray-50 flex items-center gap-1 transition-colors focus:outline-none focus:bg-blue-50"
              onClick={() => handleSelect(category)}
              onKeyDown={e => handleOptionKeyDown(e, category)}
              aria-selected={selectedValue === category.code}
            >
              <CategoryEmoji categoryCode={category.code} size={6} />
              <span className="text-md text-gray-2 font-medium">
                {category.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectTC;
