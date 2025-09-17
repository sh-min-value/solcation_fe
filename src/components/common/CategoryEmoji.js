import React from 'react';

const emojiMap = {
  'FOOD': '🍚',
  'CAFE_AND_SNACK': '☕',
  'STORE': '🏪',
  'PLEASURE': '🍺',
  'SHOPPING': '🛍️',
  'MEDICAL_TREATMENT': '🏥',
  'LODGMENT': '🛏️',
  'TRANSPORTATION': '🚗',
  'TRANSFER': '💰',
  'ETC': '💬'
};

const CategoryEmoji = ({ categoryCode, size = 24 }) => {
  const getSizeClass = (size) => {
    if (size <= 8) return 'text-xs';
    if (size <= 12) return 'text-sm';
    if (size <= 16) return 'text-base';
    if (size <= 20) return 'text-lg';
    if (size <= 24) return 'text-xl';
    if (size <= 32) return 'text-2xl';
    return 'text-xl';
  };

  return (
    <span className={`${getSizeClass(size)} mr-1`}>
      {emojiMap[categoryCode] || '💬'}
    </span>
  );
};

export default CategoryEmoji;
