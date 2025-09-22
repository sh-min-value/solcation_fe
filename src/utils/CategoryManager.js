import categoryCache from './CategoryCache';

/**
 * 통합된 카테고리 매니저
 * CategoryCache와 하드코딩된 fallback을 효율적으로 관리
 */
class CategoryManager {
  constructor() {
    this.fallbackMaps = {
      // 거래 카테고리 fallback
      transaction: {
        'FOOD': '식비',
        'CAFE_AND_SNACK': '카페, 간식',
        'STORE': '편의점, 마트',
        'PLEASURE': '술, 유흥',
        'SHOPPING': '쇼핑',
        'MEDICAL_TREATMENT': '의료',
        'LODGMENT': '숙박',
        'TRANSPORTATION': '교통',
        'TRANSFER': '이체',
        'ETC': '기타'
      },
      // 여행 카테고리 fallback
      travel: {
        'FOOD': '음식, 미식',
        'LEISURE': '레저, 액티비티',
        'RECREATION': '휴양, 힐링',
        'CULTURE': '문화, 역사',
        'SHOPPING': '쇼핑, SNS 핫플레이스',
        'FESTIVAL': '시즌 축제',
        'SIGHTSEEING': '관광'
      },
      // 그룹 카테고리 fallback
      group: {
        'FRIENDS': '친구',
        'COUPLE': '연인',
        'FAMILY': '가족',
        'COLLEAGUE': '동료'
      },
      // 이모지 fallback
      emoji: {
        'FRIENDS': 'handshake',
        'COUPLE': 'pink-heart',
        'FAMILY': 'couple-with-heart-man-woman',
        'COLLEAGUE': 'briefcase'
      }
    };
  }

  /**
   * 안전하게 카테고리 이름을 가져오는 메서드
   */
  getCategoryName(type, code) {
    try {
      if (categoryCache.isReady()) {
        switch (type) {
          case 'transaction':
            return categoryCache.getTransactionCategoryName(code);
          case 'travel':
            return categoryCache.getTravelCategoryName(code);
          case 'group':
            return categoryCache.getGroupCategoryName(code);
          default:
            return this.getFallbackName(type, code);
        }
      }
    } catch (error) {
      console.warn(`CategoryCache not ready for ${type}, using fallback:`, error);
    }
    
    return this.getFallbackName(type, code);
  }

  /**
   * 안전하게 이모지 이름을 가져오는 메서드
   */
  getEmojiName(type, code) {
    try {
      if (categoryCache.isReady()) {
        switch (type) {
          case 'group':
            return categoryCache.getGroupCategoryEmojiName(code);
          default:
            return this.getFallbackEmoji(type, code);
        }
      }
    } catch (error) {
      console.warn(`CategoryCache not ready for ${type} emoji, using fallback:`, error);
    }
    
    return this.getFallbackEmoji(type, code);
  }

  /**
   * Fallback 이름 가져오기
   */
  getFallbackName(type, code) {
    const fallbackMap = this.fallbackMaps[type];
    return fallbackMap?.[code] || this.getDefaultName(type);
  }

  /**
   * Fallback 이모지 가져오기
   */
  getFallbackEmoji(type, code) {
    const fallbackMap = this.fallbackMaps.emoji;
    return fallbackMap?.[code] || 'handshake';
  }

  /**
   * 기본 이름 반환
   */
  getDefaultName(type) {
    const defaults = {
      transaction: '기타',
      travel: '기타',
      group: '친구'
    };
    return defaults[type] || '기타';
  }

  /**
   * 모든 카테고리 타입에 대한 이름 가져오기
   */
  getAllCategoryNames(type) {
    try {
      if (categoryCache.isReady()) {
        const categories = categoryCache.getCategoriesByType(type);
        return categories.map(cat => ({
          code: cat.code,
          name: cat.name
        }));
      }
    } catch (error) {
      console.warn(`CategoryCache not ready for ${type}, using fallback:`, error);
    }
    
    // Fallback 데이터 반환
    const fallbackMap = this.fallbackMaps[type];
    return Object.entries(fallbackMap).map(([code, name]) => ({
      code,
      name
    }));
  }
}

// 싱글톤 인스턴스
const categoryManager = new CategoryManager();

export default categoryManager;
