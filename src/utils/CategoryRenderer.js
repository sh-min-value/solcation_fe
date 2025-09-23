import React from 'react';
import categoryManager from './CategoryManager';

/**
 * 동적 카테고리 렌더링 시스템
 * 하드코딩된 switch문을 제거하고 동적으로 렌더링
 */

// 아이콘 컴포넌트 매핑
const ICON_COMPONENTS = {
  // 거래 카테고리 아이콘
  transaction: {
    'FOOD': 'BiSolidBowlRice',
    'CAFE_AND_SNACK': 'BiSolidCoffee',
    'STORE': 'BiSolidStore',
    'PLEASURE': 'BiSolidDrink',
    'SHOPPING': 'BiSolidShoppingBag',
    'MEDICAL_TREATMENT': 'FaBriefcaseMedical',
    'LODGMENT': 'BiSolidBed',
    'TRANSPORTATION': 'AiFillCar',
    'TRANSFER': 'BsFillPiggyBankFill',
    'ETC': 'BiDotsHorizontalRounded'
  },
  // 여행 카테고리 아이콘
  travel: {
    'FOOD': 'BiSolidBowlRice',
    'LEISURE': 'MdKitesurfing',
    'RECREATION': 'FaTree',
    'CULTURE': 'HiLibrary',
    'SHOPPING': 'AiFillShopping',
    'FESTIVAL': 'MdFestival',
    'SIGHTSEEING': 'BiSolidBus'
  }
};

/**
 * 카테고리 아이콘을 동적으로 렌더링
 */
export const renderCategoryIcon = (type, categoryCode, className = 'w-3 h-3 text-gray-500') => {
  const iconName = ICON_COMPONENTS[type]?.[categoryCode] || 'BiDotsHorizontalRounded';
  const categoryName = categoryManager.getCategoryName(type, categoryCode);
  
  // 실제 아이콘 컴포넌트를 동적으로 import하고 렌더링하는 로직
  // 현재는 기본 구조만 제공
  return {
    iconName,
    categoryName,
    className
  };
};

/**
 * 카테고리 정보를 가져오는 유틸리티
 */
export const getCategoryInfo = (type, categoryCode) => {
  return {
    code: categoryCode,
    name: categoryManager.getCategoryName(type, categoryCode),
    emoji: type === 'group' ? categoryManager.getEmojiName(type, categoryCode) : null
  };
};

/**
 * 모든 카테고리 옵션을 가져오는 유틸리티
 */
export const getCategoryOptions = (type) => {
  return categoryManager.getAllCategoryNames(type);
};
