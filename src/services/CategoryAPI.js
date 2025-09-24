// API 기본 설정
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// 카테고리 API 클라이언트 (인증 불필요)
class CategoryAPI {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  // 기본 요청 메서드 (인증 헤더 없음)
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Category API Error:', {
          status: response.status,
          statusText: response.statusText,
          url: url,
          errorData: errorData,
        });

        const error = new Error(`HTTP error! status: ${response.status}`);
        error.response = errorData;
        error.status = response.status;
        throw error;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Category API request failed:', error);
      throw error;
    }
  }

  // GET 요청
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  // 그룹 카테고리 조회
  async getGroupCategories() {
    return this.get('/categories/group');
  }

  // 알림 카테고리 조회
  async getAlarmCategories() {
    return this.get('/categories/alarm');
  }

  // 동의사항 카테고리 조회
  async getTermsCategories() {
    return this.get('/categories/terms');
  }

  // 거래내역 카테고리 조회
  async getTransactionCategories() {
    return this.get('/categories/transaction');
  }

  // 여행 카테고리 조회
  async getTravelCategories() {
    return this.get('/categories/travel');
  }
}

// CategoryAPI 인스턴스
const categoryAPI = new CategoryAPI(API_BASE_URL);

export default categoryAPI;
