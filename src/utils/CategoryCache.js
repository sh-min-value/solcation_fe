import categoryAPI from '../services/CategoryAPI';

// 전역 캐시 객체
class CategoryCache {
  constructor() {
    this.cache = {
      group: [],
      alarm: [],
      terms: [],
      transaction: [],
      travel: [],
    };

    this.maps = {
      groupMap: {},
      alarmMap: {},
      termsMap: {},
      transactionMap: {},
      travelMap: {},
    };

    this.isLoaded = false;
    this.isLoading = false;
    this.loadPromise = null;
  }

  // 모든 카테고리 데이터 로드
  async loadAllCategories() {
    if (this.isLoaded) {
      return this.cache;
    }

    if (this.isLoading) {
      return this.loadPromise;
    }

    this.isLoading = true;

    this.loadPromise = this._fetchAllCategories();

    try {
      await this.loadPromise;
      this.isLoaded = true;
      console.log('모든 카테고리 데이터 캐싱 완료:', this.cache);
    } catch (error) {
      console.error('카테고리 데이터 로딩 실패:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }

    return this.cache;
  }

  async _fetchAllCategories() {
    const [
      groupCategories,
      alarmCategories,
      termsCategories,
      transactionCategories,
      travelCategories,
    ] = await Promise.all([
      categoryAPI.getGroupCategories(),
      categoryAPI.getAlarmCategories(),
      categoryAPI.getTermsCategories(),
      categoryAPI.getTransactionCategories(),
      categoryAPI.getTravelCategories(),
    ]);

    // 캐시 업데이트
    this.cache = {
      group: groupCategories,
      alarm: alarmCategories,
      terms: termsCategories,
      transaction: transactionCategories,
      travel: travelCategories,
    };

    // 맵 생성
    this.maps = {
      groupMap: this._createCategoryMap(groupCategories),
      alarmMap: this._createCategoryMap(alarmCategories),
      termsMap: this._createCategoryMap(termsCategories),
      transactionMap: this._createCategoryMap(transactionCategories),
      travelMap: this._createCategoryMap(travelCategories),
    };
  }

  // 카테고리 배열을 맵으로 변환
  _createCategoryMap(categoryArray) {
    return categoryArray.reduce((map, category) => {
      // TransactionCategory
      if (category.tcCode) {
        map[category.tcCode] = category;
        if (category.tcPk) map[category.tcPk] = category;
      }
      // GroupCategory
      if (category.gcCode) {
        map[category.gcCode] = category;
        if (category.gcPk) map[category.gcPk] = category;
      }
      // TravelPlanCategory
      if (category.tpcCode) {
        map[category.tpcCode] = category;
        if (category.tpcPk) map[category.tpcPk] = category;
      }
      // AlarmCategory
      if (category.acCode) {
        map[category.acCode] = category;
        if (category.acPk) map[category.acPk] = category;
      }
      // TermsCategory
      if (category.termsCode) {
        map[category.termsCode] = category;
        if (category.termsPk) map[category.termsPk] = category;
      }

      // 기존 범용 필드들도 유지 (하위 호환성)
      if (category.id) map[category.id] = category;
      if (category.code) map[category.code] = category;
      if (category.categoryCode) map[category.categoryCode] = category;

      return map;
    }, {});
  }

  // 동기 방식 조회 함수들 (캐시된 데이터에서만)
  getCategoryByCode(type, code) {
    if (!this.isLoaded) {
      console.warn(
        '카테고리 데이터가 아직 로드되지 않았습니다. loadAllCategories()를 먼저 호출하세요.'
      );
      return null;
    }
    const mapName = `${type}Map`;
    return this.maps[mapName]?.[code] || null;
  }

  getCategoryById(type, id) {
    if (!this.isLoaded) {
      console.warn(
        '카테고리 데이터가 아직 로드되지 않았습니다. loadAllCategories()를 먼저 호출하세요.'
      );
      return null;
    }
    const mapName = `${type}Map`;
    return this.maps[mapName]?.[id] || null;
  }

  // === 거래 카테고리 (TransactionCategory) 조회 함수들 ===
  getTransactionCategoryByCode(code) {
    if (!this.isLoaded) return null;
    return this.maps.transactionMap[code] || null;
  }

  getTransactionCategoryName(code) {
    const category = this.getTransactionCategoryByCode(code);
    return category?.tcName || '기타';
  }

  getTransactionCategoryIcon(code) {
    const category = this.getTransactionCategoryByCode(code);
    return category?.tcIcon || '';
  }

  getTransactionCategoryPk(code) {
    const category = this.getTransactionCategoryByCode(code);
    return category?.tcPk || null;
  }

  // === 그룹 카테고리 (GroupCategory) 조회 함수들 ===
  getGroupCategoryByCode(code) {
    if (!this.isLoaded) return null;
    return this.maps.groupMap[code] || null;
  }

  getGroupCategoryName(code) {
    const category = this.getGroupCategoryByCode(code);
    return category?.gcName || '기타';
  }

  getGroupCategoryIcon(code) {
    const category = this.getGroupCategoryByCode(code);
    return category?.gcIcon || '';
  }

  getGroupCategoryPk(code) {
    const category = this.getGroupCategoryByCode(code);
    return category?.gcPk || null;
  }

  // === 여행 카테고리 (TravelPlanCategory) 조회 함수들 ===
  getTravelCategoryByCode(code) {
    if (!this.isLoaded) return null;
    return this.maps.travelMap[code] || null;
  }

  getTravelCategoryName(code) {
    const category = this.getTravelCategoryByCode(code);
    return category?.tpcName || '기타';
  }

  getTravelCategoryIcon(code) {
    const category = this.getTravelCategoryByCode(code);
    return category?.tpcIcon || '';
  }

  getTravelCategoryPk(code) {
    const category = this.getTravelCategoryByCode(code);
    return category?.tpcPk || null;
  }

  // === 알림 카테고리 (AlarmCategory) 조회 함수들 ===
  getAlarmCategoryByCode(code) {
    if (!this.isLoaded) return null;
    return this.maps.alarmMap[code] || null;
  }

  getAlarmCategoryDest(code) {
    const category = this.getAlarmCategoryByCode(code);
    return category?.acDest || '';
  }

  getAlarmCategoryPk(code) {
    const category = this.getAlarmCategoryByCode(code);
    return category?.acPk || null;
  }

  // === 약관 카테고리 (TermsCategory) 조회 함수들 ===
  getTermsCategoryByCode(code) {
    if (!this.isLoaded) return null;
    return this.maps.termsMap[code] || null;
  }

  getTermsCategoryPk(code) {
    const category = this.getTermsCategoryByCode(code);
    return category?.termsPk || null;
  }

  // 전체 카테고리 데이터 조회
  getAllCategories() {
    return this.cache;
  }

  // 특정 타입의 카테고리 리스트 조회
  getCategoriesByType(type) {
    return this.cache[type] || [];
  }

  // 캐시 상태 확인
  isReady() {
    return this.isLoaded;
  }

  // 캐시 초기화 (필요시)
  clearCache() {
    this.cache = {
      group: [],
      alarm: [],
      terms: [],
      transaction: [],
      travel: [],
    };
    this.maps = {
      groupMap: {},
      alarmMap: {},
      termsMap: {},
      transactionMap: {},
      travelMap: {},
    };
    this.isLoaded = false;
    this.isLoading = false;
    this.loadPromise = null;
  }
}

// 싱글톤 인스턴스
const categoryCache = new CategoryCache();

export default categoryCache;
