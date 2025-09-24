import React from 'react';
import { AiFillSchedule, AiFillShopping, AiFillCar } from 'react-icons/ai';
import { FaCheckCircle, FaTree, FaBriefcaseMedical } from 'react-icons/fa';
import {
  BiSolidPlaneAlt,
  BiSolidBus,
  BiSolidBowlRice,
  BiSolidCoffee,
  BiSolidStore,
  BiSolidDrink,
  BiSolidShoppingBag,
  BiSolidBed,
  BiDotsHorizontalRounded,
} from 'react-icons/bi';
import { MdKitesurfing, MdFestival } from 'react-icons/md';
import { HiLibrary } from 'react-icons/hi';
import { BsFillPiggyBankFill } from 'react-icons/bs';
import categoryCache from './CategoryCache';
import categoryManager from './CategoryManager';
import { getDefaultCategoryCode, getFallbackName } from './CategoryConfig';

// 그룹 카테고리 아이콘 import
import FamilyIcon from '../assets/categoryIcons/family.svg';
import FriendIcon from '../assets/categoryIcons/friend.svg';
import LoveIcon from '../assets/categoryIcons/love.svg';
import PeerIcon from '../assets/categoryIcons/peer.svg';

// state 값에 따른 아이콘 반환
export const getStateIcon = (
  state,
  className = 'w-3 h-3 text-gray-500'
) => {
  switch (state) {
    case 'BEFORE':
      return (
        <>
          <AiFillSchedule className={className} />
          <p className="w-11">여행 전</p>
        </>
      );
    case 'ONGOING':
      return (
        <>
          <BiSolidPlaneAlt className={className} />
          <p className="w-11">여행 중</p>
        </>
      );
    case 'FINISH':
      return (
        <>
          <FaCheckCircle className={className} />
          <p className="w-13">여행 완료</p>
        </>
      );
    default:
      return (
        <>
          <AiFillSchedule className={className} />
          <p>여행 전</p>
        </>
      );
  }
};

// 카테고리 아이콘 반환
export const getTravelCategoryIcon = (
  categoryId,
  className = 'w-3 h-3 text-gray-500'
) => {
  switch (categoryId) {
    case 'FOOD':
      return (
        <>
          <BiSolidBowlRice className={className} />
          <p className='max-w-16 truncate'>{categoryCache.getTravelCategoryName(categoryId)}</p>
        </>
      );
    case 'LEISURE':
      return (
        <>
          <MdKitesurfing className={className} />
          <p className='max-w-16 truncate'>{categoryCache.getTravelCategoryName(categoryId)}</p>
        </>
      );
    case 'RECREATION':
      return (
        <>
          <FaTree className={className} />
          <p className='max-w-16 truncate'>{categoryCache.getTravelCategoryName(categoryId)}</p>
        </>
      );
    case 'CULTURE':
      return (
        <>
          <HiLibrary className={className} />
          <p className='max-w-16 truncate'>{categoryCache.getTravelCategoryName(categoryId)}</p>
        </>
      );
    case 'SHOPPING':
      return (
        <>
          <AiFillShopping className={className} />
          <p className='max-w-16 truncate'>{categoryCache.getTravelCategoryName(categoryId)}</p>
        </>
      );
    case 'FESTIVAL':
      return (
        <>
          <MdFestival className={className} />
          <p className='max-w-16 truncate'>{categoryCache.getTravelCategoryName(categoryId)}</p>
        </>
      );
    case 'SIGHTSEEING':
      return (
        <>
          <BiSolidBus className={className} />
          <p className='max-w-16 truncate'>{categoryCache.getTravelCategoryName(categoryId)}</p>
        </>
      );
    default:
      return (
        <>
          <BiDotsHorizontalRounded className={className} />
          <p className='max-w-16 truncate'>기타</p>
        </>
      );
  }
};

export const getTransactionCategoryIcon = (
  categoryId,
  className = 'w-3 h-3 text-gray-500'
) => {
  switch (categoryId) {
    case 'FOOD':
      return (
        <>
          <BiSolidBowlRice className={className} />
          <p>{categoryCache.getTransactionCategoryName(categoryId)}</p>
        </>
      );
    case 'CAFE_AND_SNACK':
      return (
        <>
          <BiSolidCoffee className={className} />
          <p>{categoryCache.getTransactionCategoryName(categoryId)}</p>
        </>
      );
    case 'STORE':
      return (
        <>
          <BiSolidStore className={className} />
          <p>{categoryCache.getTransactionCategoryName(categoryId)}</p>
        </>
      );
    case 'PLEASURE':
      return (
        <>
          <BiSolidDrink className={className} />
          <p>{categoryCache.getTransactionCategoryName(categoryId)}</p>
        </>
      );
    case 'SHOPPING':
      return (
        <>
          <BiSolidShoppingBag className={className} />
          <p>{categoryCache.getTransactionCategoryName(categoryId)}</p>
        </>
      );
    case 'MEDICAL_TREATMENT':
      return (
        <>
          <FaBriefcaseMedical className={className} />
          <p>{categoryCache.getTransactionCategoryName(categoryId)}</p>
        </>
      );
    case 'LODGMENT':
      return (
        <>
          <BiSolidBed className={className} />
          <p>{categoryCache.getTransactionCategoryName(categoryId)}</p>
        </>
      );
    case 'TRANSPORTATION':
      return (
        <>
          <AiFillCar className={className} />
          <p>{categoryCache.getTransactionCategoryName(categoryId)}</p>
        </>
      );
    case 'TRANSFER':
      return (
        <>
          <BsFillPiggyBankFill className={className} />
          <p>{categoryCache.getTransactionCategoryName(categoryId)}</p>
        </>
      );
    default:
      return (
        <>
          <BiDotsHorizontalRounded className={className} />
          <p>{categoryCache.getTransactionCategoryName(categoryId)}</p>
        </>
      );
  }
};

export const getTransactionCategoryIconOnly = (
  categoryId,
  className = 'w-3 h-3 text-gray-500 mr-1'
) => {
  switch (categoryId) {
    case 'FOOD':
      return (
        <>
          <BiSolidBowlRice className={className} />
        </>
      );
    case 'CAFE_AND_SNACK':
      return (
        <>
          <BiSolidCoffee className={className} />
        </>
      );
    case 'STORE':
      return (
        <>
          <BiSolidStore className={className} />
        </>
      );
    case 'PLEASURE':
      return (
        <>
          <BiSolidDrink className={className} />
        </>
      );
    case 'SHOPPING':
      return (
        <>
          <BiSolidShoppingBag className={className} />
        </>
      );
    case 'MEDICAL_TREATMENT':
      return (
        <>
          <FaBriefcaseMedical className={className} />
        </>
      );
    case 'LODGMENT':
      return (
        <>
          <BiSolidBed className={className} />
        </>
      );
    case 'TRANSPORTATION':
      return (
        <>
          <AiFillCar className={className} />
        </>
      );
    case 'TRANSFER':
      return (
        <>
          <BsFillPiggyBankFill className={className} />
        </>
      );
    default:
      return (
        <>
          <BiDotsHorizontalRounded className={className} />
        </>
      );
  }
};

// 그룹 카테고리 아이콘 반환
export const getGroupCategoryIcon = categoryCode => {
  switch (categoryCode) {
    case 'FAMILY':
      return FamilyIcon;
    case 'FRIENDS':
      return FriendIcon;
    case 'COUPLE':
      return LoveIcon;
    case 'COLLEAGUE':
      return PeerIcon;
    default:
      return FriendIcon; // 기본값
  }
};

// 그룹 카테고리 이름 반환
export const getGroupCategoryName = categoryCode => {
  return categoryManager.getCategoryName('group', categoryCode);
};

//그룹 카테고리 아이콘 이모지 이름 반환
export const getGroupCategoryEmojiName = categoryCode => {
  try {
    if (categoryCache.isReady()) {
      return categoryCache.getGroupCategoryEmojiName(categoryCode);
    }
  } catch (error) {
    console.warn('CategoryCache not ready, using fallback:', error);
  }
  
  // 하위 호환성을 위한 fallback
  switch (categoryCode) {
    case 'FRIENDS':
      return categoryCache.getGroupCategoryName(categoryCode);
    case 'COUPLE':
      return categoryCache.getGroupCategoryName(categoryCode);
    case 'FAMILY':
      return categoryCache.getGroupCategoryName(categoryCode);
    case 'COLLEAGUE':
      return categoryCache.getGroupCategoryName(categoryCode);
  }
};

//거래 유형 이름 반환
export const getTransactionTypeName = categoryCode => {
  switch (categoryCode) {
    case 'WITHDRAW':
      return '출금';
    case 'DEPOSIT':
      return '입금';
    case 'CARD':
      return '체크카드';
    default:
      return '기타';
  }
};

// 거래 카테고리 이름 반환 (CategoryManager 사용)
export const getTransactionCategoryName = categoryCode => {
  return categoryManager.getCategoryName('transaction', categoryCode);
};

// 여행 카테고리 이름 반환 (CategoryManager 사용)
export const getTravelCategoryName = categoryCode => {
  return categoryManager.getCategoryName('travel', categoryCode);
};

