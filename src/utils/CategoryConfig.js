/**
 * 카테고리 설정 파일
 * 모든 카테고리 관련 설정을 중앙에서 관리
 */

export const CATEGORY_CONFIG = {
  // 거래 카테고리 설정
  transaction: {
    defaultCode: 'FOOD',
    fallbackName: '기타',
    iconMapping: {
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
    }
  },
  
  // 여행 카테고리 설정
  travel: {
    defaultCode: 'LEISURE',
    fallbackName: '기타',
    iconMapping: {
      'FOOD': 'BiSolidBowlRice',
      'LEISURE': 'MdKitesurfing',
      'RECREATION': 'FaTree',
      'CULTURE': 'HiLibrary',
      'SHOPPING': 'AiFillShopping',
      'FESTIVAL': 'MdFestival',
      'SIGHTSEEING': 'BiSolidBus'
    }
  },
  
  // 그룹 카테고리 설정
  group: {
    defaultCode: 'FRIENDS',
    fallbackName: '친구',
    iconMapping: {
      'FRIENDS': 'FaHandshake',
      'COUPLE': 'AiFillHeart',
      'FAMILY': 'MdFamilyRestroom',
      'COLLEAGUE': 'PiBagSimpleFill'
    },
    emojiMapping: {
      'FRIENDS': 'handshake',
      'COUPLE': 'pink-heart',
      'FAMILY': 'couple-with-heart-man-woman',
      'COLLEAGUE': 'briefcase'
    }
  }
};

/**
 * 카테고리 타입별 기본값 가져오기
 */
export const getDefaultCategoryCode = (type) => {
  return CATEGORY_CONFIG[type]?.defaultCode || 'ETC';
};

/**
 * 카테고리 타입별 fallback 이름 가져오기
 */
export const getFallbackName = (type) => {
  return CATEGORY_CONFIG[type]?.fallbackName || '기타';
};

/**
 * 아이콘 매핑 가져오기
 */
export const getIconMapping = (type) => {
  return CATEGORY_CONFIG[type]?.iconMapping || {};
};

/**
 * 이모지 매핑 가져오기 (그룹 카테고리용)
 */
export const getEmojiMapping = (type) => {
  return CATEGORY_CONFIG[type]?.emojiMapping || {};
};
