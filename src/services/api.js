// API 기본 설정
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// HTTP 클라이언트 클래스
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  // 기본 요청 메서드
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // 토큰이 있으면 헤더에 추가
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, config);
    
    if (!response.ok) {
      // 에러 응답도 JSON으로 파싱해서 전달
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(`HTTP error! status: ${response.status}`);
      error.response = errorData;
      throw error;
    }
    
    const data = await response.json();
    return data;
  }

  // POST 요청
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // GET 요청
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }
}

// API 클라이언트 인스턴스
const apiClient = new ApiClient(API_BASE_URL);

// 인증 관련 API
export const authAPI = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
};

export default apiClient;
