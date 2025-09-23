// API 기본 설정
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// 회원가입 API 클라이언트 (인증 불필요)
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

  // POST 요청
  async post(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  //아이디 중복 체크
  async checkDup(id) {
    return this.get(`/auth/check-dup?userId=${id}`);
  }

  //회원가입
  async signUp(data) {
    return this.post('/auth/sign-up', data);
  }
}

// CategoryAPI 인스턴스
const SignupAPI = new CategoryAPI(API_BASE_URL);

export default SignupAPI;
