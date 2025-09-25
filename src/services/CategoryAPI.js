import apiClient from './api';

// 카테고리 API 클라이언트 (인증 불필요)
class CategoryAPI {
  // 그룹 카테고리 조회
  async getGroupCategories() {
    return apiClient.get('/categories/group');
  }

  // 알림 카테고리 조회
  async getAlarmCategories() {
    return apiClient.get('/categories/alarm');
  }

  // 동의사항 카테고리 조회
  async getTermsCategories() {
    return apiClient.get('/categories/terms');
  }

  // 거래내역 카테고리 조회
  async getTransactionCategories() {
    return apiClient.get('/categories/transaction');
  }

  // 여행 카테고리 조회
  async getTravelCategories() {
    return apiClient.get('/categories/travel');
  }
}

// CategoryAPI 인스턴스
const categoryAPI = new CategoryAPI();

export default categoryAPI;
